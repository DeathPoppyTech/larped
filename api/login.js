import bcrypt from 'bcrypt';
import cookie from 'cookie';
import { prisma } from '../lib/prisma.js';
import { signToken } from '../lib/auth.js';
import { renderPage } from '../lib/render.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const content = `
      <div class="flex-1 flex items-center justify-center p-4">
        <div class="bg-zinc-900 border border-zinc-800 p-8 rounded-xl max-w-md w-full shadow-2xl">
          <h2 class="text-2xl font-bold mb-1 text-center">welcome back to larpmail</h2>
          <p class="text-zinc-400 text-xs text-center mb-6">enter your credentials below</p>
          <form action="/api/login" method="POST" class="space-y-4">
            <div>
              <label class="block text-xs uppercase tracking-wider text-zinc-400 mb-1">username:</label>
              <input type="text" name="username" required class="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500">
            </div>
            <div>
              <label class="block text-xs uppercase tracking-wider text-zinc-400 mb-1">password:</label>
              <input type="password" name="password" required class="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500">
            </div>
            <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-500 py-2 rounded text-sm font-semibold transition">[log in]</button>
          </form>
          <div class="flex justify-between items-center text-xs text-zinc-400 mt-6 pt-4 border-t border-zinc-800">
            <a href="#" class="hover:underline">forgot password?</a>
            <span class="text-zinc-600">|</span>
            <a href="#" class="hover:underline">get access</a>
          </div>
        </div>
      </div>
    `;
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(renderPage('Larpmail - Sign In', content));
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
