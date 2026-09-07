// ---------------------------------------------------------------
// LadderQuest frontend — talks to the backend BFS API.
// No algorithm logic lives here; this file only renders responses
// from /api/solve and /api/validate-step.
// ---------------------------------------------------------------

const startInput = document.getElementById('startWord');
const endInput = document.getElementById('endWord');
const solveBtn = document.getElementById('solveBtn');
const statusMsg = document.getElementById('statusMsg');
const bfsSection = document.getElementById('bfsSection');
const bfsLevels = document.getElementById('bfsLevels');
const resultSection = document.getElementById('resultSection');
const ladderEl = document.getElementById('ladder');
const chainSummary = document.getElementById('chainSummary');
const gameSection = document.getElementById('gameSection');
const gameChainEl = document.getElementById('gameChain');
const gameInput = document.getElementById('gameInput');
const gameSubmit = document.getElementById('gameSubmit');
const gameReset = document.getElementById('gameReset');
const gameFeedback = document.getElementById('gameFeedback');
const gameCount = document.getElementById('gameCount');

const PRESETS = [
  ['COLD', 'WARM'], ['HEAD', 'TAIL'], ['LOVE', 'HATE'],
  ['CAT', 'DOG'], ['GOOD', 'EVIL'], ['SHIP', 'DOCK']
];
const presetsEl = document.getElementById('presets');
PRESETS.forEach(([a, b]) => {
  const chip = document.createElement('button');
  chip.className = 'preset-chip';
  chip.textContent = `${a} → ${b}`;
  chip.addEventListener('click', () => {
    startInput.value = a; endInput.value = b; runSolve();
  });
  presetsEl.appendChild(chip);
});

let currentPath = null;
let gameChain = [];
let gameActive = false;

function showStatus(msg) {
  statusMsg.textContent = msg;
  statusMsg.classList.add('show');
}
function hideStatus() { statusMsg.classList.remove('show'); }

function diffIndex(a, b) {
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return i;
  return -1;
}

async function runSolve() {
  hideStatus();
  const start = startInput.value.trim();
  const end = endInput.value.trim();

  bfsSection.style.display = 'none';
  resultSection.style.display = 'none';
  gameSection.classList.remove('show');
  bfsLevels.innerHTML = '';
  ladderEl.innerHTML = '';

  solveBtn.disabled = true;

  let data;
  try {
    const res = await fetch('/api/solve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ start, end })
    });
    data = await res.json();
    if (!res.ok) {
      showStatus(data.error || 'Something went wrong.');
      solveBtn.disabled = false;
      return;
    }
  } catch (err) {
    showStatus('Could not reach the server. Is it running?');
    solveBtn.disabled = false;
    return;
  }

  const endLower = end.toLowerCase();
  const pathSet = data.path ? new Set(data.path) : new Set();

  bfsSection.style.display = 'block';
  for (let li = 0; li < data.levels.length; li++) {
    const level = data.levels[li];
    const row = document.createElement('div');
    row.className = 'bfs-level';
    row.style.animationDelay = (li * 0.12) + 's';
    const label = document.createElement('div');
    label.className = 'level-label';
    label.textContent = `L${li}`;
    row.appendChild(label);
    const wordsWrap = document.createElement('div');
    wordsWrap.className = 'level-words';
    level.forEach(w => {
      const tile = document.createElement('span');
      tile.className = 'node-tile' + (pathSet.has(w) ? ' on-path' : '');
      tile.textContent = w.toUpperCase();
      wordsWrap.appendChild(tile);
    });
    row.appendChild(wordsWrap);
    bfsLevels.appendChild(row);
    await new Promise(r => setTimeout(r, 180));
    if (data.path && level.includes(endLower)) break;
  }

  if (!data.path) {
    showStatus(data.error);
    solveBtn.disabled = false;
    return;
  }

  currentPath = data.path;
  resultSection.style.display = 'block';
  data.path.forEach((w, i) => {
    const rung = document.createElement('div');
    rung.className = 'rung';
    const tile = document.createElement('div');
    tile.className = 'rung-tile';
    if (i === 0) {
      tile.textContent = w.toUpperCase();
    } else {
      const prev = data.path[i - 1];
      const idx = diffIndex(prev, w);
      let html = '';
      for (let c = 0; c < w.length; c++) {
        html += c === idx ? `<span class="diff">${w[c].toUpperCase()}</span>` : w[c].toUpperCase();
      }
      tile.innerHTML = html;
    }
    rung.appendChild(tile);
    ladderEl.appendChild(rung);
  });

  chainSummary.innerHTML = `Shortest chain: <b>${data.path.length}</b> words · <b>${data.path.length - 1}</b> transformation${data.path.length - 1 === 1 ? '' : 's'}`;

  gameChain = [data.path[0]];
  gameActive = true;
  gameSection.classList.add('show');
  renderGameChain();
  gameFeedback.textContent = '';
  gameFeedback.className = 'game-feedback';
  gameCount.textContent = `Your steps so far: 0 · AI needed ${data.path.length - 1}`;

  solveBtn.disabled = false;
}

