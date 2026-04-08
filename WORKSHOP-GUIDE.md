# GitHub Copilot Power Workshop - Complete Presenter Guide

**Duration**: 1 hour
**Audience**: Mid-level developers who have used Copilot before
**Format**: Live-coding workshop (NOT slides -- code the entire time)
**Goal**: Take them from "I use autocomplete" to "I use an AI-powered engineering workflow"

---

## AGENDA

1. Setup & First Run
2. Project Context
3. Live: Bug Investigation & Fix
4. Live: Automated PR Review with Inline Comments
5. Live: Plan, Approve & Build a Feature
6. Live: Collaborative Coding Across Files
7. Power-Ups: Hooks, Custom Commands, MCP, Subagents
8. Best Practices Cheat Sheet
9. Q&A

---

## TIMING OVERVIEW

| Time | Section | What Happens |
|------|---------|-------------|
| 0:00-0:05 | 1. Setup & First Run | Open project, first Copilot interaction, wow demo |
| 0:05-0:10 | 2. Project Context | @workspace tour, custom instructions, prompt engineering |
| 0:10-0:20 | 3. Bug Investigation & Fix | /explain legacy code, inline chat fixes, @terminal debugging |
| 0:20-0:30 | 4. Automated PR Review | Create branch, Copilot reviews PR, inline comments, auto-fix |
| 0:30-0:40 | 5. Plan, Approve & Build | /plan -> review -> approve -> Agent Mode implements |
| 0:40-0:48 | 6. Collaborative Coding Across Files | Agent Mode multi-file refactoring + speed challenge |
| 0:48-0:55 | 7. Power-Ups | Hooks, prompt files, MCP servers, custom agents |
| 0:55-0:58 | 8. Best Practices Cheat Sheet | Pitfalls, cheat sheet, resources |
| 0:58-1:00 | 9. Q&A | Questions + closing challenge |

---

## Pre-Workshop Setup (30 Minutes Before)

### Your Machine
1. VS Code latest, GitHub Copilot + Copilot Chat extensions updated
2. `gh` CLI installed and authenticated (`gh auth login`)
3. This project open: `copilot-workshop/`
4. `npm install` completed, `npm test` passes (5 tests green)
5. Copilot Chat working (Ctrl+Cmd+I / Ctrl+Alt+I)
6. Agent Mode working (Shift+Cmd+I / Ctrl+Shift+I)
7. **PR Review prep**: Push project to a GitHub repo and run the PR setup script:
   ```bash
   git add -A && git commit -m "Initial project setup"
   git remote add origin <YOUR_REPO_URL>
   git push -u origin main
   git checkout -b feature/user-search
   cp exercises/pr_review_demo/buggy_search_service.js src/services/searchService.js
   git add src/services/searchService.js
   git commit -m "Add user search service"
   git push -u origin feature/user-search
   gh pr create --title "Add user search service" --body "Implements search for user profiles with external data fetching." --draft
   git checkout main
   ```
8. Note the PR number from step 7 -- you'll use it during the demo
9. Open `exercises/ui_mockup/mockup.html` in browser (for screenshot demo)

### Attendee Pre-Setup (share 1 day before)
```
WORKSHOP SETUP - Do this BEFORE the session:
1. Update VS Code to latest version
2. Install/update: GitHub Copilot extension + GitHub Copilot Chat extension
3. Clone the repo: git clone [YOUR REPO URL]
4. cd copilot-workshop && npm install
5. npm test (should see 5 passing tests)
6. Verify Copilot icon appears in VS Code status bar (bottom right)
7. Test Chat: press Ctrl+Cmd+I (Mac) / Ctrl+Alt+I (Win), type "Hello"
8. Optional: install gh CLI (https://cli.github.com/) for PR review section
```

---

# SECTION 1: Setup & First Run (5 minutes)

## What to Say

> "Welcome everyone. Zero slides today. We have a real project -- a Task Management
> API with bugs, legacy code, and missing features. You'll fix, review, and build
> all of it using Copilot."
>
> "Let's verify everyone's setup. Open VS Code, open the copilot-workshop folder.
> You should see the src/ and exercises/ directories."

## Verify Setup (1 minute)

> "In your terminal, run `npm test`. You should see 5 passing tests. Hands up if
> you're green. ... Good."
>
> "Now let's do our first Copilot interaction."

