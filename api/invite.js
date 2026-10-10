import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma.js';
import { renderTemplate } from '../lib/render.js';

export default async function handler(req, res) {
  const { code } = req.query;

  const invite = await prisma.invite.findUnique({ where: { code } });
  if (!invite || invite.used) {
    return res.status(400).send('Invalid or used invite link.');
  }

  if (req.method === 'GET') {
    const page = await renderTemplate('invite', 'Larpmail - Join', { INVITE_CODE: code });
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(page);
  }

  if (req.method === 'POST') {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.$transaction([
      prisma.user.create({
        data: { username, password: hashedPassword, role: 'USER' }
      }),
      prisma.invite.update({
        where: { id: invite.id },
        data: { used: true }
      })
    ]);

    res.writeHead(302, { Location: '/login' });
    return res.end();
  }
}
