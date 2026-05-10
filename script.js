// ─── Zeitwinkel — The Five Positions ───

const roomsContainer = document.getElementById('rooms');
const rooms = document.querySelectorAll('.room');
const loader = document.getElementById('loader');
const cursor = document.getElementById('cursor');
const progressFill = document.getElementById('progress-fill');
const progressMarks = document.querySelectorAll('.progress-mark');
const roomCurrent = document.getElementById('room-current');
const roomIndicator = document.getElementById('room-indicator');
const marks = document.querySelectorAll('.mark');
const hint = document.getElementById('hint');

const ROOM_COUNT = 5;
const SNAP_THRESHOLD = 0.15; // 15% of viewport width

let currentIndex = 0;
let targetIndex = 0;
let isDragging = false;
let startX = 0;
let startOffset = 0;
let cursorActive = false;

// ─── Utils ───
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }

// ─── Room Transitions ───
function updateRooms() {
  const offset = -targetIndex * 100;
  roomsContainer.style.transform = `translateX(${offset}vw)`;
  roomsContainer.style.transition = 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)';

  // Update active states
  rooms.forEach((room, i) => {
    if (i === targetIndex) {
      room.classList.add('active');
    } else {
      room.classList.remove('active');
    }
  });

  // Update progress
  const progress = (targetIndex / (ROOM_COUNT - 1)) * 100;
  progressFill.style.width = progress + '%';
  progressMarks.forEach((mark, i) => {
    if (i <= targetIndex) {
      mark.classList.add('active');
    } else {
      mark.classList.remove('active');
    }
  });

  // Update indicator
  roomCurrent.textContent = String(targetIndex + 1).padStart(2, '0');
}

// ─── Drag / Swipe ───
document.addEventListener('pointerdown', (e) => {
  if (e.target instanceof Element && e.target.closest('#cursor')) return;
  isDragging = true;
  startX = e.clientX;
  startOffset = -currentIndex * window.innerWidth;
  roomsContainer.style.transition = 'none';
  hint.classList.remove('visible');
});

document.addEventListener('pointermove', (e) => {
  // Cursor
  if (!cursorActive) {
    cursorActive = true;
    cursor.classList.add('active');
  }
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';

  // Drag
  if (isDragging) {
    const dx = e.clientX - startX;
    const rawOffset = startOffset + dx;
    const maxOffset = 0;
    const minOffset = -(ROOM_COUNT - 1) * window.innerWidth;
    const clampedOffset = clamp(rawOffset, minOffset, maxOffset);
    roomsContainer.style.transform = `translateX(${clampedOffset}px)`;

    // Calculate tentative index
    const tentative = Math.round(-clampedOffset / window.innerWidth);
    targetIndex = clamp(tentative, 0, ROOM_COUNT - 1);
  }
});

document.addEventListener('pointerup', () => {
  if (!isDragging) return;
  isDragging = false;
  currentIndex = targetIndex;
  updateRooms();
});

document.addEventListener('pointerleave', () => {
  if (isDragging) {
    isDragging = false;
    currentIndex = targetIndex;
    updateRooms();
  }
});

// ─── Wheel ───
document.addEventListener('wheel', (e) => {
  e.preventDefault();
  if (e.deltaX > 30 || e.deltaY > 30) {
    if (targetIndex < ROOM_COUNT - 1) {
      targetIndex++;
      currentIndex = targetIndex;
      updateRooms();
    }
  } else if (e.deltaX < -30 || e.deltaY < -30) {
    if (targetIndex > 0) {
      targetIndex--;
      currentIndex = targetIndex;
      updateRooms();
    }
  }
}, { passive: false });

// ─── Keyboard ───
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault();
    if (targetIndex < ROOM_COUNT - 1) {
      targetIndex++;
      currentIndex = targetIndex;
      updateRooms();
    }
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    if (targetIndex > 0) {
      targetIndex--;
      currentIndex = targetIndex;
      updateRooms();
    }
  }
});

// ─── Loader ───
function hideLoader() {
  loader.classList.add('done');
  setTimeout(() => {
    marks.forEach(m => m.classList.add('visible'));
    roomIndicator.classList.add('visible');
    hint.classList.add('visible');
    rooms[0].classList.add('active');
  }, 600);
}

window.addEventListener('load', () => {
  updateRooms();
  setTimeout(hideLoader, 2200);
});

// ─── Init ───
updateRooms();