## First Run: The WOW Moment (4 minutes)

> "Before we get into exercises, let me show you something most people don't know
> Copilot can do."

**Step 1**: Switch to browser showing the TaskMaster dashboard mockup

> "This is a dashboard design. Imagine you got this from your designer."

**Step 2**: Screenshot it (Cmd+Shift+4 / Win+Shift+S)

**Step 3**: Paste into Copilot Chat, type:
```
Generate a React component with Tailwind CSS that matches this dashboard.
Include the stats cards, task list, sprint progress, and team workload sections.
```

> "It read the screenshot, understood the layout, colors, and data structure,
> and generated a working component. This works with hand-drawn sketches too."
>
> "That's the level we're operating at today. Let's get into the project."

---

# SECTION 2: Project Context (5 minutes)

## What to Say

> "Two things that separate Copilot beginners from power users: understanding
> your codebase and custom instructions. Let's set up both."

## @workspace: Understand the Codebase (2 minutes)

**Step 1**: Open Copilot Chat (Ctrl+Cmd+I / Ctrl+Alt+I), type:
```
@workspace Give me a summary of this project -- what does it do, what's the
tech stack, and what are the main files? Also flag any bugs or issues you can find.
```

> "I used @workspace -- this tells Copilot to search your ENTIRE codebase, not just
> open files. Without it, Copilot only sees your open tabs. This is the #1 underused feature."

## Custom Instructions: The Team Multiplier (3 minutes)

> "Now the most impactful thing you'll set up today."

**Step 1**: Create `.github/copilot-instructions.md` together:

```bash
mkdir -p .github
```

**Step 2**: Everyone types along:

```markdown
# TaskMaster Project Conventions

## Code Style
- Express.js with async/await (never callbacks)
- Proper HTTP status codes (201 created, 204 deleted, 400 bad input, 404 not found)
- Descriptive variable names, never single letters

## Error Handling
- Validate input before processing
- Return JSON errors: { "error": "Human-readable message" }
- Never expose stack traces to clients

## Testing (Jest + Supertest)
- Name tests: "should [behavior] when [condition]"
- Test success, error, and edge cases
- beforeEach to reset state

## Security
- Validate and sanitize all user input
- Never use eval() with user data
- Parameterize all database queries
```

> "From now on, Copilot reads this on EVERY request. Verify: ask Copilot to generate
> any function and check the References dropdown -- you'll see copilot-instructions.md listed."

### QUICK DEMO: Bad vs Good Prompts (1 minute)

Bad: `make the user route better`
Good:
```
Add input validation to POST /api/users in src/routes/userRoutes.js:
1. name is required, non-empty string, max 100 chars
2. email is required, valid email format
3. role must be one of: "admin", "member", "viewer"
4. Return 400 with { "error": "specific message" } for each failure
```

> "Specific, Short, Surrounding context. Write prompts like Jira tickets."

---

# SECTION 3: Live - Bug Investigation & Fix (10 minutes)

## What to Say

> "Let's investigate and fix real bugs. Three tools: /explain to understand,
> inline chat (Cmd+I) to fix, and @terminal to debug test failures."

## Part A: Investigate Legacy Code (3 minutes)

**Step 1**: Open `src/services/legacyReportEngine.js`

> "This file has single-letter variable names, no comments, no types. The developer
> who wrote it left 2 years ago. In a normal day, understanding this takes an hour."

**Step 2**: Select ALL code. In Copilot Chat:
```
/explain
```

> "10 seconds. It told us `pr` is a report processor, `fmt` formats values,
> `rnk` ranks data with tie handling, `agg` aggregates with sum/avg/min/max.
> Use /explain in every code review from now on."

### ATTENDEE ACTION
> "Open the same file, select all, /explain. You have 1 minute."

## Part B: Fix Bugs with Inline Chat (5 minutes)

**Step 1**: Open `src/models/Task.js`

**WATCH ME** -- fix the pagination bug:

Select the `paginate` method, press **Cmd+I** (Ctrl+I):
```
Fix the pagination: page 1 should return the first 'limit' items.
startIndex should be (page - 1) * limit for 1-based pagination.
```

> "Inline chat is faster than the panel for targeted edits. Cmd+I, describe the fix, done."

**YOUR TURN** -- fix these three:

### Bug 1: Case-Sensitive Search (~line 75)
Select `search` method, Cmd+I:
```
Search is case-sensitive. Fix: convert both query and field values to lowercase.
```