function renderGameChain() {
  gameChainEl.innerHTML = '';
  gameChain.forEach((w, i) => {
    if (i > 0) {
      const arrow = document.createElement('span');
      arrow.className = 'game-arrow';
      arrow.textContent = '→';
      gameChainEl.appendChild(arrow);
    }
    const tile = document.createElement('span');
    tile.className = 'game-tile';
    tile.textContent = w.toUpperCase();
    gameChainEl.appendChild(tile);
  });
}

async function submitGameStep() {
  if (!gameActive) return;
  const val = gameInput.value.trim();
  const end = endInput.value.trim().toLowerCase();
  const last = gameChain[gameChain.length - 1];
  gameFeedback.className = 'game-feedback';

  if (!val) return;

  if (gameChain.includes(val.toLowerCase())) {
    gameFeedback.textContent = `Already used "${val.toUpperCase()}" — pick a new word.`;
    gameFeedback.classList.add('err');
    return;
  }

  let data;
  try {
    const res = await fetch('/api/validate-step', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prev: last, next: val })
    });
    data = await res.json();
  } catch (err) {
    gameFeedback.textContent = 'Could not reach the server.';
    gameFeedback.classList.add('err');
    return;
  }

  if (!data.valid) {
    gameFeedback.textContent = data.reason;
    gameFeedback.classList.add('err');
    return;
  }

  const valLower = val.toLowerCase();
  gameChain.push(valLower);
  renderGameChain();
  gameInput.value = '';
  const steps = gameChain.length - 1;
  const optimal = currentPath.length - 1;
  gameCount.textContent = `Your steps so far: ${steps} · AI needed ${optimal}`;

  if (valLower === end) {
    gameActive = false;
    if (steps === optimal) {
      gameFeedback.textContent = `You matched the AI's optimal chain of ${optimal}! 🏆`;
    } else {
      gameFeedback.textContent = `You reached "${end.toUpperCase()}" in ${steps} steps — the AI found it in ${optimal}.`;
    }
    gameFeedback.classList.add('win');
  } else {
    gameFeedback.textContent = 'Valid step. Keep going.';
    gameFeedback.classList.add('ok');
  }
}

gameSubmit.addEventListener('click', submitGameStep);
gameInput.addEventListener('keydown', e => { if (e.key === 'Enter') submitGameStep(); });
gameReset.addEventListener('click', () => {
  gameChain = [currentPath[0]];
  gameActive = true;
  renderGameChain();
  gameFeedback.textContent = '';
  gameFeedback.className = 'game-feedback';
  gameCount.textContent = `Your steps so far: 0 · AI needed ${currentPath.length - 1}`;
});

solveBtn.addEventListener('click', runSolve);
[startInput, endInput].forEach(inp => {
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') runSolve(); });
  inp.addEventListener('input', () => { inp.value = inp.value.toUpperCase(); });
});

// initial run once the page loads
runSolve();
