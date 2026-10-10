import { renderPage } from '../lib/render.js';

export default function handler(req, res) {
  const content = `
    <div class="flex-1 flex flex-col items-center justify-between p-6">
      <header class="flex flex-col items-center mt-12 text-center">
        <img src="https://combineoverwiki.net/images/f/f3/A01151_Main.png" alt="Combine OverWiki Logo" class="w-24 h-24 mb-4 filter invert opacity-90" />
        <h1 class="text-5xl font-extrabold tracking-tight">Larpmail</h1>
        <p class="text-zinc-400 mt-2 text-lg">the most LARP email service you will ever see</p>
        <a href="/login" class="mt-6 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold transition">Sign In</a>
      </header>

      <section class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full my-12">
        <div class="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex flex-col items-start">
          <svg class="w-8 h-8 text-indigo-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          <h2 class="text-xl font-bold mb-1">private</h2>
          <p class="text-zinc-400 text-sm">unlike some providers.... we don't spy on your emails</p>
        </div>
        <div class="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex flex-col items-start">
          <svg class="w-8 h-8 text-indigo-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          <h2 class="text-xl font-bold mb-1">accounts</h2>
          <p class="text-zinc-400 text-sm">to get an invite, you can request <span class="text-indigo-300 font-mono">@notpoppy_rblx</span> on discord.</p>
        </div>
        <div class="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex flex-col items-start">
          <svg class="w-8 h-8 text-indigo-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          <h2 class="text-xl font-bold mb-1">fast</h2>
          <p class="text-zinc-400 text-sm">this email service is very fast.</p>
        </div>
      </section>

      <footer class="text-zinc-600 text-xs text-center pb-4">
        &copy; larpmail.vmlinuz.co.ke
      </footer>
    </div>
  `;
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(renderPage('Larpmail - Home', content));
}