### Bug 2: Date Sorting (~line 82)
Select `sortByDueDate`, Cmd+I:
```
String subtraction doesn't compare dates. Fix: wrap dueDate in new Date() before subtracting.
```

### Bug 3: Division by Zero (~line 96)
Select `getStats`, Cmd+I:
```
Division by zero when no tasks. Fix: return 0 for completionRate when total is 0.
```

> "You have 3 minutes. Fix all three, then run `npm test`."

## Part C: @terminal Debugging (2 minutes)

**Step 1**: If any test fails after the fixes, type in Chat:
```
@terminal Why did the last test fail and how do I fix it?
```

> "Copilot reads your terminal output. Stop copying errors into Google."

**BONUS**: Open `src/utils/dateHelpers.js`, select `formatDate`, type `/fix`

> "For simple bugs, `/fix` figures out what's wrong on its own."

---

# SECTION 4: Live - Automated PR Review with Inline Comments (10 minutes)

## What to Say

> "Now something most of you haven't seen: Copilot as your code reviewer.
> Not just autocomplete -- a reviewer that reads your PR, understands the full
> codebase context, and posts inline comments on specific lines."

## WATCH ME: The Full PR Review Flow (6 minutes)

### Step 1: Show the PR

> "Before the workshop, I created a branch with a new search service and opened a PR.
> Let me show you the code."

Open `exercises/pr_review_demo/buggy_search_service.js`

> "Take a quick look. How many issues can you spot in 30 seconds? ... Now let's see
> what Copilot catches."

### Step 2: Add Copilot as reviewer (LIVE)

In your terminal:
```bash
gh pr edit <PR_NUMBER> --add-reviewer copilot
```

> "That's it. One command. Copilot is now reviewing the PR."

### Step 3: Wait and show results

> "It takes 30-60 seconds. Let me show you what it does while we wait."

While waiting, explain:

> "Copilot's code review is agentic now. It doesn't just scan the diff --
> it gathers full repository context first. It looks at how your change
> interacts with the rest of the codebase. It runs CodeQL and linting
> alongside the AI review."

### Step 4: Show the inline comments

Open the PR in browser:
```bash
gh pr view <PR_NUMBER> --web
```

Walk through the inline comments Copilot posted:

> "Look at this -- it found the SQL injection on the exact line. It flagged the
> hardcoded API key. It caught the empty catch block. It warned about sensitive
> data in logs. It found the eval() with user input."
>
> "Each comment has a specific suggestion with the fix. And here's the best part..."

### Step 5: Show one-click fix (if available)

> "See this 'Apply suggestion' button? Click it and Copilot commits the fix
> directly to the branch. Or you can pass all suggestions to the Coding Agent
> and it opens a fix PR automatically."

### Alternative: In-IDE Review (if no GitHub repo)

> "If you can't push to GitHub, you can also do this in VS Code.
> Open the PR diff, select code, and ask Copilot Chat:"
```
Review this code for security vulnerabilities, performance issues, and bugs.
Give me inline comments with severity (Critical/High/Medium/Low) and fixes.
```

## YOUR TURN: Review Your Neighbor's Code (4 minutes)

> "Pair up. Person A: open `exercises/pr_review_demo/buggy_search_service.js`.
> Person B: turn away from the screen."
>
> "Person A: select ALL the code, open Copilot Chat, type:"
```
Review this code as a senior security engineer. For each issue found, report:
1. Severity: Critical / High / Medium / Low
2. Line number
3. What's wrong
4. The exact code fix
Format as a numbered list.
```
> "Person A: read out the issues Copilot found.
> Person B: for each one, say if you would have caught it in a normal code review."
>
> *[Give 3 minutes]*
>
> "How many issues did Copilot find? ... It should find 8. How many would you
> have caught without Copilot? ... The point isn't that you're bad at reviews.
> The point is Copilot catches the things you might miss when you're tired at 4pm
> on a Friday."

---

# SECTION 5: Live - Plan, Approve & Build a Feature (10 minutes)

## What to Say

> "Now the full feature development workflow: Plan it. Review the plan. Approve it.
> Build it. All with Copilot."

## WATCH ME: /plan -> Approve -> Build (4 minutes)

### Step 1: Plan

