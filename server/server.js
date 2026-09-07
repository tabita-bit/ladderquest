const express = require('express');
const path = require('path');
const { WORD_SET } = require('./words');
const { bfsSolve, validateStep } = require('./bfs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve the frontend as static files (so the whole app runs from one server)
app.use(express.static(path.join(__dirname, '..', 'client')));

// --- API routes -----------------------------------------------------

// GET /api/word/:word/valid -> { valid: boolean }
app.get('/api/word/:word/valid', (req, res) => {
  const word = req.params.word.toLowerCase();
  res.json({ valid: WORD_SET.has(word) });
});

// POST /api/solve  { start, end } -> { path, levels } or { error }
app.post('/api/solve', (req, res) => {
  const { start, end } = req.body || {};

  if (!start || !end) {
    return res.status(400).json({ error: 'Both "start" and "end" words are required.' });
  }
  const s = String(start).toLowerCase().trim();
  const e = String(end).toLowerCase().trim();

  if (s.length !== e.length) {
    return res.status(400).json({ error: 'Words must be the same length.' });
  }
  if (![3, 4, 5].includes(s.length)) {
    return res.status(400).json({ error: 'Words must be 3-5 letters long.' });
  }
  if (!WORD_SET.has(s)) {
    return res.status(400).json({ error: `"${s.toUpperCase()}" isn't in the dictionary.` });
  }
  if (!WORD_SET.has(e)) {
    return res.status(400).json({ error: `"${e.toUpperCase()}" isn't in the dictionary.` });
  }

  const result = bfsSolve(s, e);

  if (!result.path) {
    return res.json({
      path: null,
      levels: result.levels,
      error: `No transformation chain exists between "${s.toUpperCase()}" and "${e.toUpperCase()}" in this dictionary.`,
    });
  }

  res.json({ path: result.path, levels: result.levels, error: null });
});

// POST /api/validate-step  { prev, next } -> { valid, reason? }
app.post('/api/validate-step', (req, res) => {
  const { prev, next } = req.body || {};
  if (!prev || !next) {
    return res.status(400).json({ valid: false, reason: 'Both "prev" and "next" are required.' });
  }
  res.json(validateStep(prev, next));
});

app.listen(PORT, () => {
  console.log(`LadderQuest server running at http://localhost:${PORT}`);
});
