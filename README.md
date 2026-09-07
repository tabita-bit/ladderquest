# LadderQuest — BFS Word Ladder Solver (Backend + Frontend)

A word-ladder solver: given two words, the backend runs **Breadth-First
Search** over a dictionary graph (words are nodes, edges connect words that
differ by exactly one letter) and returns the shortest transformation chain.
The frontend animates the search and renders the result.

```
ladderquest-full/
├── server/
│   ├── package.json     backend dependencies + start script
│   ├── words.js         the dictionary (word list)
│   ├── bfs.js           the BFS algorithm itself
│   └── server.js         Express app — API routes + serves the frontend
└── client/
    ├── index.html        page structure
    ├── style.css          styling
    └── app.js             calls the API, renders/animates the UI
```

The backend does the actual algorithmic work; the frontend is a thin client
that calls `POST /api/solve` and `POST /api/validate-step`.

---

## Step-by-step: running this in VS Code

### 1. Install prerequisites
You need **Node.js** (which includes npm) installed on your computer.
- Download it from https://nodejs.org (the LTS version is fine).
- Verify it installed by opening a terminal and running:
  ```
  node -v
  npm -v
  ```
  Both should print a version number.

### 2. Get the project into a folder
Create a folder on your computer called `ladderquest-full` and put the
`server/` and `client/` folders (with all their files) inside it, matching
the structure above.

### 3. Open the folder in VS Code
- Open VS Code.
- Go to **File → Open Folder…** and select your `ladderquest-full` folder.
- You should see `server/` and `client/` in the Explorer sidebar on the left.

### 4. Open the integrated terminal
- Go to **Terminal → New Terminal** (or press `` Ctrl+` `` / `` Cmd+` ``).
- This opens a terminal already pointed at your project folder.

### 5. Install backend dependencies
In the terminal, move into the `server` folder and install packages:
```
cd server
npm install
```
This reads `server/package.json` and downloads Express (the web framework)
into a `node_modules` folder — you'll see it appear in the Explorer.

### 6. Start the server
Still inside `server/`, run:
```
npm start
```
You should see in the terminal:
```
LadderQuest server running at http://localhost:3000
```
Leave this terminal running — it's your live server. To stop it later,
click into the terminal and press `Ctrl+C`.

### 7. Open the app in your browser
Go to **http://localhost:3000** in any browser. The Express server is
configured to serve the `client/` folder automatically, so you don't need
a separate frontend server — one `npm start` runs everything.

You should see LadderQuest load and immediately solve COLD → WARM.

### 8. Try it out
- Type your own start/end words (3–5 letters) and click **Find shortest
  ladder**.
- Click a preset chip to try a ready-made pair.
- Use the **Beat the ladder** panel to build your own chain and see how it
  compares to the AI's BFS-optimal solution.

### 9. Making changes
- Edit `server/bfs.js` to change the algorithm, `server/words.js` to expand
  the dictionary, or anything in `client/` to change the UI.
- After editing server files, stop the server (`Ctrl+C`) and run
  `npm start` again to pick up the changes. (Or use `npm run dev`, which
  uses Node's built-in `--watch` flag to restart automatically on save —
  requires Node 18.11+.)
- Frontend files (`client/*.html`, `*.css`, `*.js`) just need a browser
  refresh — no restart needed.

---

## API reference

### `POST /api/solve`
Request body:
```json
{ "start": "cold", "end": "warm" }
```
Response:
```json
{
  "path": ["cold", "cord", "card", "ward", "warm"],
  "levels": [["cold"], ["...level 1 words..."], ...],
  "error": null
}
```
If no path exists, `path` is `null` and `error` explains why.

### `POST /api/validate-step`
Request body:
```json
{ "prev": "cold", "next": "cord" }
```
Response:
```json
{ "valid": true }
```
or
```json
{ "valid": false, "reason": "Must differ from \"COLD\" by exactly one letter." }
```

### `GET /api/word/:word/valid`
Response: `{ "valid": true }` — checks if a word exists in the dictionary.
