/* ============================================
   LOCAL WEB CARE — MAIN JS
   ============================================ */

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.classList.toggle('active');
    });

    // Close nav when clicking a link
    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('active');
      });
    });
  }

  // Contact form handling
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  if (form && success) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // In production, replace this with actual form submission
      // (e.g., Formspree, Netlify Forms, Cloudflare Workers, etc.)
      
      form.style.display = 'none';
      success.style.display = 'block';
    });
  }

  // Scroll-triggered animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.feature-card, .price-card, .stat-card, .value-card, .faq-item, .contact-info-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

  // Add staggered delay to grid items
  document.querySelectorAll('.features__grid, .pricing__grid, .values__grid, .faq__grid').forEach(grid => {
    grid.querySelectorAll('.feature-card, .price-card, .value-card, .faq-item').forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.1}s`;
    });
  });
});

// CSS class for scroll animations
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  </style>
`);
