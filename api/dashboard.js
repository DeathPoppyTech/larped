import { prisma } from '../lib/prisma.js';
import { getUserFromReq } from '../lib/auth.js';
import { renderTemplate } from '../lib/render.js';

export default async function handler(req, res) {
  const user = await getUserFromReq(req);
  if (!user) {
    res.writeHead(302, { Location: '/login' });
    return res.end();
  }

  const messages = await prisma.message.findMany({ where: { userId: user.id } });

  const messagesTable = messages.length === 0 
    ? '<div class="p-6 text-zinc-500 text-sm">no messages found in your inbox.</div>'
    : `
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
    `;

  const page = await renderTemplate('dashboard', 'Larpmail - Inbox', {
    USER_HANDLE: `${user.username}@vmlinuz.co.ke`,
    USER_ROLE: user.role,
    ADMIN_LINK: ['ADMIN', 'SUPERUSER'].includes(user.role) ? '<a href="/admin" class="block text-zinc-400 hover:bg-zinc-800 px-3 py-2 rounded">admin console</a>' : '',
    MESSAGES_TABLE: messagesTable
  });

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(page);
}