In Copilot Chat:
```
/plan Implement the two incomplete analytics endpoints in src/routes/analyticsRoutes.js:

1. GET /api/analytics/productivity should return:
   - averageCompletionTime: avg hours from createdAt to completedAt for done tasks
   - tasksCompletedThisWeek: count of tasks completed in last 7 days
   - priorityDistribution: { low: count, medium: count, high: count }
   - topAssignees: top 3 assignees by completed task count

2. GET /api/analytics/overdue should return:
   - overdueByAssignee: object keyed by assignee, each with overdue tasks + daysOverdue
   - totalOverdue: total count
   - mostOverdue: single most overdue task

Also write tests in src/__tests__/analytics.test.js.
```

### Step 2: Review the plan

> "Read the plan. Does it make sense? Will it touch the right files? This is your chance
> to course-correct BEFORE any code is written. This is exactly like approving a tech
> design doc, except it took 10 seconds to write instead of 2 hours."

### Step 3: Approve and build

> "I'll say 'Looks good, implement it' and switch to Agent Mode."

Let Agent Mode run. Narrate what happens:

> "It's creating the route handlers... now writing the logic... creating the test file...
> running npm test... a test failed... it's reading the error... fixing it... re-running...
> green. I didn't touch anything."

## YOUR TURN: Plan & Build the Assignment System (6 minutes)

> "Open Agent Mode (Shift+Cmd+I) and paste this:"

```
/plan Add a complete task assignment system:

1. Create src/services/taskAssignment.js with:
   - assignTask(taskId, userId) - assigns user to task, validates both exist
   - unassignTask(taskId) - removes assignment
   - getTasksByAssignee(userId) - returns all tasks for a user
   - getWorkload() - returns { userId, name, taskCount, completedCount } sorted by most tasks

2. Create src/routes/assignmentRoutes.js with:
   - POST /api/assignments/:taskId/assign  body: { userId }
   - DELETE /api/assignments/:taskId/unassign
   - GET /api/assignments/user/:userId
   - GET /api/assignments/workload

3. Wire into src/index.js
4. Write tests in src/__tests__/assignment.test.js
5. Run all tests
```

> "Review the plan. Approve it. Let Agent Mode build it. Run `npm test` when done."
>
> *[Give 5 minutes]*
>
> "Who got it working? ... Agent Mode just built a full feature with service layer,
> routes, tests, and wiring -- in 5 minutes."

---

# SECTION 6: Live - Collaborative Coding Across Files (8 minutes)

## What to Say

> "Agent Mode isn't just for new features. It's for cross-cutting changes that touch
> many files at once. Let me show you, then you'll race the clock."

## WATCH ME: Multi-File Refactoring (3 minutes)

**Step 1**: Open Agent Mode (Shift+Cmd+I), type:

```
Refactor exercises/refactoring_challenge/callbackHell.js completely:
1. Convert ALL functions from callbacks to async/await with Promises
2. Replace var with const/let
3. Use descriptive variable names
4. Add error handling with try/catch
5. Add JSDoc comments
6. Keep the same functionality -- existing tests must pass
7. Run the tests after refactoring
```

> "This file has 130 lines of nested callbacks across 5 functions. Watch Agent Mode
> rewrite ALL of it while keeping every test green."

Narrate as it runs:

> "It's converting fetchUserData... now fetchUserTasks... wrapping setTimeout in
> a Promise... using async/await in generateUserReport... Promise.allSettled for the
> team report... running tests... all pass."

## YOUR TURN: Speed Challenge (5 minutes)

> "Now you race the clock. Open `exercises/speed_challenge/README.md` for the full
> requirements, but here's the short version: build a complete Notification System --
> model, routes, service, tests -- in 5 minutes."
>
> "Open Agent Mode, paste:"

```
Build a notification system for TaskMaster:
1. Create src/models/Notification.js (id, userId, type, message, taskId, read, createdAt; methods: create, getByUser, markAsRead, markAllAsRead, getUnreadCount)
2. Create src/services/notificationService.js (notifyAssignment, notifyOverdue, notifyCompletion, notifyMention)
3. Create src/routes/notificationRoutes.js (GET /:userId, GET /:userId/unread, PUT /:id/read, PUT /:userId/read-all, DELETE /:id)
4. Wire into src/index.js
5. Write tests in src/__tests__/notification.test.js
6. Run tests
```

