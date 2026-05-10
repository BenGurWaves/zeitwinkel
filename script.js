// ─── Zeitwinkel — The Time Angle ───

const stage = document.getElementById('stage');
const loader = document.getElementById('loader');
const cursor = document.getElementById('cursor');
const sheen = document.getElementById('sheen');
const rayRotate = document.getElementById('ray-rotate');
const sectorPath = document.getElementById('sector');
const angleArc = document.getElementById('angle-arc');
const angleNum = document.getElementById('angle-num');
const contentLayers = document.querySelectorAll('.content-layer');
const marks = document.querySelectorAll('.mark');
const hint = document.getElementById('hint');

const ANGLES = [0, 15, 30, 45, 60];
const SNAP_THRESHOLD = 6; // degrees
const SECTOR_RADIUS = 80;
const ARC_RADIUS = 8;

let currentAngle = 0;
let targetAngle = 0;
let isDragging = false;
let startX = 0;
let startAngle = 0;
let activeAngleIndex = 0;
let cursorX = 0, cursorY = 0;
let cursorActive = false;

// ─── Utils ───
function degToRad(d) { return d * Math.PI / 180; }
function radToDeg(r) { return r * 180 / Math.PI; }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }

function getNearestSnapAngle(angle) {
  let nearest = ANGLES[0];
  let minDiff = Infinity;
  for (const a of ANGLES) {
    const diff = Math.abs(angle - a);
    if (diff < minDiff) { minDiff = diff; nearest = a; }
  }
  return { angle: nearest, diff: minDiff };
}

// ─── SVG Updates ───
function updateSVG(angle) {
  const rad = degToRad(angle);
  const cosA = Math.cos(rad);
  const sinA = Math.sin(rad);

  // Rotating ray
  rayRotate.setAttribute('x2', 50 + SECTOR_RADIUS * cosA);
  rayRotate.setAttribute('y2', 50 + SECTOR_RADIUS * sinA);

  // Sector path
  if (angle > 0.5) {
    const endX = 50 + SECTOR_RADIUS * cosA;
    const endY = 50 + SECTOR_RADIUS * sinA;
    const startX = 50 + SECTOR_RADIUS;
    const startY = 50;
    const d = `M 50 50 L ${startX} ${startY} A ${SECTOR_RADIUS} ${SECTOR_RADIUS} 0 0 1 ${endX} ${endY} Z`;
    sectorPath.setAttribute('d', d);
    sectorPath.setAttribute('opacity', '1');
  } else {
    sectorPath.setAttribute('d', '');
    sectorPath.setAttribute('opacity', '0');
  }

  // Angle arc near vertex
  if (angle > 1) {
    const arcEndX = 50 + ARC_RADIUS * cosA;
    const arcEndY = 50 + ARC_RADIUS * sinA;
    const arcStartX = 50 + ARC_RADIUS;
    const arcStartY = 50;
    const dArc = `M ${arcStartX} ${arcStartY} A ${ARC_RADIUS} ${ARC_RADIUS} 0 0 1 ${arcEndX} ${arcEndY}`;
    angleArc.setAttribute('d', dArc);
    angleArc.setAttribute('opacity', '0.25');
  } else {
    angleArc.setAttribute('d', '');
    angleArc.setAttribute('opacity', '0');
  }
}

// ─── Content Positioning ───
function positionContent() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cx = vw / 2;
  const cy = vh / 2;
  const isMobile = vw < 640;
  const baseDist = Math.min(vw, vh) * (isMobile ? 0.22 : 0.30);

  contentLayers.forEach(layer => {
    const angle = parseInt(layer.dataset.angle);
    let x, y;

    if (angle === 0) {
      // Below center
      x = cx;
      y = cy + baseDist * 0.85;
    } else {
      const bisector = degToRad(angle / 2);
      const dist = baseDist * (0.9 + angle / 300);
      x = cx + dist * Math.cos(bisector);
      y = cy + dist * Math.sin(bisector);
    }

    layer.style.left = x + 'px';
    layer.style.top = y + 'px';
    layer.style.transform = 'translate(-50%, -50%)';
  });
}

