/* Finora Advisors — routing, reveals, calculator, forms */
(function () {
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- GST calculator ---------- */
  function calc() {
    var a = Math.max(0, +$('amt').value || 0), r = +$('rate').value, m = $('mode').value, n, t;
    if (m === 'add') { n = a; t = a * (1 + r / 100); } else { t = a; n = a / (1 + r / 100); }
    var f = function (x) { return '₹' + x.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }); };
    $('rn').textContent = f(n); $('rg').textContent = f(t - n); $('rt').textContent = f(t);
  }
  ['amt', 'rate', 'mode'].forEach(function (i) { $(i).addEventListener('input', calc); $(i).addEventListener('change', calc); });
  calc();

  /* ---------- Mobile menu ---------- */
  var nav = $('nav'), mb = $('mb');
  mb.addEventListener('click', function () { var o = nav.classList.toggle('open'); mb.setAttribute('aria-expanded', o); });
  nav.addEventListener('click', function () { nav.classList.remove('open'); mb.setAttribute('aria-expanded', false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { nav.classList.remove('open'); mb.setAttribute('aria-expanded', false); } });

  /* ---------- Contact form ---------- */
  $('cf').addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = $('cok'), bad = [];
    [['f-name', 'your name'], ['f-email', 'a valid email']].forEach(function (p) {
      var el = $(p[0]), v = el.value.trim();
      var invalid = !v || (el.type === 'email' && !/^\S+@\S+\.\S+$/.test(v));
      el.classList.toggle('bad', invalid); el.setAttribute('aria-invalid', invalid); if (invalid) bad.push(p[1]);
    });
    ok.style.display = 'block';
    if (bad.length) { ok.classList.add('err'); ok.textContent = 'Please enter ' + bad.join(' and ') + '.'; return; }
    ok.classList.remove('err');
    ok.textContent = '✓ Thank you, ' + $('f-name').value.trim().split(' ')[0] + '. A partner will get back to you within one business day.';
    this.reset();
  });

  /* ---------- Hash router ---------- */
  var V = ['home', 'services', 'engagement', 'resources', 'about', 'contact'];
  var ALIAS = { pricing: 'engagement' };
  var T = {
    services: ['Services', 'Complete tax, audit and legal support for every stage of business.', 'What we do'],
    engagement: ['How we engage', 'Retainer and one-time engagements, scoped in writing.', 'Engagement'],
    resources: ['Resources', 'Calculators, due dates, checklists and answers.', 'Free tools'],
    about: ['About Us', 'The people and principles behind Finora.', 'Our firm'],
    contact: ['Contact', 'Book a consultation with our team.', 'Get in touch']
  };
  function route() {
    var h = location.hash.slice(1);
    if (ALIAS[h]) { history.replaceState(null, '', '#' + ALIAS[h]); h = ALIAS[h]; }
    if (V.indexOf(h) < 0) h = 'home';
    document.querySelectorAll('section[data-v]').forEach(function (s) { s.classList.toggle('on', s.dataset.v.split(' ').indexOf(h) > -1); });
    document.querySelectorAll('nav a').forEach(function (a) {
      var cur = a.getAttribute('href') === '#' + h;
      a.classList.toggle('cur', cur); if (cur) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (T[h]) { $('pt').textContent = T[h][0]; $('ps').textContent = T[h][1]; $('pp').textContent = T[h][2]; }
    document.title = (T[h] ? T[h][0] + ' — ' : '') + 'Finora Advisors — CA, CS & Tax Compliance';
    window.scrollTo(0, 0);
  }

  /* ---------- Counters (numeric band values only) ---------- */
  function cnt(el) {
    var b = el.querySelector && el.querySelector('b'), pc = el.parentNode && el.parentNode.classList;
    if (!b || !pc || !pc.contains('band')) return;
    var m = b.textContent.match(/^(\D*)([\d.,]+)(.*)$/); if (!m) return;
    var end = parseFloat(m[2].replace(/,/g, '')), dec = (m[2].split('.')[1] || '').length, t0 = null;
    function f(ts) { if (!t0) t0 = ts; var p = Math.min((ts - t0) / 1500, 1), v = end * (1 - Math.pow(1 - p, 3)); b.textContent = m[1] + v.toFixed(dec) + m[3]; if (p < 1) requestAnimationFrame(f); }
    requestAnimationFrame(f);
  }

  /* ---------- Scroll reveals ---------- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); cnt(e.target); } });
  }, { threshold: 0.12 }) : null;
  function rev() {
    document.querySelectorAll('section.on').forEach(function (s) {
      s.querySelectorAll('h2,.pill,.lead,.tile,.st,.card,.band>div,.mini>div,.tbl,details,.tl>div,.cb,.feat,.gc,.chk li').forEach(function (el, i) {
        if (el.closest('.dash')) return;
        if (reduce || !io) { el.classList.add('in'); return; }
        el.classList.add('rv'); el.classList.remove('in'); el.style.setProperty('--d', (i % 4) * 0.09 + 's'); io.observe(el);
      });
    });
  }
  window.addEventListener('hashchange', function () { route(); rev(); });
  route(); rev();

  /* ---------- Scroll progress ---------- */
  window.addEventListener('scroll', function () {
    var h = document.documentElement; $('pg').style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight || 1) * 100) + '%';
  }, { passive: true });
})();