> "Timer starts... NOW."
>
> *[Give 5 minutes]*
>
> "Time! Run `npm test`. Who got everything green? ... You just built an entire
> feature -- model, service, routes, tests, wiring -- across 5 files in 5 minutes.
> That's a half-day task done in a coffee break."

---

# SECTION 7: Power-Ups - Hooks, Custom Commands, MCP, Subagents (7 minutes)

## What to Say

> "Everything so far is daily workflow. Now let me show you the advanced features
> that let you customize Copilot for your team. These are the power-ups."

## 7A: Custom Prompt Files / Commands (2 minutes)

**Step 1**: Open `exercises/powerups_demo/.github/prompts/create-api-endpoint.prompt.md`

> "Prompt files are reusable templates stored in your repo. You write them once,
> your whole team uses them forever. They live in `.github/prompts/` as `.prompt.md` files."

Show the file contents:

> "This one is a template for creating API endpoints. It includes our conventions,
> the standard error format, the testing requirements -- everything we put in our
> custom instructions but tailored for a specific task."

**Step 2**: Show how to use it:

> "In Copilot Chat, you can invoke this with the `/` command picker or by referencing
> the file directly. It pre-fills all the context so your team doesn't have to write
> the same prompt every time."
>
> "Think of these as code snippets, but for AI prompts. Your team's 5 most common
> tasks should each have a prompt file."

**Step 3**: Show the test prompt file too:
`exercises/powerups_demo/.github/prompts/write-tests.prompt.md`

> "Another one for test generation. Same naming convention, same test structure,
> every time, for every developer."

## 7B: Hooks - Automated Quality Gates (1.5 minutes)

**Step 1**: Open `exercises/powerups_demo/.github/hooks/pre-commit-lint.sh`

> "Hooks are scripts that run automatically when Copilot takes certain actions.
> Think of them as git hooks, but for Copilot's actions."

Show the file:

> "This one runs ESLint on every file BEFORE Copilot commits it. If linting fails,
> the commit is blocked. Your team's code quality standards are enforced automatically,
> even when Copilot is writing the code."
>
> "You can hook into: preCommit, postCommit, preFileEdit, postFileEdit, and more.
> Configure them in `.vscode/settings.json`."
>
> "Real-world use cases: run formatters before commit, run security scans after file
> edits, notify Slack when Copilot opens a PR, auto-add labels to generated PRs."

## 7C: MCP Servers - Connect Copilot to External Tools (2 minutes)

**Step 1**: Open `exercises/powerups_demo/.vscode/mcp.json`

> "MCP -- Model Context Protocol -- lets Copilot talk to external tools.
> Databases, browsers, APIs, monitoring systems. This is how you give Copilot
> superpowers beyond just reading code."

Show the config:

> "Three servers configured here:"
>
> "**GitHub MCP** -- built in, zero config. Ask Copilot: 'What are the open issues
> assigned to me?' or 'Create an issue for this bug.' It talks directly to GitHub."
>
> "**Playwright MCP** -- browser automation. Ask Copilot: 'Navigate to our staging
> site, fill in the login form, click submit, take a screenshot.' It drives a real browser."
>
> "**Filesystem MCP** -- advanced file operations beyond what Copilot normally does."
>
> "Your team could add MCP servers for: your database (run queries via natural language),
> Sentry (pull error reports into context), Jira/Linear (create tickets from bugs),
> or any internal API. The ecosystem has hundreds of servers."

### QUICK DEMO (if time allows):
In Copilot Chat:
```
@github What are the open PRs in this repository?
```

> "That's the GitHub MCP server responding with live data."

## 7D: Custom Agents / Subagents (1.5 minutes)

**Step 1**: Open `exercises/custom_agents_demo/.github/agents/security-reviewer.agent.md`

> "Custom agents are specialized AI personas that know specific tools and domains.
> They live in `.github/agents/` as `.agent.md` files."

Show the file:

> "This one is a security reviewer. It knows OWASP Top 10, knows to check for
> SQL injection, XSS, hardcoded secrets. It has specific rules: always check for
> parameterized queries, flag eval() with user input, verify auth middleware."
>
> "When you invoke this agent, it ONLY focuses on security. It doesn't suggest
> code style changes or refactors. It's a specialist."

**Step 2**: Show the test generator agent:
`exercises/custom_agents_demo/.github/agents/test-generator.agent.md`

