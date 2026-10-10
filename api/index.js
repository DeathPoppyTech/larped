import { renderPage } from '../lib/render.js';

export default function handler(req, res) {
  const content = `
    <div class="flex-1 flex flex-col items-center justify-between p-6">
      <!-- Header / Hero Section -->
      <header class="flex flex-col items-center mt-12 text-center max-w-2xl">
        <img 
          src="https://combineoverwiki.net/images/f/f3/A01151_Main.png" 
          alt="Combine OverWiki Logo" 
          class="w-24 h-24 mb-4 filter invert opacity-90 transition-transform duration-300 hover:scale-105" 
        />
        <h1 class="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          Larpmail
        </h1>
        <p class="text-zinc-400 mt-3 text-lg font-medium leading-relaxed">
          the most LARP email service you will ever see
        </p>

        <!-- Action Buttons -->
        <div class="mt-8 flex items-center space-x-4">
          <a 
            href="/login" 
            class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            Sign In
          </a>
          <button 
            onclick="document.getElementById('access-modal').classList.remove('hidden')" 
            class="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg font-semibold text-sm transition-all active:scale-95 text-zinc-300"
          >
            Get Access
          </button>
        </div>
      </header>

      <!-- Three Core Features Grid -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full my-12">
        <!-- Card 1: Private -->
        <div class="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 p-6 rounded-xl flex flex-col items-start transition-colors hover:border-zinc-700">
          <div class="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg mb-4 text-indigo-400">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h2 class="text-xl font-bold mb-1">private</h2>
          <p class="text-zinc-400 text-sm leading-relaxed">unlike some providers.... we don't spy on your emails</p>
        </div>

        <!-- Card 2: Accounts -->
        <div class="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 p-6 rounded-xl flex flex-col items-start transition-colors hover:border-zinc-700">
          <div class="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg mb-4 text-indigo-400">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <h2 class="text-xl font-bold mb-1">accounts</h2>
          <p class="text-zinc-400 text-sm leading-relaxed">to get an invite, you can request <span class="text-indigo-300 font-mono bg-indigo-950/60 border border-indigo-800/40 px-1.5 py-0.5 rounded">@notpoppy_rblx</span> on discord.</p>
        </div>

        <!-- Card 3: Fast -->
        <div class="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 p-6 rounded-xl flex flex-col items-start transition-colors hover:border-zinc-700">
          <div class="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg mb-4 text-indigo-400">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h2 class="text-xl font-bold mb-1">fast</h2>
          <p class="text-zinc-400 text-sm leading-relaxed">this email service is very fast.</p>
        </div>
      </section>

      <!-- Footer -->
      <footer class="text-zinc-600 text-xs text-center pb-4">
        &copy; larpmail.vmlinuz.co.ke
      </footer>
    </div>

    <!-- Modal for Quick Access Info -->
    <div id="access-modal" class="hidden fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-zinc-900 border border-zinc-800 p-6 rounded-xl max-w-sm w-full space-y-4 shadow-2xl">
        <h3 class="text-lg font-bold text-white">How to Get Access</h3>
        <p class="text-xs text-zinc-400 leading-relaxed">
          Larpmail is invite-only to prevent spam.
        </p>
        <div class="bg-zinc-950 p-3 rounded border border-zinc-800 font-mono text-xs text-indigo-300 select-all">
          @notpoppy_rblx
        </div>
        <button 
          onclick="document.getElementById('access-modal').classList.add('hidden')" 
          class="w-full bg-zinc-800 hover:bg-zinc-700 text-xs py-2 rounded font-medium text-zinc-300 transition"
        >
          Close
        </button>
      </div>
    </div>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(renderPage('Larpmail - Home', content));
}
