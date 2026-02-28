<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Player</title>

  <!-- OpenPlayerJS -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/openplayerjs/2.9.2/openplayer.min.css" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/openplayerjs/2.9.2/openplayer.min.js"></script>

  <style>
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;800&family=DM+Mono:wght@300;400&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:       #080a0f;
      --surface:  #0e1117;
      --border:   #1c2030;
      --accent:   #3b82f6;
      --accent2:  #06b6d4;
      --text:     #e2e8f0;
      --muted:    #64748b;
      --glow:     rgba(59,130,246,0.15);
    }

    html, body {
      height: 100%;
      background: var(--bg);
      color: var(--text);
      font-family: 'Syne', sans-serif;
      overflow-x: hidden;
    }

    /* animated background grid */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image:
        linear-gradient(var(--border) 1px, transparent 1px),
        linear-gradient(90deg, var(--border) 1px, transparent 1px);
      background-size: 48px 48px;
      opacity: 0.4;
      pointer-events: none;
      z-index: 0;
    }

    /* radial gradient spotlight */
    body::after {
      content: '';
      position: fixed;
      inset: 0;
      background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.08) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
    }

    .wrap {
      position: relative;
      z-index: 1;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 32px 16px 48px;
      gap: 24px;
    }

    /* ---- header ---- */
    header {
      display: flex;
      align-items: center;
      gap: 12px;
      animation: fadeDown 0.5s ease both;
    }

    .logo-mark {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 20px var(--glow);
    }

    .logo-mark svg {
      width: 18px;
      height: 18px;
      fill: white;
    }

    header h1 {
      font-size: 1.25rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      background: linear-gradient(90deg, var(--text), var(--muted));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* ---- input area (shown when no URL param) ---- */
    .input-card {
      width: 100%;
      max-width: 640px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 28px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      animation: fadeUp 0.5s 0.1s ease both;
      box-shadow: 0 0 40px rgba(0,0,0,0.4);
    }

    .input-card label {
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--muted);
      font-family: 'DM Mono', monospace;
    }

    .input-row {
      display: flex;
      gap: 10px;
    }

    .input-row input {
      flex: 1;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 12px 16px;
      color: var(--text);
      font-family: 'DM Mono', monospace;
      font-size: 0.85rem;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .input-row input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--glow);
    }

    .input-row input::placeholder { color: var(--muted); }

    .btn {
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      border: none;
      border-radius: 10px;
      padding: 12px 20px;
      color: white;
      font-family: 'Syne', sans-serif;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.15s;
      white-space: nowrap;
    }

    .btn:hover { opacity: 0.88; transform: translateY(-1px); }
    .btn:active { transform: translateY(0); }

    /* ---- player container ---- */
    .player-wrap {
      width: 100%;
      max-width: 960px;
      animation: fadeUp 0.5s 0.05s ease both;
    }

    .player-shell {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 0 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03);
    }

    /* file info bar */
    .file-info {
      padding: 14px 20px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .file-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: var(--glow);
      border: 1px solid rgba(59,130,246,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .file-icon svg { width: 16px; height: 16px; stroke: var(--accent); fill: none; stroke-width: 2; }

    .file-name {
      font-family: 'DM Mono', monospace;
      font-size: 0.8rem;
      color: var(--text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
      min-width: 0;
    }

    .file-badge {
      font-family: 'DM Mono', monospace;
      font-size: 0.65rem;
      font-weight: 400;
      color: var(--accent2);
      background: rgba(6,182,212,0.1);
      border: 1px solid rgba(6,182,212,0.2);
      border-radius: 6px;
      padding: 3px 8px;
      flex-shrink: 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* video element */
    #media-player {
      width: 100%;
      display: block;
    }

    /* override openplayer theme to match dark UI */
    .op-player__media { background: #000; }
    .op-controls { background: linear-gradient(transparent, rgba(0,0,0,0.85)) !important; }
    .op-controls__progress-played { background: var(--accent) !important; }
    .op-controls__progress-buffered { background: rgba(59,130,246,0.3) !important; }

    /* download bar */
    .dl-bar {
      padding: 14px 20px;
      border-top: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .dl-label {
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--muted);
      font-family: 'DM Mono', monospace;
      flex-shrink: 0;
    }

    .dl-link {
      font-family: 'DM Mono', monospace;
      font-size: 0.75rem;
      color: var(--accent2);
      text-decoration: none;
      background: rgba(6,182,212,0.08);
      border: 1px solid rgba(6,182,212,0.2);
      border-radius: 8px;
      padding: 6px 12px;
      transition: background 0.2s, border-color 0.2s;
      word-break: break-all;
    }

    .dl-link:hover {
      background: rgba(6,182,212,0.16);
      border-color: rgba(6,182,212,0.4);
    }

    .copy-btn {
      margin-left: auto;
      background: transparent;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 6px 12px;
      color: var(--muted);
      font-family: 'DM Mono', monospace;
      font-size: 0.7rem;
      cursor: pointer;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    .copy-btn:hover { border-color: var(--accent); color: var(--accent); }
    .copy-btn.copied { border-color: #22c55e; color: #22c55e; }

    /* ---- error state ---- */
    .error-card {
      width: 100%;
      max-width: 520px;
      background: rgba(239,68,68,0.05);
      border: 1px solid rgba(239,68,68,0.2);
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      animation: fadeUp 0.4s ease both;
    }

    .error-card h2 { font-size: 1rem; color: #f87171; margin-bottom: 8px; }
    .error-card p  { font-size: 0.85rem; color: var(--muted); }

    /* ---- empty state ---- */
    .empty {
      text-align: center;
      color: var(--muted);
      font-size: 0.85rem;
      animation: fadeUp 0.5s 0.2s ease both;
      opacity: 0;
      animation-fill-mode: forwards;
    }

    .empty p { margin-top: 8px; font-family: 'DM Mono', monospace; font-size: 0.75rem; }

    /* ---- animations ---- */
    @keyframes fadeDown {
      from { opacity: 0; transform: translateY(-12px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ---- responsive ---- */
    @media (max-width: 480px) {
      .input-row { flex-direction: column; }
      .dl-bar { flex-direction: column; align-items: flex-start; }
      .copy-btn { margin-left: 0; }
    }
  </style>
</head>
<body>
<div class="wrap">

  <!-- Header -->
  <header>
    <div class="logo-mark">
      <svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>
    </div>
    <h1>Stream Player</h1>
  </header>

  <!-- Dynamic content injected here -->
  <div id="app"></div>

</div>

<script>
(function () {
  const app = document.getElementById('app');

  // ── helpers ──────────────────────────────────────────────
  function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function fileName(url) {
    try {
      const parts = new URL(url).pathname.split('/');
      const raw   = decodeURIComponent(parts[parts.length - 1] || '');
      return raw || 'media';
    } catch { return 'media'; }
  }

  function fileExt(url) {
    const name = fileName(url);
    const dot  = name.lastIndexOf('.');
    return dot !== -1 ? name.slice(dot + 1).toLowerCase() : '';
  }

  function isAudio(url) {
    return ['mp3','aac','ogg','flac','wav','opus','m4a'].includes(fileExt(url));
  }

  function copyText(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
    });
  }

  // ── render input form ─────────────────────────────────────
  function renderForm() {
    app.innerHTML = `
      <div class="input-card">
        <label>Paste a direct media URL to stream</label>
        <div class="input-row">
          <input id="url-input" type="url" placeholder="https://example.com/video.mp4" autocomplete="off" spellcheck="false" />
          <button class="btn" id="play-btn">▶ Play</button>
        </div>
      </div>
      <div class="empty">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" style="margin:0 auto 12px;display:block;opacity:0.3">
          <circle cx="12" cy="12" r="10"/><polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none"/>
        </svg>
        <p>Supports MP4 · MKV · WebM · MP3 · AAC · M3U8 · and more</p>
      </div>
    `;

    const input = document.getElementById('url-input');
    const btn   = document.getElementById('play-btn');

    btn.addEventListener('click', () => {
      const val = input.value.trim();
      if (!val) { input.focus(); return; }
      // push to query param and reload
      const u = new URL(window.location.href);
      u.searchParams.set('url', val);
      window.location.href = u.toString();
    });

    input.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
    input.focus();
  }

  // ── render player ─────────────────────────────────────────
  function renderPlayer(url) {
    const name  = fileName(url);
    const ext   = fileExt(url) || (isAudio(url) ? 'audio' : 'video');
    const audio = isAudio(url);

    // File type icon paths
    const iconPath = audio
      ? 'M9 18V5l12-2v13M9 18c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-2c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z'
      : 'M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z';

    app.innerHTML = `
      <div class="player-wrap">
        <div class="player-shell">

          <div class="file-info">
            <div class="file-icon">
              <svg viewBox="0 0 24 24"><path d="${iconPath}"/></svg>
            </div>
            <span class="file-name" title="${name}">${name}</span>
            <span class="file-badge">${ext}</span>
          </div>

          <${audio ? 'audio' : 'video'} id="media-player" class="op-player__media" controls preload="metadata"
            ${audio ? '' : 'playsinline'}>
            <source src="${url}" />
          </${audio ? 'audio' : 'video'}>

          <div class="dl-bar">
            <span class="dl-label">Link</span>
            <a class="dl-link" href="${url}" target="_blank" rel="noopener">${url.length > 60 ? url.slice(0, 60) + '…' : url}</a>
            <button class="copy-btn" id="copy-btn">Copy</button>
          </div>

        </div>
      </div>

      <button class="btn" id="new-btn" style="font-size:0.8rem;padding:10px 18px;opacity:0.7">
        ← Play another URL
      </button>
    `;

    // Copy button
    document.getElementById('copy-btn').addEventListener('click', function () {
      copyText(url, this);
    });

    // New URL button
    document.getElementById('new-btn').addEventListener('click', () => {
      const u = new URL(window.location.href);
      u.searchParams.delete('url');
      window.location.href = u.toString();
    });

    // Init OpenPlayerJS
    try {
      const player = new OpenPlayer('media-player', {
        controls: {
          layers: {
            left:   ['play', 'time', 'volume'],
            middle: ['progress'],
            right:  ['settings', 'fullscreen'],
          }
        }
      });
      player.init();
    } catch (e) {
      console.warn('OpenPlayer init error:', e);
      // fallback: native controls still work since we have `controls` attr
    }
  }

  // ── render error ──────────────────────────────────────────
  function renderError(msg) {
    app.innerHTML = `
      <div class="error-card">
        <h2>⚠ Could not load media</h2>
        <p>${msg}</p>
      </div>
      <button class="btn" id="back-btn" style="font-size:0.8rem;padding:10px 18px;opacity:0.7">← Try another URL</button>
    `;
    document.getElementById('back-btn').addEventListener('click', () => {
      const u = new URL(window.location.href);
      u.searchParams.delete('url');
      window.location.href = u.toString();
    });
  }

  // ── router ────────────────────────────────────────────────
  const url = getParam('url');

  if (!url) {
    renderForm();
  } else {
    try {
      new URL(url); // validate
      renderPlayer(url);
    } catch {
      renderError('Invalid URL. Please provide a valid direct media link.');
    }
  }

})();
</script>
</body>
</html>
