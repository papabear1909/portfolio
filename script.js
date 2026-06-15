const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const sidebar = document.getElementById('sidebar');
const sidebarBackdrop = document.getElementById('sidebarBackdrop');
const sidebarClose = document.getElementById('sidebarClose');
const sidebarLinks = document.querySelectorAll('.sidebar__link');
const contactForm = document.getElementById('contactForm');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function openSidebar() {
  sidebar.classList.add('sidebar--open');
  sidebarBackdrop.classList.add('sidebar-backdrop--visible');
  navToggle.classList.add('nav__toggle--active');
  navToggle.setAttribute('aria-expanded', 'true');
  sidebar.setAttribute('aria-hidden', 'false');
  sidebarBackdrop.setAttribute('aria-hidden', 'false');
  document.body.classList.add('menu-open');
}

function closeSidebar() {
  sidebar.classList.remove('sidebar--open');
  sidebarBackdrop.classList.remove('sidebar-backdrop--visible');
  navToggle.classList.remove('nav__toggle--active');
  navToggle.setAttribute('aria-expanded', 'false');
  sidebar.setAttribute('aria-hidden', 'true');
  sidebarBackdrop.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
}

navToggle.addEventListener('click', () => {
  if (sidebar.classList.contains('sidebar--open')) {
    closeSidebar();
  } else {
    openSidebar();
  }
});

sidebarClose.addEventListener('click', closeSidebar);
sidebarBackdrop.addEventListener('click', closeSidebar);

sidebarLinks.forEach((link) => {
  link.addEventListener('click', closeSidebar);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && sidebar.classList.contains('sidebar--open')) {
    closeSidebar();
  }
});

window.addEventListener('scroll', () => {
  nav.classList.toggle('nav--scrolled', window.scrollY > 20);
}, { passive: true });

function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');

  animatedElements.forEach((el) => {
    const type = el.dataset.animate || 'fade-up';
    const delay = Number(el.dataset.delay || 0);
    el.classList.add('animate');
    el.classList.add(`animate--${type}`);
    el.style.setProperty('--animate-delay', `${delay * 0.12}s`);
  });

  if (prefersReducedMotion) {
    animatedElements.forEach((el) => el.classList.add('animate--visible'));
    return;
  }

  const heroElements = document.querySelectorAll('.hero [data-animate]');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      heroElements.forEach((el) => el.classList.add('animate--visible'));
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate--visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  const scrollElements = document.querySelectorAll('[data-animate]');
  scrollElements.forEach((el) => {
    if (el.closest('.hero')) return;
    observer.observe(el);
  });
}

function initParallax() {
  if (prefersReducedMotion) return;

  const heroPhoto = document.querySelector('.hero__photo');
  const aboutImage = document.querySelector('.about__image');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (heroPhoto && scrollY < window.innerHeight) {
      heroPhoto.style.transform = `translateY(${scrollY * 0.08}px) scale(${1 + scrollY * 0.0001})`;
    }

    if (aboutImage) {
      const rect = aboutImage.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (window.innerHeight - rect.top) * 0.04;
        aboutImage.style.transform = `translateY(${offset - 40}px)`;
      }
    }
  }, { passive: true });
}

initScrollAnimations();
initParallax();
registerServiceWorker();

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .catch(() => {});
  });
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button');
  const originalText = btn.textContent;
  btn.textContent = 'Message Sent!';
  btn.disabled = true;
  contactForm.reset();

  setTimeout(() => {
    btn.textContent = originalText;
    btn.disabled = false;
  }, 3000);
});