// ─── Content Reveal ───
function showContentForAngle(angle) {
  const snap = getNearestSnapAngle(angle);
  const newIndex = ANGLES.indexOf(snap.angle);

  if (newIndex !== activeAngleIndex && snap.diff < SNAP_THRESHOLD) {
    activeAngleIndex = newIndex;
    contentLayers.forEach((layer, i) => {
      if (i === newIndex) {
        layer.classList.add('active');
      } else {
        layer.classList.remove('active');
      }
    });
  }
}

// ─── Angle Number ───
let displayedAngle = 0;
function updateAngleDisplay() {
  const target = Math.round(currentAngle);
  displayedAngle = lerp(displayedAngle, target, 0.08);
  angleNum.textContent = Math.round(displayedAngle);
}

// ─── Animation Loop ───
function animate() {
  currentAngle = lerp(currentAngle, targetAngle, 0.08);
  updateSVG(currentAngle);
  updateAngleDisplay();
  showContentForAngle(currentAngle);
  requestAnimationFrame(animate);
}

// ─── Drag / Swipe ───
function getAngleFromPointer(x, y) {
  const rect = stage.getBoundingClientRect();
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const dx = x - cx;
  const dy = y - cy;
  let angle = radToDeg(Math.atan2(dy, dx));
  if (angle < 0) angle += 360;
  return angle;
}

stage.addEventListener('pointerdown', (e) => {
  isDragging = true;
  startX = e.clientX;
  startAngle = currentAngle;
  stage.setPointerCapture(e.pointerId);
  hint.classList.remove('visible');
});

stage.addEventListener('pointermove', (e) => {
  // Cursor
  cursorX = e.clientX;
  cursorY = e.clientY;
  if (!cursorActive) {
    cursorActive = true;
    cursor.classList.add('active');
  }
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';

  // Sheen shift
  const sheenX = (e.clientX / window.innerWidth) * 100;
  const sheenY = (e.clientY / window.innerHeight) * 100;
  sheen.style.background = `radial-gradient(ellipse 80% 60% at ${sheenX}% ${sheenY}%, rgba(184,176,168,0.10) 0%, transparent 70%)`;

  // Drag angle
  if (isDragging) {
    const dx = e.clientX - startX;
    const sensitivity = window.innerWidth < 640 ? 0.15 : 0.08;
    let newAngle = startAngle + dx * sensitivity;
    targetAngle = clamp(newAngle, 0, 60);
  }
});

stage.addEventListener('pointerup', () => {
  if (!isDragging) return;
  isDragging = false;
  const snap = getNearestSnapAngle(targetAngle);
  targetAngle = snap.angle;
});

stage.addEventListener('pointerleave', () => {
  if (isDragging) {
    isDragging = false;
    const snap = getNearestSnapAngle(targetAngle);
    targetAngle = snap.angle;
  }
});

// Wheel for desktop
stage.addEventListener('wheel', (e) => {
  e.preventDefault();
  const delta = e.deltaY > 0 ? 4 : -4;
  targetAngle = clamp(targetAngle + delta, 0, 60);
  const snap = getNearestSnapAngle(targetAngle);
  // Snap after a short delay
  clearTimeout(window.snapTimeout);
  window.snapTimeout = setTimeout(() => {
    targetAngle = snap.angle;
  }, 400);
}, { passive: false });

// Keyboard
stage.setAttribute('tabindex', '0');
stage.addEventListener('keydown', (e) => {
  const idx = ANGLES.indexOf(Math.round(targetAngle));
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault();
    if (idx < ANGLES.length - 1) targetAngle = ANGLES[idx + 1];
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    if (idx > 0) targetAngle = ANGLES[idx - 1];
  }
});

// ─── Loader ───
function hideLoader() {
  loader.classList.add('done');
  setTimeout(() => {
    document.getElementById('angle-display').classList.add('visible');
    marks.forEach(m => m.classList.add('visible'));
    hint.classList.add('visible');
    // Show first content
    contentLayers[0].classList.add('active');
  }, 600);
}

window.addEventListener('load', () => {
  positionContent();
  setTimeout(hideLoader, 2400);
});

window.addEventListener('resize', () => {
  positionContent();
});

// ─── Init ───
updateSVG(0);
positionContent();
animate();
