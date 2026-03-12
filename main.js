/* ================================================
   JEFFY BRAILIN — PORTFOLIO MAIN.JS
   SPA Router + Animations
   ================================================ */

// ---- STATE ----
let currentPage = 'home';
let isTransitioning = false;
const body = document.body;
const pagesWrap = document.getElementById('pages-wrap');

// ---- PAGE NAVIGATION ----
function navigateTo(pageId) {
  if (pageId === currentPage || isTransitioning) return;

  isTransitioning = true;
  closeMenu();

  const layers = document.querySelectorAll('.transition-layer');

  // Phase 1: layers slide in
  body.classList.add('transitioning');
  layers.forEach((l, i) => {
    l.style.transition = `transform 0.35s cubic-bezier(0.77,0,0.175,1) ${i * 0.05}s`;
    l.style.transformOrigin = 'left';
    l.style.transform = 'scaleX(1)';
  });

  setTimeout(() => {
    // Switch pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const next = document.getElementById('page-' + pageId);
    if (next) next.classList.add('active');
    currentPage = pageId;

    // Update nav dots
    document.querySelectorAll('.dot').forEach(d => d.classList.toggle('active', d.dataset.page === pageId));

    // Scroll next page to top
    if (next) next.scrollTop = 0;

    // Trigger page-specific animations
    setTimeout(() => triggerPageAnimations(pageId), 100);

    // Phase 2: layers slide out
    layers.forEach((l, i) => {
      l.style.transition = `transform 0.35s cubic-bezier(0.77,0,0.175,1) ${i * 0.05}s`;
      l.style.transformOrigin = 'right';
      l.style.transform = 'scaleX(0)';
    });

    setTimeout(() => {
      body.classList.remove('transitioning');
      layers.forEach(l => {
        l.style.transform = '';
        l.style.transformOrigin = '';
      });
      isTransitioning = false;
    }, 450);

  }, 420);
}

function triggerPageAnimations(pageId) {
  if (pageId === 'about') {
    animateSkillBars();
  }
  if (pageId === 'contact') {
    startContactTyped();
  }
}

// ---- CLICK HANDLERS ----
document.querySelectorAll('[data-page]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const page = el.dataset.page;
    if (page) navigateTo(page);
  });
});

// ---- HAMBURGER MENU ----
const hamburger = document.getElementById('hamburger');
const menuOverlay = document.getElementById('menu-overlay');
let menuOpen = false;

function openMenu() {
  menuOpen = true;
  hamburger.classList.add('open');
  menuOverlay.classList.add('open');
}

function closeMenu() {
  if (!menuOpen) return;
  menuOpen = false;
  hamburger.classList.remove('open');
  menuOverlay.classList.remove('open');
}

hamburger.addEventListener('click', () => {
  if (menuOpen) closeMenu(); else openMenu();
});

// Close menu on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

// ---- SKILL BARS (About page) ----
let skillsBarsAnimated = false;
function animateSkillBars() {
  if (skillsBarsAnimated) return;
  skillsBarsAnimated = true;
  document.querySelectorAll('.skill-prog').forEach(bar => {
    const w = bar.dataset.w + '%';
    bar.style.width = '0';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { bar.style.width = w; });
    });
  });
}

// ---- CONTACT TYPING ANIMATION ----
const contactTyped = document.getElementById('contact-typed');
const contactWords = ['internships.', 'full-time roles.', 'research collaborations.', 'freelance projects.', 'hackathons.'];
let ctIdx = 0, ctChar = 0, ctDeleting = false, ctStarted = false;

function startContactTyped() {
  if (ctStarted || !contactTyped) return;
  ctStarted = true;
  typeContact();
}

function typeContact() {
  if (!contactTyped) return;
  const word = contactWords[ctIdx];
  if (!ctDeleting) {
    ctChar++;
    contactTyped.textContent = word.substring(0, ctChar);
    if (ctChar === word.length) { ctDeleting = true; setTimeout(typeContact, 1800); return; }
  } else {
    ctChar--;
    contactTyped.textContent = word.substring(0, ctChar);
    if (ctChar === 0) { ctDeleting = false; ctIdx = (ctIdx + 1) % contactWords.length; setTimeout(typeContact, 400); return; }
  }
  setTimeout(typeContact, ctDeleting ? 50 : 80);
}

// ---- CONTACT FORM ----
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    const success = document.getElementById('form-success');
    btn.querySelector('span').textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
      btn.querySelector('span').textContent = 'Send Message';
      btn.disabled = false;
      success.style.display = 'block';
      form.reset();
      setTimeout(() => { success.style.display = 'none'; }, 5000);
    }, 1200);
  });
}

// ---- HOME PAGE PARALLAX on hero right ----
const heroWrap = document.getElementById('hero-canvas-wrap');
document.addEventListener('mousemove', e => {
  if (currentPage !== 'home' || !heroWrap) return;
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  heroWrap.style.transform = `translate(${x}px, ${y}px)`;
});

// ---- KEYBOARD NAV ----
const pageOrder = ['home', 'about', 'portfolio', 'contact'];
document.addEventListener('keydown', e => {
  if (menuOpen) return;
  const idx = pageOrder.indexOf(currentPage);
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    if (idx < pageOrder.length - 1) navigateTo(pageOrder[idx + 1]);
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    if (idx > 0) navigateTo(pageOrder[idx - 1]);
  }
});

// ---- INIT ----
(function init() {
  // Set home as active
  document.getElementById('page-home').classList.add('active');
  document.querySelector('.dot[data-page="home"]').classList.add('active');
})();
