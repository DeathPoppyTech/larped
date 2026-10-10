import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma.js';

export default async function handler(req, res) {
  // Security check: only allow if a secret query param matches
  if (req.query.secret !== 'my-secret-bootstrap-key') {
    return res.status(403).send('Unauthorized');
  }

  const username = 'poppy'; // Change to your handle
  const plainPassword = 'Getrobux09@'; // Change to your password

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = await prisma.user.upsert({
    where: { username },
    update: { password: hashedPassword, role: 'SUPERUSER' },
    create: { username, password: hashedPassword, role: 'SUPERUSER' }
  });

  res.send(`Success! Superuser created for ${user.username}@vmlinuz.co.ke. Now delete api/bootstrap.js and redeploy.`);
}
