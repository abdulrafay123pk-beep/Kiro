// ══════════════════════════════════════════════════════════════
//  SISTEMA AVATAR SBLOCCABILI — avatars.js
//  Gli SVG sono inline così non servono file esterni.
//  Ogni avatar ha: id, name, desc, condition (funzione), svg
// ══════════════════════════════════════════════════════════════

// ── Helper: leggi stats da localStorage ──────────────────────
function getStats() {
  return {
    snakeBest  : parseInt(localStorage.getItem('snakeBest')   || '0'),
    chessWins  : parseInt(localStorage.getItem('chessWins')   || '0'),
    memoryBest : parseInt(localStorage.getItem('memoryBest')  || '9999'), // mosse (meno = meglio)
    breakLevel : parseInt(localStorage.getItem('breakLevel')  || '0'),
    trisWins   : parseInt(localStorage.getItem('trisWins')    || '0'),
    totalGames : parseInt(localStorage.getItem('totalGames')  || '0'),
  };
}
function saveStats(key, val) {
  var cur = parseInt(localStorage.getItem(key) || '0');
  if (key === 'memoryBest') {
    if (val < cur || cur === 0) localStorage.setItem(key, val);
  } else {
    if (val > cur) localStorage.setItem(key, val);
    else localStorage.setItem(key, cur + (key === 'totalGames' || key === 'chessWins' || key === 'trisWins' ? val : 0));
  }
  checkUnlocks();
}
function incrementStat(key) {
  var cur = parseInt(localStorage.getItem(key) || '0');
  localStorage.setItem(key, cur + 1);
  checkUnlocks();
}

// ── Salva unlock ──────────────────────────────────────────────
function isUnlocked(id) {
  var ul = JSON.parse(localStorage.getItem('neon_unlocked') || '[]');
  return ul.indexOf(id) !== -1;
}
function unlock(id) {
  var ul = JSON.parse(localStorage.getItem('neon_unlocked') || '[]');
  if (ul.indexOf(id) === -1) {
    ul.push(id);
    localStorage.setItem('neon_unlocked', JSON.stringify(ul));
    showUnlockToast(id);
  }
}
function checkUnlocks() {
  AVATARS.forEach(function(av) {
    if (!av.starter && !isUnlocked(av.id) && av.condition()) unlock(av.id);
  });
}

// ── Toast di sblocco ──────────────────────────────────────────
function showUnlockToast(id) {
  var av = AVATARS.find(function(a){ return a.id === id; });
  if (!av) return;
  var old = document.getElementById('unlock-toast');
  if (old) old.remove();
  var d = document.createElement('div');
  d.id = 'unlock-toast';
  d.style.cssText = 'position:fixed;bottom:2rem;right:2rem;background:linear-gradient(135deg,#320047,#002022);border:1px solid #ecb2ff;color:#fff;font-family:"Plus Jakarta Sans",sans-serif;padding:1rem 1.25rem;border-radius:.75rem;z-index:9999;box-shadow:0 0 30px rgba(189,0,255,.5);display:flex;align-items:center;gap:.75rem;max-width:280px;animation:slideIn .4s ease';
  d.innerHTML = '<div style="font-size:2.5rem;flex-shrink:0">' + svgToEmoji(av.svg) + '</div>'
    + '<div><div style="font-size:10px;letter-spacing:.08em;color:#00dbe9;font-weight:700;margin-bottom:.2rem">🔓 AVATAR SBLOCCATO</div>'
    + '<div style="font-size:13px;font-weight:700;color:#ecb2ff">' + av.name + '</div>'
    + '<div style="font-size:11px;color:#d4c0d7;margin-top:.15rem">' + av.desc + '</div></div>';
  var style = document.createElement('style');
  style.textContent = '@keyframes slideIn{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}';
  document.head.appendChild(style);
  document.body.appendChild(d);
  setTimeout(function(){ d.style.transition='opacity .5s'; d.style.opacity='0'; setTimeout(function(){ d.remove(); },500); }, 4000);
}
function svgToEmoji(svg) {
  // Estrae l'emoji dal SVG per il toast
  var m = svg.match(/<text[^>]*>([^<]+)<\/text>/);
  return m ? m[1] : '🎮';
}

// ── Definizione Avatar ────────────────────────────────────────
// Ogni SVG è un cerchio 120x120 con sfondo neon e simbolo centrale
var S = 120; // dimensione SVG

