(() => {
  'use strict';
  const panel = document.getElementById('visitor-stats');
  if (!panel || window.siteVisitorStatsRequested) return;
  if (!['www.chxtian.top', 'chxtian.top'].includes(location.hostname)) return;
  window.siteVisitorStatsRequested = true;
  const today = document.getElementById('visitor-today');
  const total = document.getElementById('visitor-total');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  // Canonical hostname keeps apex and www visits in the same counter.
  const url = new URL(location.href);
  url.hostname = 'www.chxtian.top';
  url.protocol = 'https:';
  url.search = '';
  url.hash = '';
  fetch('https://cdn.busuanzi.cc/api.php', {
    method: 'POST',
    credentials: 'omit',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify({ url: url.href, referrer: '' }),
    signal: controller.signal
  }).then(response => {
    if (!response.ok) throw new Error('Statistics unavailable');
    return response.json();
  }).then(data => {
    const uv = data.busuanzi_today_uv;
    const pv = data.busuanzi_site_pv;
    if (!Number.isSafeInteger(uv) || uv < 0 || !Number.isSafeInteger(pv) || pv < 1) {
      throw new Error('Invalid statistics');
    }
    // Provider baseline 2 excludes the two pre-launch integration checks.
    const displayed = 12345 + Math.max(0, pv - 2);
    today.textContent = uv.toLocaleString('en-US');
    total.textContent = displayed.toLocaleString('en-US');
  }).catch(() => {
    today.textContent = 'Unavailable';
    total.textContent = 'Unavailable';
  }).finally(() => clearTimeout(timer));
})();
