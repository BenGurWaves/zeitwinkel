// ─── Zeitwinkel — Das Werk ───
// Caliber ZW0102, schematic. Click any station to explore.

const stage = document.getElementById('stage');
const movement = document.getElementById('movement');
const camera = document.getElementById('camera');
const loader = document.getElementById('loader');
const cursor = document.getElementById('cursor');
const cursorLabel = document.getElementById('cursor-label');
const panel = document.getElementById('panel');
const panelClose = document.getElementById('panel-close');
const panelContent = document.getElementById('panel-content');
const titleOverlay = document.getElementById('title-overlay');
const marks = document.querySelectorAll('.mark');
const hint = document.getElementById('hint');
const stations = document.querySelectorAll('.station');

const STATION_LABELS = {
  barrel: 'Mainspring · Power',
  center: 'The Workshop',
  escape: 'Escapement',
  balance: 'First Heartbeat',
  plate: 'German Silver'
};

let activeStation = null;
let cursorActive = false;

// ─── Procedural SVG generation ───────────────────────────────

const SVG_NS = 'http://www.w3.org/2000/svg';

// Build ratchet teeth around the barrel
function buildRatchetTeeth() {
  const g = document.getElementById('ratchet-teeth');
  const cx = -160, cy = -200, r = 105, count = 60;
  let path = '';
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const x1 = cx + Math.cos(a) * r;
    const y1 = cy + Math.sin(a) * r;
    const x2 = cx + Math.cos(a + 0.05) * (r + 4);
    const y2 = cy + Math.sin(a + 0.05) * (r + 4);
    const x3 = cx + Math.cos(a + 0.1) * r;
    const y3 = cy + Math.sin(a + 0.1) * r;
    path += `M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} `;
  }
  const p = document.createElementNS(SVG_NS, 'path');
  p.setAttribute('d', path);
  p.setAttribute('fill', 'none');
  p.setAttribute('stroke', '#B8B0A8');
  p.setAttribute('stroke-width', '0.4');
  p.setAttribute('opacity', '0.4');
  g.appendChild(p);
}

// Mainspring spiral
function buildMainspring() {
  const cx = -160, cy = -200;
  let path = `M ${cx + 14} ${cy}`;
  const turns = 6;
  const steps = 220;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * turns * Math.PI * 2;
    const radius = 14 + t * 70;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    path += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  document.getElementById('mainspring').setAttribute('d', path);
}

// Center wheel spokes + teeth
function buildCenterWheel() {
  const spokes = document.getElementById('center-spokes');
  const teeth = document.getElementById('center-teeth');
  const cx = 0, cy = -40, r = 58;
  // 6 spokes
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const x1 = cx, y1 = cy;
    const x2 = cx + Math.cos(a) * r;
    const y2 = cy + Math.sin(a) * r;
    const ln = document.createElementNS(SVG_NS, 'line');
    ln.setAttribute('x1', x1); ln.setAttribute('y1', y1);
    ln.setAttribute('x2', x2); ln.setAttribute('y2', y2);
    ln.setAttribute('stroke', '#B8B0A8');
    ln.setAttribute('stroke-width', '1.5');
    ln.setAttribute('opacity', '0.6');
    spokes.appendChild(ln);
  }
  // teeth
  const count = 64;
  let path = '';
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const x1 = cx + Math.cos(a) * r;
    const y1 = cy + Math.sin(a) * r;
    const x2 = cx + Math.cos(a + 0.04) * (r + 3);
    const y2 = cy + Math.sin(a + 0.04) * (r + 3);
    const x3 = cx + Math.cos(a + 0.08) * r;
    const y3 = cy + Math.sin(a + 0.08) * r;
    path += `M ${x1.toFixed(2)} ${y1.toFixed(2)} L ${x2.toFixed(2)} ${y2.toFixed(2)} L ${x3.toFixed(2)} ${y3.toFixed(2)} `;
  }
  const p = document.createElementNS(SVG_NS, 'path');
  p.setAttribute('d', path);
  p.setAttribute('fill', 'none');
  p.setAttribute('stroke', '#B8B0A8');
  p.setAttribute('stroke-width', '0.4');
  p.setAttribute('opacity', '0.4');
  teeth.appendChild(p);
}

// Generic spoke wheel
function buildSpokes(targetId, cx, cy, r, n) {
  const g = document.getElementById(targetId);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const x2 = cx + Math.cos(a) * r;
    const y2 = cy + Math.sin(a) * r;
    const ln = document.createElementNS(SVG_NS, 'line');
    ln.setAttribute('x1', cx); ln.setAttribute('y1', cy);
    ln.setAttribute('x2', x2); ln.setAttribute('y2', y2);
    ln.setAttribute('stroke', '#B8B0A8');
    ln.setAttribute('stroke-width', '1.2');
    ln.setAttribute('opacity', '0.55');
    g.appendChild(ln);
  }
}

