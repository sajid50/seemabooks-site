/* IBQ lesson nav (31 Oct 2026): "What's on this page" box, series Previous/Next from each series'
   "Contents and Reading Order" post, and a "Start here" box on the home page.
   Lesson order = the order of links in the contents post, so editing that post re-orders everything. */
(function () {
  var SERIES = {
    'Arabic Grammar for Beginners': { id: '4723648686222777294', name: 'Arabic Grammar for Beginners', who: 'New to Arabic grammar? Start here: letters, nouns, verbs and the first sentences.' },
    'Nahw Meer': { id: '8161175783613557667', name: 'Nahw Meer in English', who: 'The classic primer of Arabic sentences, chapter by chapter.' },
    'Sarf and Nahw Summary': { id: '7801389540258622150', name: 'Sarf and Nahw Summary', who: 'A quick review of the whole of Qur\'anic grammar, with word lists.' },
    'Tafseer Nabaa to Infitaar': { id: '6586274595462589579', name: 'Grammatical Tafseer of Juz 30', who: 'Read Juz 30 word by word, with the grammar of every verse.' }
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
    '.ibq-start a b{color:#146c60;display:block;margin-bottom:2px}';
  var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);

  function norm(u) { return (u || '').replace(/^https?:\/\/(www\.)?ibnqutb\.com/i, '').replace(/[?#].*$/, ''); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function feedUrl(id) { return '/feeds/posts/default/' + id + '?alt=json'; }

  var path = norm(location.href);

  /* Home page: Start here */
  if (path === '/' || path === '') {
    var main = document.querySelector('.blog-posts, #main');
    if (main) {
      var h = '<div class="k">Start here</div><div style="font-size:18px;font-weight:bold;color:#0d3432;margin-top:2px">Four free courses, each in reading order</div><div class="ibq-start">';
      ORDER.forEach(function (k) {
        h += '<a data-id="' + SERIES[k].id + '" href="#"><b>' + esc(SERIES[k].name) + '</b>' + esc(SERIES[k].who) + '</a>';
      });
      var box = el('div', 'ibq-nav', h + '</div>');
      main.parentNode.insertBefore(box, main);
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
  var band = body.firstElementChild && /background:\s*#0d3432/i.test(body.firstElementChild.getAttribute('style') || '') ? body.firstElementChild : null;
  function afterBand(node) {
    var ref = band ? band.nextSibling : body.firstChild;
    while (ref && ref.nodeType === 1 && /ibq-(pdf|strip)/.test(ref.className || '')) ref = ref.nextSibling;
    body.insertBefore(node, ref);
  }

  /* What's on this page */
  /* a heading that directly follows another (no text between, e.g. English, Arabic and transliteration
     lines of one Word heading) is part of the same section */
  var hs = [], last = null;
  [].forEach.call(body.querySelectorAll('h1,h2,h3'), function (x) {
    var t = x.textContent.replace(/\s+/g, ' ').trim();
    if (t.length <= 2 || x.closest('.ibq-pdf')) return;
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
      return;
    }
    var prev = list[i - 1], next = list[i + 1];
    h = '<div class="k">' + esc(S.name) + ' &middot; lesson ' + (i + 1) + ' of ' + list.length + ' &middot; ' + link(cUrl, 'all lessons') + '</div>' +
      '<div class="row"><div>' + (prev ? '← Previous<br>' + link(prev, title[prev]) : link(cUrl, '← Contents and reading order')) + '</div>' +
      '<div class="nx">' + (next ? 'Next lesson →<br>' + link(next, title[next]) : 'You have finished the course.<br>' + link(cUrl, 'Back to the contents')) + '</div></div>';
    body.appendChild(el('div', 'ibq-nav', h));
    afterBand(el('div', 'ibq-strip', esc(S.name) + ' &middot; lesson ' + (i + 1) + ' of ' + list.length +
      (next ? ' &middot; ' + link(next, 'Next lesson →') : '') + ' &middot; ' + link(cUrl, 'Contents')));
  }).catch(function () {});
})();
