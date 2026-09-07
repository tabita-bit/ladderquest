const { WORD_SET } = require('./words');

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

/**
 * All dictionary words that differ from `word` by exactly one letter
 * (same length). This is how graph edges are defined implicitly —
 * we never store an adjacency list, we generate it on demand.
 */
function neighbors(word) {
  const out = [];
  for (let i = 0; i < word.length; i++) {
    for (const letter of ALPHABET) {
      if (letter === word[i]) continue;
      const candidate = word.slice(0, i) + letter + word.slice(i + 1);
      if (WORD_SET.has(candidate)) out.push(candidate);
    }
  }
  return out;
}

/**
 * Breadth-first search from `start` to `end`.
 * Returns:
 *   path   - shortest word chain (array), or null if no path exists
 *   levels - array of arrays: the words discovered at each BFS depth,
 *            useful for animating the search frontier client-side
 */
function bfsSolve(start, end) {
  start = start.toLowerCase();
  end = end.toLowerCase();

  const levels = [[start]];
  const visited = new Set([start]);
  const parent = { [start]: null };

  if (start === end) {
    return { path: [start], levels };
  }

  let frontier = [start];
  let found = false;

  while (frontier.length && !found) {
    const nextFrontier = [];
    for (const word of frontier) {
      for (const n of neighbors(word)) {
        if (!visited.has(n)) {
          visited.add(n);
          parent[n] = word;
          nextFrontier.push(n);
          if (n === end) found = true;
        }
      }
    }
    if (nextFrontier.length) levels.push(nextFrontier);
    frontier = nextFrontier;
  }

  if (!found) return { path: null, levels };

  const path = [];
  let cur = end;
  while (cur !== null) {
    path.unshift(cur);
    cur = parent[cur];
  }
  return { path, levels };
}

/** Validates one game-mode step: same length, real word, one-letter diff. */
function validateStep(prevWord, nextWord) {
  prevWord = prevWord.toLowerCase();
  nextWord = nextWord.toLowerCase();

  if (nextWord.length !== prevWord.length) {
    return { valid: false, reason: `Must be ${prevWord.length} letters long.` };
  }
  if (!WORD_SET.has(nextWord)) {
    return { valid: false, reason: `"${nextWord.toUpperCase()}" isn't a recognized word.` };
  }
  const diffCount = [...nextWord].filter((c, i) => c !== prevWord[i]).length;
  if (diffCount !== 1) {
    return { valid: false, reason: `Must differ from "${prevWord.toUpperCase()}" by exactly one letter.` };
  }
  return { valid: true };
}

module.exports = { neighbors, bfsSolve, validateStep };
