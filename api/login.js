import bcrypt from 'bcrypt';
import cookie from 'cookie';
import { prisma } from '../lib/prisma.js';
import { signToken } from '../lib/auth.js';
import { renderTemplate } from '../lib/render.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const page = await renderTemplate('login', 'Larpmail - Sign In');
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(page);
  }

  if (req.method === 'POST') {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send('Invalid credentials');
    }

    const token = signToken({ id: user.id, role: user.role });
    res.setHeader('Set-Cookie', cookie.serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 604800,
      path: '/'
    }));

    res.writeHead(302, { Location: '/dashboard' });
    return res.end();
  }
}
