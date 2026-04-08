# GitHub Copilot Power Workshop

## Prerequisites

### Required

| Requirement | Version | How to Check |
|-------------|---------|--------------|
| **Node.js** | 18 or higher | `node --version` |
| **npm** | 9 or higher (ships with Node 18+) | `npm --version` |
| **VS Code** | Latest | `code --version` or check Help > About |
| **GitHub Copilot extension** | Latest | VS Code Extensions panel > search "GitHub Copilot" |
| **GitHub Copilot Chat extension** | Latest | VS Code Extensions panel > search "GitHub Copilot Chat" |
| **GitHub account with Copilot access** | Active subscription (Individual, Business, or Enterprise) | Copilot icon in VS Code status bar (bottom right) should show active |
| **Git** | 2.30+ | `git --version` |

### Optional (Recommended)

| Requirement | Purpose | Install |
|-------------|---------|---------|
| **GitHub CLI (`gh`)** | PR review demo (Section 4) | https://cli.github.com/ |
| **nodemon** | Auto-restart server during development | Included in devDependencies |

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/karankhanna047/copilot-workshop.git
cd copilot-workshop
```

### 2. Install dependencies

```bash
npm install
```

This installs:
- **express** (4.18) -- Web framework
- **uuid** (9.x) -- Unique ID generation
- **cors** (2.8) -- Cross-origin resource sharing
- **morgan** (1.10) -- HTTP request logger
- **jest** (29.x) -- Test framework
- **supertest** (6.x) -- HTTP assertion library
- **nodemon** (3.x) -- Auto-restart on file changes
- **eslint** (8.x) -- Code linter

### 3. Run the tests

```bash
npm test
```

You should see **5 passing tests**. If all 5 are green, your setup is complete.

### 4. Verify Copilot is working

1. Open any `.js` file in VS Code (e.g., `src/index.js`)
2. Start typing a comment like `// function to add two numbers`
3. You should see Copilot suggestions appear as gray "ghost text"
4. Press **Tab** to accept a suggestion

### 5. Verify Copilot Chat is working

1. Press **Ctrl+Cmd+I** (Mac) or **Ctrl+Alt+I** (Windows/Linux) to open the Chat panel
2. Type `Hello` and press Enter
3. You should get a response from Copilot

### 6. (Optional) Authenticate GitHub CLI

```bash
gh auth login
```

Follow the prompts to authenticate. This is needed for the PR review demo in Section 4.

---

## Running the Project

### Start the server

```bash
# Start with an empty database
npm start

# Start with seed data (15 tasks, 5 users)
npm run seed
```

The server runs on `http://localhost:3000`.

### Verify the server is running

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{"status":"ok","timestamp":"..."}
```

### Available npm scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the Express server |
| `npm run seed` | Start with pre-populated data (15 tasks, 5 users) |
| `npm run dev` | Start with nodemon (auto-restart on changes) |
| `npm test` | Run all Jest tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint on `src/` |
| `npm run client:install` | Install React UI dependencies |
| `npm run client:dev` | Start the React UI dev server (port 5173) |
| `npm run dev:all` | Seed data + start React UI in one command |

---

## React UI (TaskMaster Frontend)

A React + Tailwind dashboard that connects to the live API. It makes bugs **visible in the browser** -- pagination skips items, search misses results, stats show NaN -- giving you a visual feedback loop as you fix bugs.

### Quick Start

```bash
# Terminal 1 -- Backend API (port 3000)
npm run seed    # seed 15 tasks + 5 users
npm run dev     # start Express with nodemon

