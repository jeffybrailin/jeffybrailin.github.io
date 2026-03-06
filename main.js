/* ===========================
   MAIN.JS — JEFFY BRAILIN PORTFOLIO v2.0
   Enhanced: Mouse-reactive particles, magnetic buttons,
   ripple effects, smooth animations, dynamic interactions
   =========================== */

// ---- MOUSE TRACKER (shared state) ----
const Mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
document.addEventListener('mousemove', e => { Mouse.x = e.clientX; Mouse.y = e.clientY; });

// ---- PARTICLE CANVAS (mouse-reactive) ----
(function () {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const COUNT = 90;
  const MOUSE_RADIUS = 150;
  const MOUSE_STRENGTH = 0.4;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function rand(a, b) { return Math.random() * (b - a) + a; }

  function createParticle() {
    return {
      x: rand(0, W), y: rand(0, H),
      vx: rand(-0.35, 0.35), vy: rand(-0.35, 0.35),
      baseVx: 0, baseVy: 0,
      r: rand(1, 2.8),
      alpha: rand(0.08, 0.5),
      color: ['#6366f1', '#06b6d4', '#a855f7', '#ec4899'][Math.floor(rand(0, 4))]
    };
  }

  for (let i = 0; i < COUNT; i++) {
    const p = createParticle();
    p.baseVx = p.vx;
    p.baseVy = p.vy;
    particles.push(p);
  }

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      // Mouse repulsion
      const dx = p.x - Mouse.x;
      const dy = p.y - Mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * MOUSE_STRENGTH;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }
      // Dampen back to base velocity
      p.vx += (p.baseVx - p.vx) * 0.05;
      p.vy += (p.baseVy - p.vy) * 0.05;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();

      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) { p.vx *= -1; p.baseVx *= -1; }
      if (p.y < 0 || p.y > H) { p.vy *= -1; p.baseVy *= -1; }
    });

    // Draw connecting lines
    ctx.globalAlpha = 1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const gradient = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
          gradient.addColorStop(0, '#6366f1');
          gradient.addColorStop(1, '#06b6d4');
          ctx.strokeStyle = gradient;
          ctx.globalAlpha = (1 - dist / 130) * 0.15;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
})();

// ---- CUSTOM CURSOR ----
(function () {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });

  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .tab-btn, .skill-card, .project-card, .cert-item').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });
})();

// ---- SCROLL PROGRESS ----
(function () {
  const bar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  });
})();

// ---- NAVBAR SCROLL ----
(function () {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  });
})();

// ---- HAMBURGER MENU ----
(function () {
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  const cta = document.querySelector('.nav-cta');

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    links.classList.toggle('open');
    if (cta) cta.classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      links.classList.remove('open');
      if (cta) cta.classList.remove('open');
    });
  });
})();

// ---- TYPING ANIMATION ----
(function () {
  const roles = [
    'ML Systems.', 'LLM Applications.', 'Quantum Algorithms.',
    'Fraud Detection Models.', 'AI Pipelines.', 'Scalable Products.'
  ];
  const el = document.getElementById('typed-text');
  let ri = 0, ci = 0, deleting = false;

  function type() {
    const current = roles[ri];
    if (!deleting) {
      el.textContent = current.slice(0, ++ci);
      if (ci === current.length) { deleting = true; setTimeout(type, 1800); return; }
    } else {
      el.textContent = current.slice(0, --ci);
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(type, deleting ? 45 : 90);
  }
  type();
})();

// ---- SCROLL REVEAL ----
(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
})();

// ---- COUNTER ANIMATION (supports decimals) ----
(function () {
  const counters = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        const isDecimal = el.closest('.dot7') !== null || el.classList.contains('dot7');
        const duration = 1800;
        let start = null;
        const step = timestamp => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const val = eased * target;
          el.textContent = Number.isInteger(target) ? Math.floor(val) : val.toFixed(0);
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target;
        };
        requestAnimationFrame(step);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
})();

// ---- SKILL BARS ANIMATION ----
(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          const w = bar.style.width;
          bar.style.width = '0';
          setTimeout(() => { bar.style.transition = 'width 1.2s cubic-bezier(0.4,0,0.2,1)'; bar.style.width = w; }, 100);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.tab-panel.active').forEach(p => observer.observe(p));
})();

