// ─── Zeitwinkel — Surface ───
// The cursor is a point light. The surface responds.

const surface = document.getElementById('surface');
const light = document.getElementById('light');
const lightDiffuse = document.getElementById('light-diffuse');
const lightEngrave = document.getElementById('light-engrave');
const loader = document.getElementById('loader');
const cursor = document.getElementById('cursor');
const marks = document.querySelectorAll('.mark');
const progress = document.getElementById('progress-fill');
const sectionNum = document.getElementById('section-num');
const engravings = document.querySelectorAll('.engraving');

const TOTAL = engravings.length;
let current = 0;
let transitioning = false;
let lightX = 960;
let lightY = 540;
let targetX = 960;
let targetY = 540;
let cursorActive = false;
let loaded = false;

// ─── Light follows cursor with lerp ───────────────────────

function lerp(a, b, t) { return a + (b - a) * t; }

function animateLight() {
  lightX = lerp(lightX, targetX, 0.04);
  lightY = lerp(lightY, targetY, 0.04);

  // Map viewport coords to SVG viewBox (1920x1080)
  const svgX = (lightX / window.innerWidth) * 1920;
  const svgY = (lightY / window.innerHeight) * 1080;

  light.setAttribute('x', svgX);
  light.setAttribute('y', svgY);
  lightDiffuse.setAttribute('x', svgX);
  lightDiffuse.setAttribute('y', svgY);
  lightEngrave.setAttribute('x', svgX);
  lightEngrave.setAttribute('y', svgY);

  requestAnimationFrame(animateLight);
}

document.addEventListener('pointermove', (e) => {
  targetX = e.clientX;
  targetY = e.clientY;

  if (!cursorActive && loaded) {
    cursorActive = true;
    cursor.classList.add('active');
  }
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

// Mobile: auto-orbit light
let mobileAngle = 0;
function mobileOrbit() {
  if (window.innerWidth > 768) return;
  mobileAngle += 0.004;
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const rx = window.innerWidth * 0.35;
  const ry = window.innerHeight * 0.25;
  targetX = cx + Math.cos(mobileAngle) * rx;
  targetY = cy + Math.sin(mobileAngle * 0.7) * ry;
  requestAnimationFrame(mobileOrbit);
}

// ─── Section navigation (scroll / swipe / keys) ─────────

function goTo(index) {
  if (index < 0 || index >= TOTAL || index === current || transitioning) return;
  transitioning = true;

  const prev = engravings[current];
  const next = engravings[index];

  prev.classList.add('leaving');
  prev.classList.remove('active');

  setTimeout(() => {
    prev.classList.remove('leaving');
    next.classList.add('active');
    current = index;
    transitioning = false;

    // Update progress
    const pct = ((current + 1) / TOTAL) * 100;
    progress.style.width = pct + '%';
    sectionNum.textContent = String(current + 1).padStart(2, '0');
  }, 700);
}

// Wheel
let wheelAccum = 0;
let wheelTimer = null;
document.addEventListener('wheel', (e) => {
  e.preventDefault();
  wheelAccum += e.deltaY;
  clearTimeout(wheelTimer);
  wheelTimer = setTimeout(() => {
    if (wheelAccum > 30) goTo(current + 1);
    else if (wheelAccum < -30) goTo(current - 1);
    wheelAccum = 0;
  }, 80);
}, { passive: false });

// Keys
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
    e.preventDefault();
    goTo(current + 1);
  }
  if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    e.preventDefault();
    goTo(current - 1);
  }
});

// Touch swipe
let touchStart = 0;
document.addEventListener('touchstart', (e) => {
  touchStart = e.touches[0].clientY;
}, { passive: true });
document.addEventListener('touchend', (e) => {
  const dy = touchStart - e.changedTouches[0].clientY;
  if (dy > 50) goTo(current + 1);
  else if (dy < -50) goTo(current - 1);
}, { passive: true });

// ─── Loader ──────────────────────────────────────────────

function hideLoader() {
  loaded = true;
  loader.classList.add('done');
  surface.classList.add('visible');
  setTimeout(() => {
    marks.forEach(m => m.classList.add('visible'));
  }, 800);
}

window.addEventListener('load', () => {
  setTimeout(hideLoader, 2800);
});

// ─── Start ───────────────────────────────────────────────

animateLight();
if (window.innerWidth <= 768) mobileOrbit();

// A Velocity atelier work — © MMXXVI
