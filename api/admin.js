import { prisma } from '../lib/prisma.js';
import { getUserFromReq } from '../lib/auth.js';
import { renderPage } from '../lib/render.js';

export default async function handler(req, res) {
  const user = await getUserFromReq(req);
  if (!user || !['ADMIN', 'SUPERUSER'].includes(user.role)) {
    return res.status(403).send('Access Denied: Insufficient Permissions');
  }

  if (req.method === 'POST') {
    const { action, userId, targetRole } = req.body;

    if (action === 'create_invite') {
      await prisma.invite.create({ data: { createdById: user.id } });
    } else if (action === 'update_role' && user.role === 'SUPERUSER') {
      await prisma.user.update({ where: { id: userId }, data: { role: targetRole } });
    } else if (action === 'delete_user') {
      const target = await prisma.user.findUnique({ where: { id: userId } });
      if (user.role === 'SUPERUSER' || (user.role === 'ADMIN' && target.role === 'USER' && target.id !== user.id)) {
        await prisma.user.delete({ where: { id: userId } });
      }
    }
    res.writeHead(302, { Location: '/admin' });
    return res.end();
  }

  const users = await prisma.user.findMany();
  const invites = await prisma.invite.findMany({ include: { createdBy: true } });
  const logs = user.role === 'SUPERUSER' ? await prisma.devLog.findMany({ take: 25, orderBy: { timestamp: 'desc' } }) : [];

  const content = `
    <div class="flex-1 flex">
      <aside class="w-64 border-r border-zinc-800 p-4 flex flex-col justify-between">
        <div class="space-y-4">
          <div class="text-xl font-bold tracking-tight px-2">larpmail admin</div>
          <nav class="space-y-1 text-sm">
            <a href="/dashboard" class="block text-zinc-400 hover:bg-zinc-800 px-3 py-2 rounded">back to inbox</a>
            <a href="/admin" class="block bg-zinc-800 text-white px-3 py-2 rounded">admin console</a>
          </nav>
        </div>
      </aside>

      <main class="flex-1 p-8 space-y-8 overflow-y-auto">
        <!-- Invite Provisioning -->
        <section class="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">
          <h2 class="text-lg font-bold">invite provisioning</h2>
          <form action="/api/admin" method="POST">
            <input type="hidden" name="action" value="create_invite">
            <button type="submit" class="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded text-sm font-semibold">generate single-use invite link</button>
          </form>
          <div class="space-y-2">
            ${invites.map(i => `
              <div class="flex items-center justify-between text-xs bg-zinc-950 p-2.5 border border-zinc-800 rounded font-mono">
                <span>https://larpmail.vmlinuz.co.ke/invite/${i.code}</span>
                <span class="${i.used ? 'text-red-400' : 'text-green-400'}">${i.used ? 'USED' : 'ACTIVE'}</span>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- User Management -->
        <section class="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">
          <h2 class="text-lg font-bold">user management</h2>
          <table class="w-full text-left text-sm text-zinc-300">
            <thead class="bg-zinc-950 text-zinc-500 border-b border-zinc-800">
              <tr>
                <th class="p-3">handle</th>
                <th class="p-3">role</th>
                <th class="p-3">actions</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(u => `
                <tr class="border-b border-zinc-800">
                  <td class="p-3 font-mono">${u.username}@vmlinuz.co.ke</td>
                  <td class="p-3"><span class="px-2 py-0.5 rounded text-xs bg-zinc-800">${u.role}</span></td>
                  <td class="p-3 space-x-2">
                    ${user.role === 'SUPERUSER' && u.role !== 'SUPERUSER' ? `
                      <form action="/api/admin" method="POST" class="inline">
                        <input type="hidden" name="action" value="update_role">
                        <input type="hidden" name="userId" value="${u.id}">
                        <input type="hidden" name="targetRole" value="${u.role === 'ADMIN' ? 'USER' : 'ADMIN'}">
                        <button type="submit" class="text-xs text-indigo-400 hover:underline">${u.role === 'ADMIN' ? 'demote to user' : 'promote to admin'}</button>
                      </form>
                    ` : ''}
                    ${user.role === 'SUPERUSER' || (user.role === 'ADMIN' && u.role === 'USER') ? `
                      <form action="/api/admin" method="POST" class="inline">
                        <input type="hidden" name="action" value="delete_user">
                        <input type="hidden" name="userId" value="${u.id}">
                        <button type="submit" class="text-xs text-red-400 hover:underline">remove user</button>
                      </form>
                    ` : ''}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </section>

        <!-- Dev Menu (SUPERUSER Only - Excludes Message Bodies) -->
        ${user.role === 'SUPERUSER' ? `
          <section class="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">
            <h2 class="text-lg font-bold text-amber-400">dev menu</h2>
            <p class="text-xs text-zinc-500">transmission telemetry, status delivery checks, and system errors (message contents are strictly excluded).</p>
            <div class="bg-zinc-950 border border-zinc-800 rounded p-4 font-mono text-xs space-y-2 max-h-60 overflow-y-auto">
              ${logs.length === 0 ? '<div class="text-zinc-600">no telemetry logs captured.</div>' : logs.map(l => `
                <div class="flex justify-between border-b border-zinc-900 pb-1">
                  <span class="text-zinc-400">[${new Date(l.timestamp).toISOString()}] [${l.type}] ${l.action}</span>
                  <span class="text-zinc-500">${l.details}</span>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}
      </main>
    </div>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(renderPage('Larpmail - Admin Console', content));
}
