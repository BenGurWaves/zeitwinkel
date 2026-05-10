// ─── Zeitwinkel — The Observatory ───

const sky = document.getElementById('sky');
const stars = document.querySelectorAll('.star');
const stardustContainer = document.getElementById('stardust');
const constellationSvg = document.getElementById('constellation');
const watchLoop = constellationSvg.querySelector('[data-loop="watch"]');
const storyLoop = constellationSvg.querySelector('[data-loop="story"]');
const detailPanel = document.getElementById('detail-panel');
const detailTitle = detailPanel.querySelector('.detail-title');
const detailBody = detailPanel.querySelector('.detail-body');
const detailClose = detailPanel.querySelector('.detail-close');
const cursor = document.getElementById('cursor');
const loader = document.getElementById('loader');
const marks = document.querySelectorAll('.mark');
const hint = document.getElementById('hint');

const LIGHT_RADIUS = 140; // px
const PINNED_STARS = new Set();
let cursorActive = false;
let cursorX = 0, cursorY = 0;
let isTouch = false;

// ─── Constellation connections ───
const WATCH_LOOP = ['zeitwinkel', 'saphir173', 'saphir273', 'model240', 'email082', 'maks188', 'zeitwinkel'];
const STORY_LOOP = ['zeitwinkel', 'friends', 'hundred', 'germansilver', 'movement', 'philosophy', 'zeitwinkel'];

// ─── Stardust ───
function generateStardust(count) {
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div');
    dot.className = 'stardust-dot';
    dot.style.left = Math.random() * 100 + '%';
    dot.style.top = Math.random() * 100 + '%';
    dot.style.setProperty('--sd-opacity', (0.03 + Math.random() * 0.06).toFixed(3));
    dot.style.setProperty('--sd-duration', (3 + Math.random() * 5).toFixed(1) + 's');
    dot.style.setProperty('--sd-delay', (Math.random() * 4).toFixed(1) + 's');
    stardustContainer.appendChild(dot);
  }
}

// ─── Twinkle ───
function initTwinkle() {
  stars.forEach(star => {
    const label = star.querySelector('.star-label');
    const computed = getComputedStyle(label);
    const baseOpacity = parseFloat(computed.opacity) || 0.2;
    star.style.setProperty('--base-opacity', baseOpacity);
    star.style.setProperty('--twinkle-duration', (2.5 + Math.random() * 4).toFixed(1) + 's');
    star.style.setProperty('--twinkle-delay', (Math.random() * 3).toFixed(1) + 's');
    star.classList.add('twinkle');
  });
}

// ─── Distance ───
function getDistance(el, x, y) {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  return Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
}

// ─── Illuminate ───
function illuminateStars(x, y) {
  let nearAny = false;

  stars.forEach(star => {
    const id = star.dataset.id;
    if (PINNED_STARS.has(id)) return;

    const dist = getDistance(star, x, y);
    if (dist < LIGHT_RADIUS) {
      star.classList.add('illuminated');
      nearAny = true;
    } else {
      star.classList.remove('illuminated');
    }
  });

  // Cursor ring feedback
  if (nearAny) {
    cursor.classList.add('near-star');
  } else {
    cursor.classList.remove('near-star');
  }
}

// ─── Constellation Lines ───
function drawConstellation() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  function makePath(ids) {
    let d = '';
    for (let i = 0; i < ids.length; i++) {
      const star = document.querySelector(`.star[data-id="${ids[i]}"]`);
      if (!star) continue;
      const rect = star.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / vw * 100;
      const y = (rect.top + rect.height / 2) / vh * 100;
      d += (i === 0 ? 'M' : 'L') + ` ${x.toFixed(2)} ${y.toFixed(2)} `;
    }
    return d;
  }

  watchLoop.setAttribute('d', makePath(WATCH_LOOP));
  storyLoop.setAttribute('d', makePath(STORY_LOOP));

  // Fade in lines
  requestAnimationFrame(() => {
    watchLoop.setAttribute('opacity', '0.12');
    storyLoop.setAttribute('opacity', '0.08');
  });
}

// ─── Detail Panel ───
function showDetail(star) {
  const rect = star.getBoundingClientRect();
  const title = star.querySelector('.star-label').textContent;
  const body = star.dataset.detail || '';

  detailTitle.textContent = title;
  detailBody.textContent = body;

  // Position panel near star, keeping within viewport
  const panelWidth = 320;
  const panelHeight = 160;
  let left = rect.left + rect.width / 2 + 16;
  let top = rect.top + rect.height / 2 - 40;

  if (left + panelWidth > window.innerWidth - 20) {
    left = rect.left - panelWidth - 16;
  }
  if (top + panelHeight > window.innerHeight - 20) {
    top = window.innerHeight - panelHeight - 20;
  }
  if (top < 20) top = 20;
  if (left < 20) left = 20;

  detailPanel.style.left = left + 'px';
  detailPanel.style.top = top + 'px';
  detailPanel.classList.add('open');
}

function hideDetail() {
  detailPanel.classList.remove('open');
}

// ─── Pin / Unpin ───
function togglePin(star) {
  const id = star.dataset.id;
  if (PINNED_STARS.has(id)) {
    PINNED_STARS.delete(id);
    star.classList.remove('pinned');
    if (PINNED_STARS.size === 0) hideDetail();
  } else {
    PINNED_STARS.add(id);
    star.classList.add('pinned');
    showDetail(star);
  }
}

// ─── Click handling ───
stars.forEach(star => {
  star.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePin(star);
  });
});

detailClose.addEventListener('click', () => {
  PINNED_STARS.clear();
  stars.forEach(s => s.classList.remove('pinned'));
  hideDetail();
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.star') && !e.target.closest('#detail-panel')) {
    PINNED_STARS.clear();
    stars.forEach(s => s.classList.remove('pinned'));
    hideDetail();
  }
});

// ─── Cursor / Light ───
document.addEventListener('pointermove', (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;

  if (!cursorActive) {
    cursorActive = true;
    cursor.classList.add('active');
  }

  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';

  illuminateStars(cursorX, cursorY);
});

// ─── Touch ───
document.addEventListener('touchstart', () => { isTouch = true; }, { passive: true });

// ─── Loader ───
function hideLoader() {
  loader.classList.add('done');
  setTimeout(() => {
    marks.forEach(m => m.classList.add('visible'));
    hint.classList.add('visible');
  }, 600);
}

// ─── Init ───
window.addEventListener('load', () => {
  generateStardust(80);
  initTwinkle();
  drawConstellation();
  setTimeout(hideLoader, 2400);
});

window.addEventListener('resize', () => {
  drawConstellation();
});

// Keyboard: Escape closes detail
 document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    PINNED_STARS.clear();
    stars.forEach(s => s.classList.remove('pinned'));
    hideDetail();
  }
});
