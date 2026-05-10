// ─── Zeitwinkel — The Movement ───

const movementSvg = document.getElementById('movement-svg');
const parts = document.querySelectorAll('.movement-part');
const panels = document.querySelectorAll('.panel');
const loader = document.getElementById('loader');
const marks = document.querySelectorAll('.mark');
const hint = document.getElementById('hint');

let activePart = null;

// ─── Panel Toggle ───
function showPanel(partName) {
  // Hide all panels first
  panels.forEach(panel => panel.classList.remove('active'));

  if (activePart === partName) {
    // Toggle off if clicking same part
    activePart = null;
    return;
  }

  activePart = partName;
  const panel = document.querySelector(`.panel[data-part="${partName}"]`);
  if (panel) {
    panel.classList.add('active');
  }
}

// ─── Part Click ───
parts.forEach(part => {
  part.addEventListener('click', (e) => {
    e.stopPropagation();
    const partName = part.dataset.part;
    showPanel(partName);
    hint.classList.remove('visible');
  });
});

// ─── Click outside to close ───
document.addEventListener('click', (e) => {
  if (!e.target.closest('.movement-part') && !e.target.closest('.panel')) {
    panels.forEach(panel => panel.classList.remove('active'));
    activePart = null;
  }
});

// ─── Loader ───
function hideLoader() {
  loader.classList.add('done');
  setTimeout(() => {
    marks.forEach(m => m.classList.add('visible'));
    hint.classList.add('visible');
  }, 600);
}

window.addEventListener('load', () => {
  setTimeout(hideLoader, 2400);
});
