/* ============================================================
   MUHAMMAD AHSAN IJAZ — PORTFOLIO JS
   ============================================================ */

// ── NAV scroll effect ──────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Hamburger menu ─────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── Hero canvas grid ───────────────────────────────────────
const canvas  = document.getElementById('grid-canvas');
const ctx     = canvas.getContext('2d');
let W, H, dots = [];

function initCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
  const spacing = 60;
  dots = [];
  for (let x = 0; x < W; x += spacing) {
    for (let y = 0; y < H; y += spacing) {
      dots.push({ x, y, ox: x, oy: y, vx: 0, vy: 0 });
    }
  }
}

let mouseX = W / 2, mouseY = H / 2;
window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function drawGrid() {
  ctx.clearRect(0, 0, W, H);
  const accent = '0, 229, 255';

  dots.forEach(d => {
    const dx = mouseX - d.x;
    const dy = mouseY - d.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const force = Math.max(0, 1 - dist / 160);

    d.vx += (-dx / dist) * force * 1.5;
    d.vy += (-dy / dist) * force * 1.5;

    // Spring back
    d.vx += (d.ox - d.x) * 0.08;
    d.vy += (d.oy - d.y) * 0.08;

    // Damping
    d.vx *= 0.85;
    d.vy *= 0.85;

    d.x += d.vx;
    d.y += d.vy;

    const alpha = 0.15 + force * 0.5;
    ctx.beginPath();
    ctx.arc(d.x, d.y, 1 + force * 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${accent}, ${alpha})`;
    ctx.fill();
  });

  // Draw lines between nearby dots
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const a = dots[i], b = dots[j];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist < 70) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${accent}, ${0.04 * (1 - dist / 70)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(drawGrid);
}

initCanvas();
drawGrid();
window.addEventListener('resize', initCanvas);

// ── Timeline scroll reveal ─────────────────────────────────
const timelineItems = document.querySelectorAll('.timeline-item');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.index) * 80;
      setTimeout(() => entry.target.classList.add('visible'), delay);
    }
  });
}, { threshold: 0.15 });
timelineItems.forEach(el => observer.observe(el));

// ── Contact form (Netlify-compatible) ──────────────────────
const form   = document.getElementById('contact-form');
const status = document.getElementById('form-status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  status.textContent = 'Sending...';

  const data = new FormData(form);
  const body = new URLSearchParams(data).toString();

  try {
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    });
    if (res.ok) {
      status.textContent = '✓ Message sent! I\'ll get back to you soon.';
      status.style.color = '#a8ff78';
      form.reset();
    } else {
      throw new Error('Network response not ok');
    }
  } catch {
    status.textContent = '✕ Something went wrong. Please email directly.';
    status.style.color = '#ff6b6b';
  }
});

// ── Smooth active nav link highlighting ───────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${entry.target.id}`
          ? 'var(--accent)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
