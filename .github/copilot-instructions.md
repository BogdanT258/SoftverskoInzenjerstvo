<!-- Copilot instructions for AI coding agents working on the Library rental repo -->
# Copilot / AI Assistant Instructions

Purpose: help AI coding agents become productive quickly in this repository.

- **Big picture**:
  - Frontend: Create React App (TypeScript) in [frontend](frontend) — primary UI lives under `frontend/src` (see [frontend/package.json](frontend/package.json)).
  - Backend: Node/Express + TypeORM + MySQL described in root [README.md](README.md) but the `backend/` folder is currently empty — treat backend work as a new service to scaffold under `backend/`.
  - Dataflow: UI -> HTTP API (axios). Expect a single-page React app calling REST endpoints on a separate backend service.

- **Where to make changes**:
  - UI logic, routes and components: `frontend/src` (start with `frontend/src/App.tsx`, `frontend/src/index.tsx`).
  - Shared client-side utilities / API clients: add `frontend/src/services` and `frontend/src/utils`.
  - Tests: `frontend/src/*.test.tsx` (project uses CRA test runner).

- **Developer workflows / commands** (run from the repo root or `frontend/` as noted):
  - Install frontend deps: run in `frontend/`

    ```bash
    cd frontend
    npm install
    ```

  - Start dev server (CRA):

    ```bash
    npm start
    ```

  - Run tests (CRA/Jest):

    ```bash
    npm test
    ```

  - Build production bundle:

    ```bash
    npm run build
    ```

- **Windows PowerShell note**: the POSIX `mkdir -p src/{components,...}` fails in PowerShell (missing argument). Use one of these instead from `frontend/`:

  - Single `mkdir` call for multiple folders:

    ```powershell
    mkdir src\components, src\pages, src\services, src\contexts, src\types, src\utils
    ```

  - Or create each directory (works cross-shell):

    ```powershell
    New-Item -ItemType Directory -Force -Path src\components,src\pages,src\services,src\contexts,src\types,src\utils
    ```

  - Or use Git Bash / WSL for POSIX patterns.

- **Project-specific conventions & patterns (discoverable from codebase)**:
  - TypeScript + CRA (see [frontend/package.json](frontend/package.json)). Keep types in `src/types`.
  - Routing uses `react-router-dom` — place page-level components in `src/pages` and route wiring in `src/App.tsx`.
  - API calls use `axios` (present in `package.json`): centralize a configured client at `src/services/api.ts` and export thin service modules (e.g., `booksService.ts`).
  - Tests use the CRA harness and `@testing-library/*` packages; follow existing test file patterns such as `App.test.tsx`.

- **Integration points / environment**:
  - Expect an API base URL configuration via environment variables (create `REACT_APP_API_URL` in `.env` for local development).
  - Backend (when implemented) should run on a different port (e.g., `:3001`) and expose JSON REST endpoints.

- **Examples** (minimal guidance to implement):
  - Create an axios client: `frontend/src/services/api.ts` using `axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001' })`.
  - Add page route: update `frontend/src/App.tsx` to import `src/pages/Home` and add a `<Route path="/" element={<Home/>} />`.

- **Testing & debugging**:
  - Use `npm test` for unit/component tests. For a single test run use the interactive prompt or set `CI=true` with a file pattern.
  - Run the app with `npm start` and open `http://localhost:3000` for UI debugging; use browser devtools + React DevTools.

- **When touching backend**:
  - Scaffold `backend/` as a typical Node.js + Express app, matching the README tech choices (TypeORM + MySQL). Keep API routes under `backend/src/routes` and DB entities under `backend/src/entities`.

- **Commit & PR guidance for AI edits**:
  - Keep changes focused and small; update or add tests for new behavior in `frontend/src` when possible.
  - If adding new top-level folders under `frontend/src`, include an index export and update `frontend/README.md` if that helps other developers.

If anything is unclear or you want the file to include code snippets or more examples (example service, sample route wiring, or a starter `backend/` scaffold), tell me which part to expand. 
