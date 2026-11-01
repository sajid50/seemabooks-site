/* IBQ lesson nav (31 Oct 2026): "What's on this page" box, series Previous/Next from each series'
   "Contents and Reading Order" post, a "Start here" box on the home page, and the series' app card under Previous/Next.
   Lesson order = the order of links in the contents post, so editing that post re-orders everything. */
(function () {
  var SERIES = {
    'Arabic Grammar for Beginners': { id: '4723648686222777294', name: 'Arabic Grammar for Beginners', who: 'New to Arabic grammar? Start here: letters, nouns, verbs and the first sentences.' },
    'Nahw Meer': { id: '8161175783613557667', name: 'Nahw Meer in English', who: 'The classic primer of Arabic sentences, chapter by chapter.' },
    'Sarf and Nahw Summary': { id: '7801389540258622150', name: 'Sarf and Nahw Summary', who: 'A quick review of the whole of Qur\'anic grammar, with word lists.' },
    'Tafseer Nabaa to Infitaar': { id: '6586274595462589579', name: 'Grammatical Tafseer of Juz 30', who: 'Read Juz 30 word by word, with the grammar of every verse.' }
  };
  /* the app that goes with each series: one card under the Previous/Next box (1 Nov 2026) */
  var APP = {
    'Arabic Grammar for Beginners': { pkg: 'com.app.arabicgrammarp', ios: '6746101537', name: 'Arabic Grammar for Beginners', d: 'This whole course as a book on your phone, offline. The first 3 chapters are free.' },
    'Nahw Meer': { pkg: 'com.app.nahwmeerp', ios: '6471644332', name: 'Nahw Meer: An English Guide to Arabic Sentences', d: 'Read the whole of Nahw Meer on your phone, offline. The first 2 chapters are free.' },
    'Sarf and Nahw Summary': { pkg: 'com.app.qgrammarp', ios: '6752818977', name: 'Quran Grammar: Sarf & Nahw', d: 'The whole summary on your phone, offline. The first 2 chapters are free.' },
    'Tafseer Nabaa to Infitaar': { pkg: 'com.app.darsigrammarp', ios: null, name: 'Darsi Grammar: Juz 30 Part 1', d: 'These five surahs word by word, as a book on your phone, offline.' }
  };
  var ORDER = ['Arabic Grammar for Beginners', 'Nahw Meer', 'Sarf and Nahw Summary', 'Tafseer Nabaa to Infitaar'];
  var CSS = '.ibq-nav{background:#fbf6ec;border:1px solid #d6b25e;border-radius:8px;margin:20px 0;padding:14px 18px;font-size:15px;line-height:1.45}' +
    '.ibq-nav .k{color:#6b6250;font-size:12px;letter-spacing:.08em;text-transform:uppercase}' +
    '.ibq-nav a{color:#146c60;font-weight:bold;text-decoration:none}.ibq-nav a:hover{text-decoration:underline}' +
    '.ibq-nav .row{display:flex;flex-wrap:wrap;gap:10px 24px;justify-content:space-between;margin-top:8px}' +
    '.ibq-nav .row>div{flex:1 1 220px;min-width:0}.ibq-nav .nx{text-align:right}' +
    '.ibq-strip{font-size:14px;margin:0 0 16px;color:#6b6250}.ibq-strip a{color:#146c60;font-weight:bold}' +
    '.ibq-toc{background:#fbf6ec;border-left:4px solid #146c60;border-radius:6px;margin:0 0 20px;padding:10px 16px;font-size:15px}' +
    '.ibq-toc summary{cursor:pointer;font-weight:bold;color:#0d3432}.ibq-toc ol{margin:8px 0 2px;padding-left:22px}' +
    '.ibq-toc li{margin:3px 0}.ibq-toc a{color:#146c60;text-decoration:none}.ibq-toc a:hover{text-decoration:underline}' +
    '.ibq-start{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin:8px 0 0}' +
    '.ibq-start a{display:block;background:#fff;border:1px solid #e3d6b3;border-radius:8px;padding:10px 12px;color:#0d3432;text-decoration:none}' +
    '.ibq-app{display:flex;gap:14px;align-items:center;background:#fff;border:1px solid #e3d6b3;border-radius:8px;margin:-8px 0 20px;padding:12px 16px;font-size:15px;line-height:1.4}' +
    '.ibq-app img{width:56px;height:56px;border-radius:12px;flex:none}.ibq-app>div{flex:1;min-width:0}' +
    '.ibq-app b{color:#0d3432}.ibq-app .k{color:#6b6250;font-size:12px;letter-spacing:.08em;text-transform:uppercase}' +
    '.ibq-app a{display:inline-block;margin:6px 12px 0 0;color:#146c60;font-weight:bold;text-decoration:none}.ibq-app a:hover{text-decoration:underline}' +
    '.ibq-give{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;justify-content:space-between;background:#0d3432;color:#f3ead3;border-radius:8px;margin:0 0 14px;padding:10px 16px;font-size:15px;line-height:1.4}' +
    '.ibq-give a{background:#d6b25e;color:#0d3432;font-weight:bold;text-decoration:none;border-radius:6px;padding:7px 14px;white-space:nowrap}.ibq-give a:hover{background:#e6c776}' +
    '.ibq-start a{font-weight:normal}.ibq-start a b{color:#146c60;display:block;margin-bottom:2px;font-weight:bold}';
  var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);

  function norm(u) { return (u || '').replace(/^https?:\/\/(www\.)?ibnqutb\.com/i, '').replace(/[?#].*$/, ''); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function appCard(k) {
    var A = APP[k]; if (!A) return null;
    var h = '<img src="https://www.seemabooks.com/img/icons/' + A.pkg + '.png" alt="" loading="lazy"><div>' +
      '<div class="k">The app for this course</div><b>' + esc(A.name) + '</b><br>' + esc(A.d) + '<br>' +
      '<a href="https://play.google.com/store/apps/details?id=' + A.pkg + '" target="_blank" rel="noopener">Google Play →</a>' +
      (A.ios ? '<a href="https://apps.apple.com/app/id' + A.ios + '" target="_blank" rel="noopener">App Store →</a>' : '') + '</div>';
    return el('div', 'ibq-app', h);
  }
  function feedUrl(id) { return '/feeds/posts/default/' + id + '?alt=json'; }

  var path = norm(location.href);

  /* Home page: Start here */
  if (path === '/' || path === '') {
    var main = document.querySelector('.blog-posts');
    if (main) {
      var h = '<div class="k">Start here</div><div style="font-size:18px;font-weight:bold;color:#0d3432;margin-top:2px">Four free courses, each in reading order</div><div class="ibq-start">';
      ORDER.forEach(function (k) {
        h += '<a data-id="' + SERIES[k].id + '" href="#"><b>' + esc(SERIES[k].name) + '</b>' + esc(SERIES[k].who) + '</a>';
      });
      var box = el('div', 'ibq-nav', h + '</div>');
      box.style.margin = '0 0 24px';
      main.insertBefore(box, main.firstChild);
      /* owner (1 Nov 2026): the PayPal button from the end of each lesson, at the top of the home page too */
      main.insertBefore(el('div', 'ibq-give', '<span>These lessons are free. If they have helped you, a gift of any amount helps keep them free.</span>' +
        '<a href="https://www.paypal.biz/sajid50" target="_blank" rel="noopener">Support via PayPal</a>'), box);
      [].forEach.call(box.querySelectorAll('a[data-id]'), function (a) {
        fetch(feedUrl(a.getAttribute('data-id'))).then(function (r) { return r.json(); }).then(function (d) {
          a.href = d.entry.link.filter(function (l) { return l.rel === 'alternate'; })[0].href;
        }).catch(function () {});
      });
    }
    return;
  }

  var body = document.querySelector('.post-body');
  if (!body || !/\.html$/.test(path) || path.indexOf('/p/') === 0) return;

  /* owner (1 Nov 2026): the Substack member perk, added to the theme's "Become a member" line */
  var join = document.querySelector('.ibq-cta a[href*="substack.com/subscribe"]');
  if (join) join.parentNode.insertBefore(el('span', null, 'Members also get <b>five of our Android apps, fully unlocked</b>. '), join);
  var band = body.firstElementChild && /background:\s*#0d3432/i.test(body.firstElementChild.getAttribute('style') || '') ? body.firstElementChild : null;
  function afterBand(node) {
    var ref = band ? band.nextSibling : body.firstChild;
    while (ref && ref.nodeType === 1 && /ibq-(pdf|strip)/.test(ref.className || '')) ref = ref.nextSibling;
    body.insertBefore(node, ref);
  }

  /* What's on this page */
  /* a heading that directly follows another (no text between, e.g. English, Arabic and transliteration
     lines of one Word heading) is part of the same section */
  function text(x) {
    var c = x.cloneNode(true);
    [].forEach.call(c.querySelectorAll('script,style,ins'), function (s) { s.remove(); });
    return c.textContent.replace(/\s+/g, ' ').trim();
  }
  var hs = [], last = null;
  [].forEach.call(body.querySelectorAll('h1,h2,h3'), function (x) {
    var t = text(x);
    /* Word-pasted posts sometimes mark whole sentences as headings: leave those out */
    if (t.length <= 2 || t.length > 90 || /[:.]$/.test(t) || x.closest('.ibq-pdf')) return;
    var p = x.previousElementSibling;
    while (p && !p.textContent.trim() && !p.querySelector('img,table')) p = p.previousElementSibling;
    if (last && p === last.el) { last.el = x; last.t += ' ' + t; return; }
    last = { first: x, el: x, t: t }; hs.push(last);
  });
  if (hs.length >= 3) {
    var items = '';
    hs.forEach(function (s, i) {
      var x = s.first;
      if (!x.id) x.id = 'ibq-s' + (i + 1);
      items += '<li><a href="#' + x.id + '">' + esc(s.t) + '</a></li>';
    });
    var toc = el('details', 'ibq-toc', '<summary>What\'s on this page (' + hs.length + ' sections)</summary><ol>' + items + '</ol>');
    if (window.innerWidth > 700) toc.open = true;
    afterBand(toc);
  }

  /* Series Previous / Next */
  var labs = [].map.call(document.querySelectorAll("a[rel='tag']"), function (a) { return a.textContent.trim(); });
  var key = ORDER.filter(function (k) { return labs.indexOf(k) >= 0; })[0];
  if (!key) return;
  var S = SERIES[key];
  fetch(feedUrl(S.id)).then(function (r) { return r.json(); }).then(function (d) {
    var cUrl = d.entry.link.filter(function (l) { return l.rel === 'alternate'; })[0].href, cPath = norm(cUrl);
    var doc = new DOMParser().parseFromString(d.entry.content.$t, 'text/html');
    var list = [], title = {};
    [].forEach.call(doc.querySelectorAll('a[href]'), function (a) {
      var href = a.getAttribute('href');
      if (!/^(https?:)?\/\/(www\.)?ibnqutb\.com\//i.test(href) && href.charAt(0) !== '/') return;
      var u = norm(href);
      if (!/\.html$/.test(u) || u === cPath || list.indexOf(u) >= 0) return;
      list.push(u); title[u] = a.textContent.replace(/\s+/g, ' ').trim() || u;
    });
    if (!list.length) return;
    var i = list.indexOf(path), onContents = path === cPath;
    if (i < 0 && !onContents) return;
    var link = function (u, txt) { return '<a href="' + u + '">' + esc(txt) + '</a>'; };
    var h;
    if (onContents) {
      h = '<div class="k">' + esc(S.name) + ' &middot; ' + list.length + ' lessons</div>' +
        '<div class="row"><div>New to this course?</div><div class="nx">' + link(list[0], 'Start with lesson 1: ' + title[list[0]] + ' →') + '</div></div>';
      body.appendChild(el('div', 'ibq-nav', h));
      if (appCard(key)) body.appendChild(appCard(key));
      return;
    }
    var prev = list[i - 1], next = list[i + 1];
    h = '<div class="k">' + esc(S.name) + ' &middot; lesson ' + (i + 1) + ' of ' + list.length + ' &middot; ' + link(cUrl, 'all lessons') + '</div>' +
      '<div class="row"><div>' + (prev ? '← Previous<br>' + link(prev, title[prev]) : link(cUrl, '← Contents and reading order')) + '</div>' +
      '<div class="nx">' + (next ? 'Next lesson →<br>' + link(next, title[next]) : 'You have finished the course.<br>' + link(cUrl, 'Back to the contents')) + '</div></div>';
    body.appendChild(el('div', 'ibq-nav', h));
    if (appCard(key)) body.appendChild(appCard(key));
    afterBand(el('div', 'ibq-strip', esc(S.name) + ' &middot; lesson ' + (i + 1) + ' of ' + list.length +
      (next ? ' &middot; ' + link(next, 'Next lesson →') : '') + ' &middot; ' + link(cUrl, 'Contents')));
  }).catch(function () {});
})();
