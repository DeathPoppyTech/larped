import { prisma } from '../lib/prisma.js';
import { getUserFromReq } from '../lib/auth.js';
import { renderPage } from '../lib/render.js';

export default async function handler(req, res) {
  const user = await getUserFromReq(req);
  if (!user) {
    res.writeHead(302, { Location: '/login' });
    return res.end();
  }

  const messages = await prisma.message.findMany({ where: { userId: user.id } });

  const content = `
    <div class="flex-1 flex">
      <aside class="w-64 border-r border-zinc-800 p-4 flex flex-col justify-between">
        <div class="space-y-4">
          <div class="text-xl font-bold tracking-tight px-2">Larpmail</div>
          <nav class="space-y-1 text-sm">
            <a href="/dashboard" class="block bg-zinc-800 text-white px-3 py-2 rounded">inbox</a>
            ${['ADMIN', 'SUPERUSER'].includes(user.role) ? `<a href="/admin" class="block text-zinc-400 hover:bg-zinc-800 px-3 py-2 rounded">admin console</a>` : ''}
          </nav>
        </div>
        <div class="border-t border-zinc-800 pt-3 text-xs text-zinc-400">
          logged in as <span class="font-bold text-zinc-200">${user.username}@vmlinuz.co.ke</span> (${user.role})
        </div>
      </aside>
      <main class="flex-1 p-8">
        <h1 class="text-2xl font-bold mb-4">inbox</h1>
        <div class="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          ${messages.length === 0 ? '<div class="p-6 text-zinc-500 text-sm">no messages found in your inbox.</div>' : `
            <table class="w-full text-left text-sm text-zinc-300">
              <thead class="bg-zinc-950 text-zinc-500 border-b border-zinc-800">
                <tr>
                  <th class="p-3">from</th>
                  <th class="p-3">subject</th>
                  <th class="p-3">date</th>
                </tr>
              </thead>
              <tbody>
                ${messages.map(m => `
                  <tr class="border-b border-zinc-800 hover:bg-zinc-800/50">
                    <td class="p-3 font-mono text-xs">${m.sender}</td>
                    <td class="p-3 font-medium text-white">${m.subject}</td>
                    <td class="p-3 text-xs text-zinc-500">${new Date(m.createdAt).toLocaleDateString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `}
        </div>
      </main>
    </div>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(renderPage('Larpmail - Inbox', content));
}
