import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma.js';
import { renderPage } from '../lib/render.js';

export default async function handler(req, res) {
  const { code } = req.query;

  const invite = await prisma.invite.findUnique({ where: { code } });
  if (!invite || invite.used) {
    return res.status(400).send('Invalid or used invite link.');
  }

  if (req.method === 'GET') {
    const content = `
      <div class="flex-1 flex items-center justify-center p-4">
        <div class="bg-zinc-900 border border-zinc-800 p-8 rounded-xl max-w-md w-full shadow-2xl">
          <h2 class="text-2xl font-bold text-center">you've been invited to join larpmail :)</h2>
          <p class="text-zinc-400 text-xs text-center mb-6 mt-1">just fill this out rq</p>
          <form action="/api/invite?code=${code}" method="POST" class="space-y-4">
            <div>
              <label class="block text-xs uppercase tracking-wider text-zinc-400 mb-1">username (this will be used for your handle e.g bobmarley@vmlinuz.co.ke)</label>
              <div class="flex items-center bg-zinc-950 border border-zinc-800 rounded px-3 py-2">
                <input type="text" name="username" placeholder="bobmarley" required class="bg-transparent text-sm w-full focus:outline-none">
                <span class="text-xs text-zinc-500">@vmlinuz.co.ke</span>
              </div>
            </div>
            <div>
              <label class="block text-xs uppercase tracking-wider text-zinc-400 mb-1">password:</label>
              <input type="password" name="password" required class="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500">
            </div>
            <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-500 py-2 rounded text-sm font-semibold transition">[create profile now]</button>
          </form>
        </div>
      </div>
    `;
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(renderPage('Larpmail - Join', content));
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
