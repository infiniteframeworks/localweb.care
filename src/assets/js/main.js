/* ── Theme ──────────────────────────────────────────────────────────────── */
const THEME_KEY = 'lwc-theme';

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

function initTheme() {
  // Icon visibility is handled by CSS [data-theme] selectors — no JS needed.
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current);

  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }

  // Follow OS preference when the user hasn't made an explicit choice
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!getStoredTheme()) applyTheme(e.matches ? 'dark' : 'light');
  });
}

/* ── Mobile navigation ───────────────────────────────────────────────────── */
function initNav() {
  const toggle = document.getElementById('navToggle');
  const nav    = document.getElementById('mainNav');
  if (!toggle || !nav) return;

  function close() {
    nav.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
  }

  toggle.addEventListener('click', () => {
    const opening = !nav.classList.contains('open');
    if (opening) {
      nav.classList.add('open');
      toggle.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close navigation');
    } else {
      close();
    }
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) close();
  });

  // Close when a nav link is clicked (e.g. same-page anchor)
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', close));

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
}

/* ── Contact form ────────────────────────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const status = document.getElementById('formStatus');
    const btn    = form.querySelector('[type="submit"]');

    btn.disabled    = true;
    btn.textContent = 'Sending…';
    if (status) {
      status.className   = 'form-status';
      status.textContent = '';
    }

    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch('/contact/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      });

      if (res.ok) {
        form.reset();
        if (status) {
          status.className   = 'form-status success';
          status.textContent = "Thanks! I'll get back to you within one business day.";
        }
      } else {
        throw new Error('server');
      }
    } catch {
      if (status) {
        status.className   = 'form-status error';
        status.textContent = 'Something went wrong — please email hello@localweb.care directly.';
      }
    } finally {
      btn.disabled    = false;
      btn.textContent = 'Send Message';
    }
  });
}

/* ── Init ────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  initContactForm();
});