function makeSVG(bg1, bg2, glow, emoji, badge) {
  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + S + '" height="' + S + '" viewBox="0 0 ' + S + ' ' + S + '">'
    + '<defs>'
    + '<radialGradient id="bg" cx="35%" cy="28%" r="75%"><stop offset="0%" stop-color="#ffffff" stop-opacity=".20"/><stop offset="18%" stop-color="' + bg1 + '"/><stop offset="100%" stop-color="' + bg2 + '"/></radialGradient>'
    + '<radialGradient id="shine" cx="30%" cy="22%" r="55%"><stop offset="0%" stop-color="#ffffff" stop-opacity=".55"/><stop offset="35%" stop-color="#ffffff" stop-opacity=".12"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0"/></radialGradient>'
    + '<radialGradient id="halo" cx="50%" cy="50%" r="60%"><stop offset="55%" stop-color="' + glow + '" stop-opacity="0"/><stop offset="100%" stop-color="' + glow + '" stop-opacity=".35"/></radialGradient>'
    + '<filter id="glow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
    + '<filter id="shadow"><feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity=".35"/></filter>'
    + '</defs>'
    + '<circle cx="60" cy="60" r="60" fill="url(#bg)"/>'
    + '<circle cx="60" cy="60" r="52" fill="url(#halo)" opacity=".85"/>'
    + '<circle cx="60" cy="60" r="57" fill="none" stroke="' + glow + '" stroke-width="2.5" opacity="0.8"/>'
    + '<circle cx="60" cy="60" r="47" fill="none" stroke="#ffffff" stroke-width="1.4" opacity="0.18"/>'
    + '<path d="M18 44c10-16 22-24 42-24s32 8 42 24" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="6" stroke-linecap="round"/>'
    + '<circle cx="42" cy="39" r="10" fill="url(#shine)" opacity=".65"/>'
    + '<text x="60" y="73" font-size="50" text-anchor="middle" filter="url(#shadow)">' + emoji + '</text>'
    + '<text x="60" y="72" font-size="50" text-anchor="middle" filter="url(#glow)" opacity=".95">' + emoji + '</text>'
    + (badge ? '<rect x="36" y="95" width="48" height="14" rx="7" fill="#050510" opacity=".35"/>'
      + '<text x="60" y="105" font-size="8.5" text-anchor="middle" font-family="JetBrains Mono,monospace" fill="' + glow + '" letter-spacing="1.2" font-weight="700">' + badge + '</text>' : '')
    + '</svg>';
}