> "And this one only writes tests. It knows our Jest/Supertest patterns, our
> naming convention, our coverage requirements."
>
> "The key insight from GitHub's research: specific agents outperform general ones.
> Don't build one 'AI assistant.' Build a team of specialists -- a security reviewer,
> a test writer, a docs generator, a code reviewer -- each with focused expertise."
>
> "Subagents work the same way in Copilot CLI. When you give Agent Mode a complex task,
> it automatically delegates to specialized subagents: one for exploring the codebase,
> one for running tests, one for code review. You can define your own."

### ATTENDEE ACTION
> "After the workshop, look at these files and create one custom agent for your team's
> most common task. The community collection is at github.com/github/awesome-copilot."

---

# SECTION 8: Best Practices Cheat Sheet (3 minutes)

## What to Say

> "Before we close -- the cheat sheet. These are the rules that separate good
> Copilot users from great ones."

## The 5 Rules (1.5 minutes)

> "**Rule 1: Custom instructions in every repo.** Create `.github/copilot-instructions.md`.
> Your team's conventions, enforced on every Copilot request, automatically."
>
> "**Rule 2: /plan before you build.** For anything touching 2+ files, plan first.
> Review the plan. Then approve. Five seconds of planning saves five minutes of cleanup."
>
> "**Rule 3: Read everything Copilot generates.** Every suggestion is a code review.
> Use /explain on Copilot's OWN output if you don't understand it."
>
> "**Rule 4: Be specific.** Vague prompt = vague code. Specific prompt = production-ready
> code on the first try. The 3S framework: Specific, Short, Surrounding context."
>
> "**Rule 5: Use Copilot for code review.** Add it as a PR reviewer. It catches
> security issues, bugs, and style problems you'll miss at 4pm on a Friday."

## Keyboard Shortcuts to Memorize (30 seconds)

> "Five shortcuts. Memorize them this week."

```
Cmd+I / Ctrl+I           → Inline Chat (fastest way to edit code)
Ctrl+Cmd+I / Ctrl+Alt+I  → Chat Panel
Shift+Cmd+I / Ctrl+Shift+I → Agent Mode (autonomous multi-file)
Tab                       → Accept suggestion
Cmd+Alt+. / Ctrl+Alt+.   → Switch AI model
```

## Resources (1 minute)

> "I'll share these after:"

```
BOOKMARKS:
- VS Code Cheat Sheet: https://code.visualstudio.com/docs/copilot/reference/copilot-vscode-features
- Prompt Guide: https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering
- Custom Instructions: https://code.visualstudio.com/docs/copilot/customization/custom-instructions
- Best Practices: https://docs.github.com/en/copilot/get-started/best-practices
- Community Agents/Skills: https://github.com/github/awesome-copilot

FREE TRAINING:
- MS Learn Path: https://learn.microsoft.com/en-us/training/paths/copilot/
- 4-Week Bootcamp: https://github.com/Pwd9000-ML/GitHub-Copilot-Bootcamp
- Hands-on Labs: https://github.com/microsoft/github-copilot-workshops-labs
```

---

# SECTION 9: Q&A (2 minutes)

## What to Say

> "My challenge to you: this week, pick THREE things from today."
>
> 1. Create custom instructions in your real project
> 2. Use inline chat (Cmd+I) instead of manual editing
> 3. Add Copilot as a reviewer on your next PR
>
> "By Friday they'll be muscle memory."
>
> "Questions? ... Great. Go make your Mondays better."

---

# APPENDIX A: Answer Key (Bugs)

| Bug | File | Line | Fix |
|-----|------|------|-----|
| Off-by-one pagination | Task.js | ~61 | `(page - 1) * limit` |
| Case-sensitive search | Task.js | ~76-77 | `.toLowerCase()` on both sides |
| String date comparison | Task.js | ~86 | `new Date(a.dueDate) - new Date(b.dueDate)` |
| Division by zero | Task.js | ~104 | `total === 0 ? 0 : (completed / total) * 100` |
| Month off-by-one | dateHelpers.js | ~18 | `date.getMonth() + 1` |

# APPENDIX B: PR Review Demo - Issues in buggy_search_service.js

