const WHATSAPP_NUMBER = "+254741049125";

const PROJECTS = {
  nexus: {
    title: "Nexus Dashboard",
    image: "https://placehold.co/800x500/312e81/ffffff?text=Nexus+Dashboard",
    tags: ["React", "Node.js", "PostgreSQL", "WebSockets"],
    summary:
      "Real-time analytics platform with custom charts, role-based access, and WebSocket live updates.",
    details: [
      "Built a responsive admin dashboard serving 50+ KPIs in real time.",
      "Role-based access control with admin, analyst, and viewer tiers.",
      "Custom chart library with export to PDF and CSV.",
      "WebSocket layer for live data — sub-100ms update latency.",
    ],
  },
  flow: {
    title: "Flow API",
    image: "https://placehold.co/800x500/134e4a/ffffff?text=Flow+API",
    tags: ["Python", "FastAPI", "Redis", "OpenAPI"],
    summary:
      "High-performance REST API handling 10k+ req/min with caching, rate limiting, and OpenAPI docs.",
    details: [
      "Async FastAPI architecture with Redis caching layer.",
      "Rate limiting and JWT auth for secure third-party access.",
      "Auto-generated OpenAPI docs for developer onboarding.",
      "Handles 10,000+ requests per minute under load testing.",
    ],
  },
  devconnect: {
    title: "DevConnect",
    image: "https://placehold.co/800x500/581c87/ffffff?text=DevConnect",
    tags: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    summary:
      "Developer networking app with profiles, messaging, and event discovery — built for speed and UX.",
    details: [
      "Social profiles with skills, repos, and availability status.",
      "Real-time messaging with read receipts and typing indicators.",
      "Event discovery feed with RSVP and calendar integration.",
      "Server-rendered Next.js pages for SEO and fast first paint.",
    ],
  },
};

const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");
const sidebar = document.getElementById("sidebar");
const sidebarBackdrop = document.getElementById("sidebarBackdrop");
const sidebarClose = document.getElementById("sidebarClose");
const sidebarLinks = document.querySelectorAll(".sidebar__link");
const contactForm = document.getElementById("contactForm");
const datingForm = document.getElementById("datingForm");
const projectModal = document.getElementById("projectModal");
const lookLightbox = document.getElementById("lookLightbox");
const navLinks = document.querySelectorAll(".nav__link");

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

function openWhatsApp(message) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function defaultWhatsAppMessage() {
  return "Hi Anthony! I found your portfolio and I'd love to connect.";
}

function bindWhatsAppButtons() {
  const defaultMsg = defaultWhatsAppMessage();

  document.getElementById("heroWhatsApp").addEventListener("click", (e) => {
    e.preventDefault();
    openWhatsApp(defaultMsg);
  });

  document.getElementById("contactWhatsApp").addEventListener("click", (e) => {
    e.preventDefault();
    openWhatsApp(defaultMsg);
  });

  document.getElementById("datingWhatsApp").addEventListener("click", (e) => {
    e.preventDefault();
    openWhatsApp("Hi Anthony! I'd like to apply for a date. 🌹");
  });

  document.getElementById("sidebarWhatsApp").addEventListener("click", (e) => {
    e.preventDefault();
    closeSidebar();
    openWhatsApp(defaultMsg);
  });

  document.getElementById("whatsappFloat").addEventListener("click", (e) => {
    e.preventDefault();
    openWhatsApp(defaultMsg);
  });
}

function openSidebar() {
  sidebar.classList.add("sidebar--open");
  sidebarBackdrop.classList.add("sidebar-backdrop--visible");
  navToggle.classList.add("nav__toggle--active");
  navToggle.setAttribute("aria-expanded", "true");
  sidebar.setAttribute("aria-hidden", "false");
  sidebarBackdrop.setAttribute("aria-hidden", "false");
  document.body.classList.add("menu-open");
}

function closeSidebar() {
  sidebar.classList.remove("sidebar--open");
  sidebarBackdrop.classList.remove("sidebar-backdrop--visible");
  navToggle.classList.remove("nav__toggle--active");
  navToggle.setAttribute("aria-expanded", "false");
  sidebar.setAttribute("aria-hidden", "true");
  sidebarBackdrop.setAttribute("aria-hidden", "true");
  document.body.classList.remove("menu-open");
}

navToggle.addEventListener("click", () => {
  if (sidebar.classList.contains("sidebar--open")) {
    closeSidebar();
  } else {
    openSidebar();
  }
});

sidebarClose.addEventListener("click", closeSidebar);
sidebarBackdrop.addEventListener("click", closeSidebar);

sidebarLinks.forEach((link) => {
  link.addEventListener("click", closeSidebar);
});

function initActiveNav() {
  const sections = document.querySelectorAll("section[id], header[id]");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle(
              "nav__link--active",
              link.dataset.section === id,
            );
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
  );

  sections.forEach((section) => observer.observe(section));
}

