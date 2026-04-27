/* ─────────────────────────────────────────────
   Server Monitor — app.js
   ───────────────────────────────────────────── */

/* ── Navbar scroll effect ─────────────────────────── */
(function () {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Mobile nav toggle ────────────────────────────── */
(function () {
  const btn  = document.getElementById('nav-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', menu.classList.contains('open'));
  });
  // close on link click
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => menu.classList.remove('open'));
  });
})();

/* ── Fade-up on scroll ────────────────────────────── */
(function () {
  const els = document.querySelectorAll('.fade-up');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
})();

/* ── Stat bars animate when visible ─────────────────── */
(function () {
  const bars = document.querySelectorAll('.stat-bar-fill');
  if (!bars.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.animationPlayState = 'running';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  bars.forEach(b => { b.style.animationPlayState = 'paused'; obs.observe(b); });
})();

/* ── Pricing toggle (monthly ↔ yearly) ───────────────── */
(function () {
  const track   = document.getElementById('billing-toggle');
  const labelM  = document.getElementById('label-monthly');
  const labelY  = document.getElementById('label-yearly');
  const prices  = document.querySelectorAll('[data-monthly][data-yearly]');
  const savings = document.querySelectorAll('.yearly-savings');

  let isYearly = false;

  function update() {
    track && track.classList.toggle('active', isYearly);
    if (labelM) labelM.style.opacity = isYearly ? '0.45' : '1';
    if (labelY) labelY.style.opacity = isYearly ? '1' : '0.45';
    prices.forEach(el => {
      el.textContent = isYearly ? el.dataset.yearly : el.dataset.monthly;
    });
    savings.forEach(el => {
      el.style.display = isYearly ? 'inline-block' : 'none';
    });
  }

  if (track) {
    track.addEventListener('click', () => { isYearly = !isYearly; update(); });
  }
  update();
})();

/* ── Cloud / On-Prem tab ─────────────────────────────── */
(function () {
  const tabs     = document.querySelectorAll('.pricing-tab');
  const sections = document.querySelectorAll('.pricing-section');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      sections.forEach(s => {
        s.style.display = s.id === target ? 'block' : 'none';
      });
    });
  });
})();

/* ── Contact form (mailto fallback) ──────────────────── */
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name    = form.querySelector('#cf-name').value.trim();
    const email   = form.querySelector('#cf-email').value.trim();
    const company = form.querySelector('#cf-company').value.trim();
    const plan    = form.querySelector('#cf-plan').value;
    const message = form.querySelector('#cf-message').value.trim();

    const subject = encodeURIComponent(`Server Monitor Enquiry – ${company || name}`);
    const body    = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nPlan Interest: ${plan}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:deepak@probeplus.in?subject=${subject}&body=${body}`;

    form.reset();
    showToast('✓ Opening your mail client…');
  });
})();

/* ── Toast helper ─────────────────────────────────────── */
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.querySelector('#toast-msg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 4200);
}

/* ── Smooth-scroll for all hash links ────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Counter animation ───────────────────────────────── */
(function () {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = +el.dataset.count;
      const dur = 1600;
      const step = 16;
      let cur = 0;
      const inc = end / (dur / step);
      const timer = setInterval(() => {
        cur = Math.min(cur + inc, end);
        el.textContent = (el.dataset.suffix || '') === '%'
          ? Math.round(cur) + '%'
          : Math.round(cur).toLocaleString() + (el.dataset.suffix || '');
        if (cur >= end) clearInterval(timer);
      }, step);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => obs.observe(c));
})();
