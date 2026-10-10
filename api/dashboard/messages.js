import { prisma } from '../../lib/prisma.js';
import { getUserFromReq } from '../../lib/auth.js';

export default async function handler(req, res) {
  const user = await getUserFromReq(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const messages = await prisma.message.findMany({ where: { userId: user.id } });

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ user, messages });
}