function openProjectModal(projectId) {
  const project = PROJECTS[projectId];
  if (!project) return;

  document.getElementById("modalImage").src = project.image;
  document.getElementById("modalImage").alt = `${project.title} preview`;
  document.getElementById("modalTitle").textContent = project.title;
  document.getElementById("modalSummary").textContent = project.summary;

  const tagsEl = document.getElementById("modalTags");
  tagsEl.innerHTML = project.tags.map((tag) => `<span>${tag}</span>`).join("");

  const detailsEl = document.getElementById("modalDetails");
  detailsEl.innerHTML = `<ul>${project.details.map((d) => `<li>${d}</li>`).join("")}</ul>`;

  const whatsappBtn = document.getElementById("modalWhatsApp");
  const msg = `Hi Anthony! I'd like to discuss your project "${project.title}". Can we talk about it?`;
  whatsappBtn.onclick = (e) => {
    e.preventDefault();
    openWhatsApp(msg);
  };

  projectModal.classList.add("modal--open");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("menu-open");
  document.getElementById("modalClose").focus();
}

function closeProjectModal() {
  projectModal.classList.remove("modal--open");
  projectModal.setAttribute("aria-hidden", "true");
  if (!sidebar.classList.contains("sidebar--open")) {
    document.body.classList.remove("menu-open");
  }
}

function initProjectModals() {
  document.querySelectorAll(".project-card--clickable").forEach((card) => {
    const open = () => openProjectModal(card.dataset.project);

    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
  });

  document
    .getElementById("modalClose")
    .addEventListener("click", closeProjectModal);
  document
    .getElementById("modalCloseBtn")
    .addEventListener("click", closeProjectModal);
  document
    .getElementById("modalBackdrop")
    .addEventListener("click", closeProjectModal);
}

function openLookLightbox(imgSrc, caption) {
  document.getElementById("lightboxImage").src = imgSrc;
  document.getElementById("lightboxImage").alt = caption;
  document.getElementById("lightboxCaption").textContent = caption;
  lookLightbox.classList.add("lightbox--open");
  lookLightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("menu-open");
}

function closeLookLightbox() {
  lookLightbox.classList.remove("lightbox--open");
  lookLightbox.setAttribute("aria-hidden", "true");
  if (
    !projectModal.classList.contains("modal--open") &&
    !sidebar.classList.contains("sidebar--open")
  ) {
    document.body.classList.remove("menu-open");
  }
}

function initLookLightbox() {
  document.querySelectorAll(".looks-card").forEach((card) => {
    card.addEventListener("click", () => {
      const img = card.querySelector("img");
      const label = card.querySelector(".looks-card__label").textContent;
      openLookLightbox(img.src, `Anthony — ${label} look`);
    });
  });

  document
    .getElementById("lightboxClose")
    .addEventListener("click", closeLookLightbox);
  document
    .getElementById("lightboxBackdrop")
    .addEventListener("click", closeLookLightbox);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (sidebar.classList.contains("sidebar--open")) closeSidebar();
    if (projectModal.classList.contains("modal--open")) closeProjectModal();
    if (lookLightbox.classList.contains("lightbox--open")) closeLookLightbox();
  }
});

window.addEventListener(
  "scroll",
  () => {
    nav.classList.toggle("nav--scrolled", window.scrollY > 20);
  },
  { passive: true },
);

function initScrollAnimations() {
  const animatedElements = document.querySelectorAll("[data-animate]");

  animatedElements.forEach((el) => {
    const type = el.dataset.animate || "fade-up";
    const delay = Number(el.dataset.delay || 0);
    el.classList.add("animate");
    el.classList.add(`animate--${type}`);
    el.style.setProperty("--animate-delay", `${delay * 0.12}s`);
  });

  if (prefersReducedMotion) {
    animatedElements.forEach((el) => el.classList.add("animate--visible"));
    return;
  }

  const heroElements = document.querySelectorAll(".hero [data-animate]");
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      heroElements.forEach((el) => el.classList.add("animate--visible"));
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate--visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
  );

  document.querySelectorAll("[data-animate]").forEach((el) => {
    if (el.closest(".hero")) return;
    observer.observe(el);
  });
}

function initParallax() {
  if (prefersReducedMotion) return;

  const heroPhoto = document.querySelector(".hero__photo");
  const aboutImage = document.querySelector(".about__image");

  window.addEventListener(
    "scroll",
    () => {
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
    },
    { passive: true },
  );
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  const text = [
    `Hi Anthony! Message from your portfolio:`,
    ``,
    `Name: ${name}`,
    `Email: ${email}`,
    ``,
    `Message:`,
    message,
  ].join("\n");

  openWhatsApp(text);
  contactForm.reset();
});

datingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("dateName").value.trim();
  const interest = document.getElementById("dateInterest").value.trim();
  const plan = document.getElementById("datePlan").value.trim();

  const text = [
    `Hi Anthony! 🌹 Date Application`,
    ``,
    `Name: ${name}`,
    ``,
    `Why Anthony:`,
    interest,
    ``,
    `Ideal first date: ${plan}`,
  ].join("\n");

  openWhatsApp(text);
  datingForm.reset();
});

bindWhatsAppButtons();
initActiveNav();
initProjectModals();
initLookLightbox();
initScrollAnimations();
initParallax();
registerServiceWorker();
