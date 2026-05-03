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

let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
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
// ── Rotating hero taglines ─────────────────────────────────
const taglines = [
  "// I deliver tested & polished as quanlity & functionality",
  "// I ship multiplayer worlds — not just prototypes.",
  "// From game design to deployment — end to end.",
  "// I have Blockchain, AI, and 10+ years of clean C#.",
  "// I Turn complex systems into seamless gameplay."
];
let tIdx = 0;
const tagEl = document.getElementById('hero-tagline');
setInterval(() => {
  tagEl.style.opacity = '0';
  setTimeout(() => {
    tIdx = (tIdx + 1) % taglines.length;
    tagEl.textContent = taglines[tIdx];
    tagEl.style.opacity = '1';
  }, 400);
}, 3200);

// ── PROJECT IMAGE CONFIG ──────────────────────────────────
// Fill in which image files belong to each project.
// Add as many images as you have — gallery handles any number.
const BASE = 'assets/images/SS/';
const projectGalleries = {
  'captain':      ['CnC1.jpg', 'CnC2.jpg', 'CnC3.jpg'],
  'moonkarts':    ['Moonkart1.jpg', 'Moonkart2.jpg', 'Moonkart3.jpg'],  
  'gnomewars':    ['GnomeWar1.jpg', 'GnomeWar2.jpg', 'GnomeWar3.jpg'],
  'arthur':       ['Arthur1.jpg', 'Arthur2.jpg', 'Arthur3.jpg'],
  'xana':         ['XANA.jpg', 'XANA2.jpg', 'XANA3.jpg'],
  'skyforge':     ['Skyforge1.jpg', 'Skyforge2.jpg'],
  'petidletycoon':['Pet1.jpg', 'Pet2.jpg', 'Pet3.jpg'],
  'historyclash': ['HC1.jpg', 'HC2.jpg', 'HC3.jpg'],
};

// ── GALLERY MODAL ─────────────────────────────────────────
const galleryModal  = document.getElementById('gallery-modal');
const galleryImg    = document.getElementById('gallery-img');
const galleryPrev   = document.getElementById('gallery-prev');
const galleryNext   = document.getElementById('gallery-next');
const galleryClose  = document.getElementById('gallery-close');
const galleryThumbs = document.getElementById('gallery-thumbs');
const galleryCur    = document.getElementById('gallery-current');
const galleryTot    = document.getElementById('gallery-total');

let currentImages = [];
let currentIndex  = 0;

function openGallery(projectKey) {
  const images = (projectGalleries[projectKey] || []).map(f => BASE + f);
  if (!images.length) return;
  currentImages = images;
  currentIndex  = 0;
  renderGallery();
  galleryModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function renderGallery() {
  galleryImg.src = currentImages[currentIndex];
  galleryCur.textContent = currentIndex + 1;
  galleryTot.textContent = currentImages.length;

  galleryThumbs.innerHTML = '';
  currentImages.forEach((src, i) => {
    const t = document.createElement('img');
    t.src = src;
    if (i === currentIndex) t.classList.add('active');
    t.addEventListener('click', () => { currentIndex = i; renderGallery(); });
    galleryThumbs.appendChild(t);
  });

  galleryPrev.style.display = currentImages.length > 1 ? '' : 'none';
  galleryNext.style.display = currentImages.length > 1 ? '' : 'none';
}

galleryPrev.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  renderGallery();
});
galleryNext.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % currentImages.length;
  renderGallery();
});
galleryClose.addEventListener('click', closeGallery);
galleryModal.addEventListener('click', e => { if (e.target === galleryModal) closeGallery(); });

function closeGallery() {
  galleryModal.style.display = 'none';
  document.body.style.overflow = '';
}

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (galleryModal.style.display === 'flex') {
    if (e.key === 'ArrowLeft')  { currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length; renderGallery(); }
    if (e.key === 'ArrowRight') { currentIndex = (currentIndex + 1) % currentImages.length; renderGallery(); }
    if (e.key === 'Escape')     closeGallery();
  }
  if (videoModal.style.display === 'flex' && e.key === 'Escape') closeVideo();
});

// Wire up gallery buttons
document.querySelectorAll('.thumb-gallery').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const card = btn.closest('[data-gallery]');
    if (card) openGallery(card.dataset.gallery);
  });
});

// ── VIDEO MODAL ───────────────────────────────────────────
const videoModal  = document.getElementById('video-modal');
const videoIframe = document.getElementById('video-iframe');
const videoClose  = document.getElementById('video-close');

function openVideo(videoId) {
  videoIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  videoModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeVideo() {
  videoIframe.src = '';
  videoModal.style.display = 'none';
  document.body.style.overflow = '';
}

videoClose.addEventListener('click', closeVideo);
videoModal.addEventListener('click', e => { if (e.target === videoModal) closeVideo(); });

document.querySelectorAll('.thumb-play').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    openVideo(btn.dataset.video);
  });
});