var AVATARS = [
  // ── STARTER (sempre disponibili) ─────────────────────────────
  {
    id:'starter_rookie', name:'Rookie', desc:'Sempre disponibile', starter:true,
    condition: function(){ return true; },
    svg: makeSVG('#1a1a2e','#0d0d1a','#888888','🎮','ROOKIE')
  },
  {
    id:'starter_ghost', name:'Ghost', desc:'Sempre disponibile', starter:true,
    condition: function(){ return true; },
    svg: makeSVG('#0d0d1a','#0a0a14','#444466','👻','GHOST')
  },

  // ── SNAKE ────────────────────────────────────────────────────
  {
    id:'snake_10', name:'Serpentino', desc:'Raggiungi 10 punti su Snake',
    condition: function(){ return getStats().snakeBest >= 10; },
    svg: makeSVG('#002200','#000d00','#4ade80','🐍','10 PTS')
  },
  {
    id:'snake_30', name:'Viper', desc:'Raggiungi 30 punti su Snake',
    condition: function(){ return getStats().snakeBest >= 30; },
    svg: makeSVG('#003300','#001100','#22c55e','🐍','30 PTS')
  },
  {
    id:'snake_50', name:'King Cobra', desc:'Raggiungi 50 punti su Snake',
    condition: function(){ return getStats().snakeBest >= 50; },
    svg: makeSVG('#004400','#001500','#86efac','🐲','50 PTS')
  },
  {
    id:'snake_100', name:'Anaconda', desc:'Leggenda: 100 punti su Snake',
    condition: function(){ return getStats().snakeBest >= 100; },
    svg: makeSVG('#14532d','#052e16','#00ff88','🦕','100 PTS')
  },

  // ── TRIS ─────────────────────────────────────────────────────
  {
    id:'tris_1', name:'Strategist', desc:'Vinci la prima partita a Tris',
    condition: function(){ return getStats().trisWins >= 1; },
    svg: makeSVG('#1e003a','#0d0020','#a855f7','⭕','1 WIN')
  },
  {
    id:'tris_5', name:'Tactician', desc:'Vinci 5 partite a Tris',
    condition: function(){ return getStats().trisWins >= 5; },
    svg: makeSVG('#2d0050','#130025','#c084fc','♟','5 WINS')
  },
  {
    id:'tris_10', name:'Mastermind', desc:'Vinci 10 partite a Tris',
    condition: function(){ return getStats().trisWins >= 10; },
    svg: makeSVG('#3b0069','#1a0030','#e879f9','🧠','10 WINS')
  },

  // ── MEMORY ───────────────────────────────────────────────────
  {
    id:'memory_first', name:'Mnemonico', desc:'Completa una partita a Memory',
    condition: function(){ return getStats().memoryBest < 9999; },
    svg: makeSVG('#001a3a','#000d20','#60a5fa','🃏','MEMORY')
  },
  {
    id:'memory_40', name:'Memoria Viva', desc:'Completa Memory in meno di 40 mosse',
    condition: function(){ return getStats().memoryBest <= 40; },
    svg: makeSVG('#002050','#000a25','#93c5fd','🧩','<40 MOVES')
  },
  {
    id:'memory_20', name:'Mente Cristallina', desc:'Completa Memory in meno di 20 mosse',
    condition: function(){ return getStats().memoryBest <= 20; },
    svg: makeSVG('#001850','#00062a','#bfdbfe','💎','<20 MOVES')
  },

  // ── BREAKOUT ─────────────────────────────────────────────────
  {
    id:'break_1', name:'Breaker', desc:'Completa il livello 1 di Breakout',
    condition: function(){ return getStats().breakLevel >= 1; },
    svg: makeSVG('#3a1500','#1a0800','#fb923c','🧱','LVL 1')
  },
  {
    id:'break_3', name:'Demolisher', desc:'Raggiungi il livello 3 di Breakout',
    condition: function(){ return getStats().breakLevel >= 3; },
    svg: makeSVG('#4a1800','#200800','#f97316','🔥','LVL 3')
  },
  {
    id:'break_5', name:'Wrecking Ball', desc:'Raggiungi il livello 5 di Breakout',
    condition: function(){ return getStats().breakLevel >= 5; },
    svg: makeSVG('#5a2000','#280a00','#fdba74','💥','LVL 5')
  },

  // ── SCACCHI ──────────────────────────────────────────────────
  {
    id:'chess_1', name:'Pedone', desc:'Vinci la prima partita a Scacchi',
    condition: function(){ return getStats().chessWins >= 1; },
    svg: makeSVG('#1a1200','#0d0800','#fbbf24','♟','1 WIN')
  },
  {
    id:'chess_3', name:'Cavaliere', desc:'Vinci 3 partite a Scacchi',
    condition: function(){ return getStats().chessWins >= 3; },
    svg: makeSVG('#2a1c00','#120c00','#f59e0b','♞','3 WINS')
  },
  {
    id:'chess_10', name:'Gran Maestro', desc:'Vinci 10 partite a Scacchi',
    condition: function(){ return getStats().chessWins >= 10; },
    svg: makeSVG('#3a2800','#1a1000','#fcd34d','👑','MAESTRO')
  },

  // ── MULTI-GIOCO ──────────────────────────────────────────────
  {
    id:'all5', name:'Arcade God', desc:'Sblocca almeno 1 vittoria in tutti i giochi',
    condition: function(){
      var s = getStats();
      return s.snakeBest >= 10 && s.trisWins >= 1 && s.memoryBest < 9999 && s.breakLevel >= 1 && s.chessWins >= 1;
    },
    svg: makeSVG('#1a0030','#000a20','#e879f9','🏆','GOD MODE')
  },
  {
    id:'neon_legend', name:'NEON LEGEND', desc:'Ottieni tutti gli altri avatar',
    condition: function(){
      var all = AVATARS.filter(function(a){ return !a.starter && a.id !== 'neon_legend'; });
      return all.every(function(a){ return isUnlocked(a.id); });
    },
    svg: makeSVG('#1a0020','#050010','#f0abfc',
      '⚡',
      'LEGEND')
      .replace('<circle cx="60" cy="60" r="57"',
               '<circle cx="60" cy="60" r="57" stroke-dasharray="6 3"')
  },
];

var DEFAULT_PROFILE_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnm6UwO9wIQYn2GtsfjqCtdfsw7QkFdUmJTaO7cxLUFkYKn42LjErrbOEkg6uaRzeAZNvu35IN4xlZc2Xf1lI-iXHXxb3BgYS4AoJjy_HgnpxGHoI3Kq6JPWoyh_WOhrTVhlld8zP0c7yohwP226dxKRQsDJXtIy8xlqY-QaMwSYlHNnHW7BqcFxC4W7VgyIhi0R0zJYPKf6H1b11JyOk90g_7NrK1CRvdT72nIw7bg4880WyfSoEu';

function getStoredProfileAvatar() {
  var profile = JSON.parse(localStorage.getItem('neon_profile') || '{}');
  return profile.avatar || localStorage.getItem('profile_avatar') || DEFAULT_PROFILE_AVATAR;
}

function syncProfileAvatar() {
  var src = getStoredProfileAvatar();
  document.querySelectorAll('.profile-avatar').forEach(function(el) {
    el.src = src;
  });
  return src;
}

if (typeof window !== 'undefined') {
  window.getStoredProfileAvatar = getStoredProfileAvatar;
  window.syncProfileAvatar = syncProfileAvatar;
  window.DEFAULT_PROFILE_AVATAR = DEFAULT_PROFILE_AVATAR;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncProfileAvatar);
  } else {
    syncProfileAvatar();
  }
}