// Escape wheel teeth (pointed, 30 teeth)
function buildEscapeTeeth() {
  const g = document.getElementById('escape-teeth');
  const cx = 160, cy = 280, r = 33;
  const count = 30;
  let path = '';
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const a2 = ((i + 0.4) / count) * Math.PI * 2;
    const a3 = ((i + 0.8) / count) * Math.PI * 2;
    const x1 = cx + Math.cos(a) * r;
    const y1 = cy + Math.sin(a) * r;
    const x2 = cx + Math.cos(a2) * (r + 5);
    const y2 = cy + Math.sin(a2) * (r + 5);
    const x3 = cx + Math.cos(a3) * r;
    const y3 = cy + Math.sin(a3) * r;
    path += `M ${x1.toFixed(2)} ${y1.toFixed(2)} L ${x2.toFixed(2)} ${y2.toFixed(2)} L ${x3.toFixed(2)} ${y3.toFixed(2)} `;
  }
  const p = document.createElementNS(SVG_NS, 'path');
  p.setAttribute('d', path);
  p.setAttribute('fill', 'none');
  p.setAttribute('stroke', '#B8B0A8');
  p.setAttribute('stroke-width', '0.5');
  p.setAttribute('opacity', '0.6');
  g.appendChild(p);
}

// Hairspring spiral around balance
function buildHairspring() {
  const cx = -220, cy = 200;
  let path = `M ${cx + 14} ${cy}`;
  const turns = 7;
  const steps = 260;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * turns * Math.PI * 2;
    const radius = 14 + t * 78;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    path += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  document.getElementById('hairspring').setAttribute('d', path);
}

buildRatchetTeeth();
buildMainspring();
buildCenterWheel();
buildSpokes('third-spokes', 140, 60, 42, 5);
buildSpokes('fourth-spokes', 240, 180, 36, 4);
buildEscapeTeeth();
buildHairspring();

// ─── Cursor ──────────────────────────────────────────────────

document.addEventListener('pointermove', (e) => {
  if (!cursorActive) {
    cursorActive = true;
    cursor.classList.add('active');
  }
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

stations.forEach(st => {
  st.addEventListener('mouseenter', () => {
    cursor.classList.add('hover');
    const id = st.dataset.id;
    cursorLabel.textContent = STATION_LABELS[id] || '';
  });
  st.addEventListener('mouseleave', () => {
    cursor.classList.remove('hover');
  });
});

panelClose.addEventListener('mouseenter', () => cursor.classList.add('hover'));
panelClose.addEventListener('mouseleave', () => cursor.classList.remove('hover'));

// ─── Zoom / station selection ────────────────────────────────

function selectStation(id) {
  const station = document.querySelector(`.station[data-id="${id}"]`);
  if (!station) return;

  activeStation = id;

  // Mark active states
  stations.forEach(s => s.classList.toggle('is-active', s.dataset.id === id));
  stage.classList.add('has-zoom');

  // Compute camera transform: translate so station center moves to a chosen anchor point
  const cx = parseFloat(station.dataset.cx);
  const cy = parseFloat(station.dataset.cy);
  const scale = 2.0;

  // We want the station point (cx,cy) in viewBox coords to appear roughly at viewBox(-220, 0)
  // (left of center, leaving the right side for the panel).
  const targetVbX = -220;
  const targetVbY = 0;

  // After scaling around (0,0): new position = (cx*scale, cy*scale)
  // We need translation such that scaled point = targetVbX, targetVbY
  // So translate by (targetVbX - cx*scale, targetVbY - cy*scale)
  const tx = targetVbX - cx * scale;
  const ty = targetVbY - cy * scale;

  camera.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;

  // Hide title overlay
  titleOverlay.classList.remove('visible');
  hint.classList.add('hide');

  // Render content into panel
  const tpl = document.getElementById(`content-${id}`);
  if (tpl) {
    panelContent.innerHTML = '';
    panelContent.appendChild(tpl.content.cloneNode(true));
  }

  // Open panel after a brief delay so zoom animation begins first
  setTimeout(() => panel.classList.add('open'), 250);
}

function deselectStation() {
  activeStation = null;
  stations.forEach(s => s.classList.remove('is-active'));
  stage.classList.remove('has-zoom');
  camera.style.transform = '';
  panel.classList.remove('open');
  setTimeout(() => titleOverlay.classList.add('visible'), 700);
}

stations.forEach(st => {
  st.addEventListener('click', (e) => {
    e.stopPropagation();
    const id = st.dataset.id;
    if (activeStation === id) {
      deselectStation();
    } else {
      selectStation(id);
    }
  });
});

panelClose.addEventListener('click', deselectStation);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && activeStation) {
    deselectStation();
  }
});

// Click outside (on stage) closes
stage.addEventListener('click', (e) => {
  if (activeStation && !e.target.closest('.station') && !e.target.closest('#panel')) {
    deselectStation();
  }
});

// ─── Loader ──────────────────────────────────────────────────

function hideLoader() {
  loader.classList.add('done');
  setTimeout(() => {
    titleOverlay.classList.add('visible');
    marks.forEach(m => m.classList.add('visible'));
    hint.classList.add('visible');
  }, 400);
}

window.addEventListener('load', () => {
  setTimeout(hideLoader, 2400);
});