| # | Severity | Issue | Line |
|---|----------|-------|------|
| 1 | Critical | SQL injection via string interpolation | ~26 |
| 2 | Critical | eval() with user input | ~52 |
| 3 | Critical | Hardcoded API key | ~19 |
| 4 | High | Sensitive data (password, SSN) logged to console | ~39 |
| 5 | High | Internal state + API key leaked in error response | ~50 |
| 6 | High | Prototype pollution via Object.assign with user input | ~37 |
| 7 | Medium | Empty catch block swallows errors | ~30 |
| 8 | Medium | No input validation on any function | Multiple |

# APPENDIX C: Timing Flex Guide

### Running AHEAD:
- Add: Regex challenge (`exercises/regex_challenge/`) -- 4 minutes, high energy
- Add: Cross-language demo (`exercises/python_converter/task_api.py`) -- translate Python to Node.js
- Add: Live MCP demo with `@github` queries
- Expand: Speed challenge from 5 to 7 minutes

### Running BEHIND:
- Shorten: Section 4 (PR Review) to 5 min -- skip attendee pair exercise, just show the demo
- Shorten: Section 6 (Across Files) -- cut the speed challenge, just show the refactoring
- Shorten: Section 7 (Power-Ups) to 4 min -- show one example of each, skip details
- Cut: Section 8 to 1 min -- just show keyboard shortcuts

# APPENDIX D: Bonus Exercises (for attendees at home)

## Bonus 1: Regex Challenge
Open `exercises/regex_challenge/challenges.js` -- 6 regex challenges with automated tests.
Write comments describing the regex, let Copilot generate it, run `npm test -- --testPathPattern=regex`.

## Bonus 2: Cross-Language Translation
Open `exercises/python_converter/task_api.py`. Ask Copilot to translate the full Flask API to Express.

## Bonus 3: OpenAPI Spec Generation
```
@workspace Generate a complete OpenAPI 3.0.3 specification for all API endpoints.
Include request/response schemas, error codes, and example payloads.
```

## Bonus 4: Create Your Own Agent
Look at `exercises/custom_agents_demo/.github/agents/` and create one for your team.

## Bonus 5: Create Your Own Prompt File
Look at `exercises/powerups_demo/.github/prompts/` and create a reusable prompt for
your team's most common task.

# APPENDIX E: Complete File List

```
WORKSHOP-GUIDE.md                          -- This file (presenter script)
SETUP.md                                   -- Attendee setup instructions
exercises/
  EXERCISES.md                             -- Attendee handout (copy-paste prompts)
  pr_review_demo/
    buggy_search_service.js                -- 8 intentional security/code issues
    SETUP_PR_DEMO.sh                       -- Script to set up the PR before workshop
  regex_challenge/
    challenges.js                          -- 6 regex challenges (fill in the blank)
    challenges.test.js                     -- Automated test scoring
  refactoring_challenge/
    callbackHell.js                        -- 130 lines of nested callbacks
    callbackHell.test.js                   -- Tests that must keep passing
  speed_challenge/
    README.md                              -- 5-minute notification system race
  python_converter/
    task_api.py                            -- Python Flask API for translation exercise
  ui_mockup/
    mockup.html                            -- Dashboard for screenshot-to-code demo
  powerups_demo/
    .github/prompts/
      create-api-endpoint.prompt.md        -- Reusable prompt template
      write-tests.prompt.md                -- Reusable test generation template
    .github/hooks/
      pre-commit-lint.sh                   -- Auto-lint before Copilot commits
    .github/agents/
      security-reviewer.agent.md           -- Security specialist agent
      test-generator.agent.md              -- Test writing specialist agent
    .vscode/
      mcp.json                             -- MCP server configuration example
  custom_agents_demo/
    .github/agents/
      security-reviewer.agent.md           -- Same agent (alternate location)
      test-generator.agent.md              -- Same agent (alternate location)
src/
  index.js                                 -- Express app entry point
  models/Task.js                           -- Task model (5 intentional bugs)
  models/User.js                           -- User model (no validation)
  routes/taskRoutes.js                     -- Task CRUD endpoints
  routes/userRoutes.js                     -- User endpoints
  routes/analyticsRoutes.js                -- Incomplete (TODO stubs)
  services/legacyReportEngine.js           -- Cryptic legacy code for /explain demo
  middleware/validator.js                   -- Empty (built during exercises)
  middleware/rateLimiter.js                 -- Empty (bonus)
  utils/dateHelpers.js                     -- Date utils (has month bug)
  __tests__/task.test.js                   -- 5 starter tests
```