# Terminal 2 -- React UI (port 5173)
npm run client:install   # one-time: install React dependencies
npm run client:dev       # start Vite dev server
```

Then open **http://localhost:5173** in your browser.

> The Vite dev server proxies `/api/*` and `/health` requests to `localhost:3000`, so no CORS issues.

### Pages

| Page | URL | What It Shows |
|------|-----|---------------|
| **Dashboard** | `/` | Stats grid, recent tasks, completion rate, team workload |
| **Tasks** | `/tasks` | Full CRUD: paginated list, search, create/edit/delete |
| **Users** | `/users` | User list, create, delete |
| **Workshop Health** | `/health` | Automated bug detection -- tests the API for known bugs |

### Workshop Health Tests

The Workshop Health page runs automated checks against the API and shows pass/fail results:

| Test | What It Checks |
|------|---------------|
| API Health | Server reachable, returns `{status: "ok"}` |
| Pagination | Page 1 returns the correct first items |
| Case-Insensitive Search | `search?q=fix` and `search?q=Fix` return same count |
| Date Sorting | `/api/tasks/sorted` returns dates in ascending order |
| Stats (No NaN) | `completionRate` is a finite number |
| Analytics: Productivity | Endpoint returns real data (not stub) |
| Analytics: Overdue | Endpoint returns real data (not stub) |

Click **"Run All Tests"** to see which bugs are still present. Fix bugs in the backend and re-run to see them turn green.

---

## Project Structure

```
copilot-workshop/
  client/                               -- React UI (Vite + Tailwind)
    package.json                        -- Client dependencies
    vite.config.js                      -- Dev proxy to localhost:3000
    src/
      App.jsx                           -- Router with 4 pages
      api.js                            -- All fetch calls to the API
      components/                       -- Reusable UI components
      pages/
        Dashboard.jsx                   -- Stats, recent tasks, team workload
        Tasks.jsx                       -- Full CRUD with search & pagination
        Users.jsx                       -- User list, create, delete
        WorkshopHealth.jsx              -- Automated bug detection dashboard
  src/
    index.js                          -- Express app entry point (port 3000)
    seed.js                           -- Seed script with sample data
    models/
      Task.js                         -- Task model with in-memory storage
                                         (has 4 intentional bugs for the workshop)
      User.js                         -- User model (no input validation)
    routes/
      taskRoutes.js                   -- Task CRUD: GET, POST, PUT, DELETE /api/tasks
      userRoutes.js                   -- User endpoints: GET, POST, DELETE /api/users
      analyticsRoutes.js              -- Incomplete endpoints (TODO stubs)
    services/
      legacyReportEngine.js           -- Cryptic legacy code for /explain demo
    middleware/
      rateLimiter.js                  -- Empty placeholder (built during exercises)
      validator.js                    -- Empty placeholder (built during exercises)
    utils/
      dateHelpers.js                  -- Date utilities (has a month off-by-one bug)
    __tests__/
      task.test.js                    -- 5 starter tests
  exercises/
    EXERCISES.md                      -- Attendee handout with copy-paste prompts
    pr_review_demo/
      buggy_search_service.js         -- 8 intentional security/code issues
      SETUP_PR_DEMO.sh                -- Script to set up the PR before workshop
    regex_challenge/
      challenges.js                   -- 6 regex challenges (fill in the blank)
      challenges.test.js              -- Automated test scoring
    refactoring_challenge/
      callbackHell.js                 -- 130 lines of nested callbacks
      callbackHell.test.js            -- Tests that must keep passing
    speed_challenge/
      README.md                       -- 5-minute notification system race
    python_converter/
      task_api.py                     -- Python Flask API for translation exercise
    ui_mockup/
      mockup.html                     -- Dashboard for screenshot-to-code demo
    powerups_demo/
      .github/prompts/
        create-api-endpoint.prompt.md -- Reusable prompt template
        write-tests.prompt.md         -- Reusable test generation template
      .github/hooks/
        pre-commit-lint.sh            -- Auto-lint before Copilot commits
      .vscode/
        mcp.json                      -- MCP server configuration example
    custom_agents_demo/
      .github/agents/
        security-reviewer.agent.md    -- Security specialist agent
        test-generator.agent.md       -- Test writing specialist agent
```

---

## API Endpoints

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks (supports `?page=&limit=` for pagination) |
| GET | `/api/tasks/:id` | Get a task by ID |
| POST | `/api/tasks` | Create a task (requires `title` in body) |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/api/tasks/search?q=` | Search tasks by title/description |
| GET | `/api/tasks/stats` | Get task statistics |
| GET | `/api/tasks/sorted` | Get tasks sorted by due date |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get a user by ID |
| POST | `/api/users` | Create a user |
| DELETE | `/api/users/:id` | Delete a user |

### Analytics (Stubs -- built during workshop)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/productivity` | Returns `{"message":"Not implemented yet"}` |
| GET | `/api/analytics/overdue` | Returns `{"message":"Not implemented yet"}` |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Returns `{"status":"ok","timestamp":"..."}` |

See [API-REFERENCE.md](API-REFERENCE.md) for full request/response examples with curl commands.

---

## Known Bugs (Intentional -- Workshop Material)

These bugs are planted intentionally for attendees to find and fix using Copilot:

| Bug | File | What's Wrong |
|-----|------|-------------|
| Off-by-one pagination | `src/models/Task.js` ~line 61 | Page 1 skips the first `limit` items |
| Case-sensitive search | `src/models/Task.js` ~line 76 | Searching "Login" won't find "login" |
| Broken date sorting | `src/models/Task.js` ~line 86 | String subtraction instead of Date comparison |
| Division by zero | `src/models/Task.js` ~line 104 | `completionRate` returns NaN when 0 tasks |
| Month off-by-one | `src/utils/dateHelpers.js` ~line 18 | January shows as month 0 |
| No user validation | `src/routes/userRoutes.js` | POST /api/users accepts empty body |

---

## Workshop Sections

| # | Section | Duration | What Happens |
|---|---------|----------|-------------|
| 1 | Setup & First Run | 5 min | Screenshot-to-code demo with Copilot Vision |
| 2 | Project Context | 5 min | `@workspace`, custom instructions, prompt engineering |
| 3 | Bug Investigation & Fix | 10 min | `/explain` legacy code, inline chat fixes, `@terminal` debugging |
| 4 | Automated PR Review | 10 min | Add Copilot as PR reviewer, inline comments, one-click fixes |
| 5 | Plan, Approve & Build | 10 min | `/plan` -> review -> approve -> Agent Mode implements |
| 6 | Collaborative Coding | 8 min | Agent Mode multi-file refactoring + speed challenge |
| 7 | Power-Ups | 7 min | Hooks, prompt files, MCP servers, custom agents |
| 8 | Best Practices | 3 min | The 5 rules + keyboard shortcuts |
| 9 | Q&A | 2 min | Questions + weekly challenge |

---

## Keyboard Shortcuts

| Action | Mac | Windows/Linux |
|--------|-----|---------------|
| **Inline Chat** (edit in place) | **Cmd+I** | **Ctrl+I** |
| Chat Panel | Ctrl+Cmd+I | Ctrl+Alt+I |
| **Agent Mode** (autonomous) | **Shift+Cmd+I** | **Ctrl+Shift+I** |
| Accept suggestion | Tab | Tab |
| Dismiss suggestion | Escape | Escape |
| Switch AI model | Cmd+Alt+. | Ctrl+Alt+. |

---

## Troubleshooting

### Copilot not showing suggestions

1. Click the Copilot icon in the VS Code status bar (bottom right) -- verify your subscription is active
2. Try signing out and back in: click the Accounts icon (person icon, bottom left) > Sign Out > Sign In
3. Restart VS Code
4. Check Extensions > GitHub Copilot > ensure it is enabled (not disabled for workspace)

### Copilot Chat not responding

1. Close and reopen the Chat panel (Ctrl+Cmd+I / Ctrl+Alt+I)
2. Check your internet connection
3. Restart VS Code
4. Verify the GitHub Copilot Chat extension is installed and enabled

### npm test fails

1. Make sure you ran `npm install` first
2. Check your Node.js version: `node --version` (must be 18+)
3. Try deleting `node_modules` and reinstalling: `rm -rf node_modules && npm install`

### gh CLI not authenticated

```bash
gh auth login
# Select: GitHub.com > HTTPS > Login with a web browser
# Follow the browser prompt
```

---

## During the Workshop

1. Keep `exercises/EXERCISES.md` open in a tab -- it has all the prompts you'll need to copy-paste
2. Keep the terminal visible at the bottom of VS Code for running tests
3. Use the keyboard shortcuts above instead of clicking through menus

---

## Resources

**Documentation**:
- [VS Code Copilot Features](https://code.visualstudio.com/docs/copilot/reference/copilot-vscode-features)
- [Prompt Engineering Guide](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)
- [Custom Instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
- [Best Practices](https://docs.github.com/en/copilot/get-started/best-practices)
- [Community Agents & Skills](https://github.com/github/awesome-copilot)

**Free Training**:
- [Microsoft Learn Path](https://learn.microsoft.com/en-us/training/paths/copilot/)
- [4-Week Bootcamp](https://github.com/Pwd9000-ML/GitHub-Copilot-Bootcamp)
- [Hands-on Labs](https://github.com/microsoft/github-copilot-workshops-labs)

---

## License

This workshop project is for educational purposes.
