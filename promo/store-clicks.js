/* Store-button clicks for Google Analytics (owner, 24 Nov 2026: "set up all three").
   One file for seemabooks.com, ibnqutb.com and badamkijali.com. When a visitor clicks a link to a store, it sends
   the event "store_click" with: store (Amazon, Google Play, ...), product (the title of the card the link sits in),
   and the link itself. It needs the page's own Google tag (gtag); without it, it does nothing. No cookies of its own. */
(function () {
  if (window.__sbStoreClicks) return; window.__sbStoreClicks = true;
  var STORES = [
    ['play.google.com', 'Google Play'], ['apps.apple.com', 'App Store'], ['books.apple.com', 'Apple Books'],
    ['itunes.apple.com', 'Apple Books'], ['books2read.com', 'All stores link'], ['amazon.', 'Amazon'], ['amzn.to', 'Amazon'],
    ['a.co', 'Amazon'], ['barnesandnoble.com', 'Barnes & Noble'], ['kobo.com', 'Kobo'], ['itch.io', 'itch.io'],
    ['microsoft.com', 'Microsoft Store'], ['audible.com', 'Audible']
  ];
  function storeOf(host) {
    host = host.toLowerCase();
    for (var i = 0; i < STORES.length; i++) {
      var k = STORES[i][0];
      if (k.charAt(k.length - 1) === '.' ? (host.indexOf('.' + k) >= 0 || host.indexOf(k) === 0) : (host === k || host.slice(-k.length - 1) === '.' + k)) return STORES[i][1];
    }
    return null;
  }
  function clean(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }
  function productOf(a) {
    var n = a, i = 0;
    while (n && n !== document.body && i < 7) {
      if (n.matches && n.matches('article,.sbn-c,.feature,.app,.ibq-app,.sbx-item,.ibq-cta,figure,li')) {
        var t = n.querySelector('h3,.sbn-t,figcaption b,b,strong');
        if (t && clean(t.textContent)) return clean(t.textContent);
        var im = n.querySelector('img[alt]');
        if (im && clean(im.alt)) return clean(im.alt).replace(/^Cover of /, '');
      }
      n = n.parentElement; i++;
    }
    var im2 = a.querySelector('img[alt]');
    if (im2 && clean(im2.alt)) return clean(im2.alt).replace(/^Cover of /, '');
    return clean(a.textContent) || a.href;
  }
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var u; try { u = new URL(a.href, location.href); } catch (x) { return; }
    var store = storeOf(u.hostname);
    if (!store || typeof window.gtag !== 'function') return;
    window.gtag('event', 'store_click', {
      store: store, product: productOf(a).slice(0, 100),
      link_url: u.href.slice(0, 300), link_domain: u.hostname, link_text: clean(a.textContent).slice(0, 100), outbound: true
    });
  }, true);
})();