// ---- SKILLS TABS ----
(function () {
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('tab-' + tab.dataset.tab);
      if (panel) {
        panel.classList.add('active');
        // Animate bars in new tab
        panel.querySelectorAll('.skill-fill').forEach(bar => {
          const w = bar.style.width;
          bar.style.width = '0';
          bar.style.transition = 'none';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              bar.style.transition = 'width 1.2s cubic-bezier(0.4,0,0.2,1)';
              bar.style.width = w;
            });
          });
        });
        // Trigger reveal on skill cards
        panel.querySelectorAll('.reveal-up').forEach((el, i) => {
          el.classList.remove('visible');
          setTimeout(() => el.classList.add('visible'), i * 80);
        });
      }
    });
  });
})();

// ---- CONTACT FORM ----
(function () {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const btn = document.getElementById('submit-btn');

  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    btn.innerHTML = '<span>Sending...</span>';
    btn.disabled = true;
    setTimeout(() => {
      form.reset();
      success.style.display = 'block';
      btn.innerHTML = '<span>Send Message</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
      btn.disabled = false;
      setTimeout(() => { success.style.display = 'none'; }, 4000);
    }, 1500);
  });
})();

// ---- ACTIVE NAV LINK ON SCROLL ----
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    const scrollY = window.scrollY + 120;
    let activeId = '';
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        activeId = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === activeId);
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
})();

// ---- MAGNETIC BUTTON EFFECT ----
(function () {
  document.querySelectorAll('.btn-primary, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.25;
      const dy = (e.clientY - cy) * 0.25;
      btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-3px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();

// ---- BUTTON RIPPLE EFFECT ----
(function () {
  document.querySelectorAll('.btn-primary, .nav-cta').forEach(btn => {
    btn.addEventListener('click', e => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.classList.add('btn-ripple');
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top: ${e.clientY - rect.top - size / 2}px;
      `;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });
})();

// ---- 3D TILT EFFECT ON PROJECT CARDS (smooth lerp) ----
(function () {
  document.querySelectorAll('.project-card').forEach(card => {
    let targetRx = 0, targetRy = 0, currentRx = 0, currentRy = 0;
    let animId = null;
    let isHovered = false;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function animate() {
      currentRx = lerp(currentRx, targetRx, 0.12);
      currentRy = lerp(currentRy, targetRy, 0.12);
      card.style.transform = `perspective(1000px) translateY(-6px) rotateX(${currentRx}deg) rotateY(${currentRy}deg)`;
      if (isHovered || Math.abs(currentRx) > 0.01 || Math.abs(currentRy) > 0.01) {
        animId = requestAnimationFrame(animate);
      }
    }

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRx = -y * 8;
      targetRy = x * 8;
      if (!isHovered) { isHovered = true; animId = requestAnimationFrame(animate); }
    });

    card.addEventListener('mouseleave', () => {
      isHovered = false;
      targetRx = 0; targetRy = 0;
      animate();
    });
  });
})();

// ---- PARALLAX SCROLL ON HERO ----
(function () {
  const heroVisual = document.querySelector('.hero-visual');
  const heroContent = document.querySelector('.hero-content');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (heroVisual) heroVisual.style.transform = `translateY(${y * 0.06}px)`;
    if (heroContent) heroContent.style.transform = `translateY(${y * 0.03}px)`;
  }, { passive: true });
})();

// ---- GLITCH EFFECT ON HERO NAME ----
(function () {
  const name = document.querySelector('.title-name');
  if (!name) return;
  const orig = name.textContent;
  const chars = 'アイウエオABCDEF0123456789!@#$%^&*';
  function glitch() {
    let count = 0;
    const iv = setInterval(() => {
      name.textContent = orig.split('').map((c, i) => {
        if (c === ' ') return c;
        return count > 8 ? orig[i] : chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      if (++count > 14) { clearInterval(iv); name.textContent = orig; }
    }, 55);
  }
  setTimeout(glitch, 1800);
  setInterval(glitch, 7000);
})();

// ---- STAGGERED PROJECT CARD ENTRANCE ----
(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.project-card');
        cards.forEach((card, i) => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(40px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 80 * i);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });
  const grid = document.querySelector('.projects-grid');
  if (grid) observer.observe(grid);
})();

// ---- SECTION LABEL GLOW ----
(function () {
  document.querySelectorAll('.section-label').forEach(el => {
    el.addEventListener('mouseenter', () => el.style.textShadow = '0 0 10px rgba(6,182,212,0.9)');
    el.addEventListener('mouseleave', () => el.style.textShadow = '');
  });
})();
