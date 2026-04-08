# Workshop Exercises - Attendee Handout

Keep this open. Copy prompts from here.

---

## Keyboard Shortcuts (Memorize These)

| Action | Mac | Windows/Linux |
|--------|-----|---------------|
| **Inline Chat** (edit in place) | **Cmd+I** | **Ctrl+I** |
| Chat Panel | Ctrl+Cmd+I | Ctrl+Alt+I |
| **Agent Mode** (autonomous) | **Shift+Cmd+I** | **Ctrl+Shift+I** |
| Accept suggestion | Tab | Tab |
| Dismiss | Escape | Escape |
| Switch AI model | Cmd+Alt+. | Ctrl+Alt+. |

---

## Section 2: Project Context

### Create custom instructions
```bash
mkdir -p .github
```

Create `.github/copilot-instructions.md`:
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

### Test it works
```
@workspace Give me a summary of this project -- what does it do, what's the
tech stack, and what are the main files? Also flag any bugs or issues you find.
```

---

## Section 3: Bug Investigation & Fix

### Step 1: Understand legacy code
Open `src/services/legacyReportEngine.js`, select all, then:
```
/explain
```

### Step 2: Fix bugs with inline chat (Cmd+I / Ctrl+I)

Open `src/models/Task.js`. Select each method, press **Cmd+I**:

**Bug 1 - Pagination (~line 60):**
```
Fix pagination: startIndex should be (page - 1) * limit for 1-based pagination.
```

**Bug 2 - Case-sensitive search (~line 75):**
```
Search is case-sensitive. Fix: convert both query and field values to lowercase.
```

**Bug 3 - Date sorting (~line 82):**
```
String subtraction doesn't compare dates. Fix: wrap dueDate in new Date() before subtracting.
```

**Bug 4 - Division by zero (~line 96):**
```
Division by zero when no tasks. Fix: return 0 for completionRate when total is 0.
```

### Verify:
```bash
npm test
```

### Bonus: Auto-fix
Open `src/utils/dateHelpers.js`, select `formatDate`, type `/fix` in chat.

### Debug test failures
```
@terminal Why did the last test fail and how do I fix it?
```

---

## Section 4: PR Review

### Review buggy code with Copilot
Open `exercises/pr_review_demo/buggy_search_service.js`, select ALL, in Chat:
```
Review this code as a senior security engineer. For each issue found, report:
1. Severity: Critical / High / Medium / Low
2. Line number
3. What's wrong
4. The exact code fix
Format as a numbered list.
```

### Via gh CLI (if you have it):
```bash
gh pr edit <PR_NUMBER> --add-reviewer copilot
```

---

## Section 5: Plan, Approve & Build

### Step 1: Plan (in Chat or Agent Mode)
```
/plan Add a complete task assignment system:

1. Create src/services/taskAssignment.js with:
   - assignTask(taskId, userId) - assigns user to task, validates both exist
   - unassignTask(taskId) - removes assignment
   - getTasksByAssignee(userId) - returns all tasks for a user
   - getWorkload() - returns { userId, name, taskCount, completedCount } sorted desc

2. Create src/routes/assignmentRoutes.js with:
   - POST /api/assignments/:taskId/assign  body: { userId }
   - DELETE /api/assignments/:taskId/unassign
   - GET /api/assignments/user/:userId
   - GET /api/assignments/workload

3. Wire into src/index.js
4. Write tests in src/__tests__/assignment.test.js
5. Run all tests
```

### Step 2: Review the plan
### Step 3: Say "Looks good, implement it"
### Step 4: Verify
```bash
npm test
```

---

## Section 6: Collaborative Coding Across Files

### Speed Challenge (5 minutes)
Open Agent Mode (**Shift+Cmd+I**), paste:
```
Build a notification system for TaskMaster:
1. Create src/models/Notification.js (id, userId, type, message, taskId, read, createdAt; methods: create, getByUser, markAsRead, markAllAsRead, getUnreadCount)
2. Create src/services/notificationService.js (notifyAssignment, notifyOverdue, notifyCompletion, notifyMention)
3. Create src/routes/notificationRoutes.js (GET /:userId, GET /:userId/unread, PUT /:id/read, PUT /:userId/read-all, DELETE /:id)
4. Wire into src/index.js
5. Write tests in src/__tests__/notification.test.js
6. Run tests
```

Verify:
```bash
npm test
```

---

## Section 7: Power-Ups Reference

### Prompt Files
Location: `.github/prompts/*.prompt.md`
See examples in: `exercises/powerups_demo/.github/prompts/`

### Hooks
Location: `.github/hooks/`
See example in: `exercises/powerups_demo/.github/hooks/pre-commit-lint.sh`

### MCP Servers
Location: `.vscode/mcp.json`
See example in: `exercises/powerups_demo/.vscode/mcp.json`

### Custom Agents
Location: `.github/agents/*.agent.md`
See examples in: `exercises/custom_agents_demo/.github/agents/`
Community collection: https://github.com/github/awesome-copilot

---

## Bonus Exercises (At Home)

### Regex Challenge
Open `exercises/regex_challenge/challenges.js` -- 6 challenges with tests.
```bash
npm test -- --testPathPattern=regex
```

### Cross-Language Translation
Open `exercises/python_converter/task_api.py`:
```
Translate this Python Flask API to idiomatic Node.js Express code.
Preserve the same endpoints, validation, filtering, and pagination.
```

### OpenAPI Spec
```
@workspace Generate a complete OpenAPI 3.0.3 specification for all API endpoints.
Include request/response schemas, error codes, and example payloads.
```

---

## Chat Quick Reference

| Prefix | Example | What It Does |
|--------|---------|-------------|
| `@workspace` | `@workspace how does auth work?` | Searches entire codebase |
| `@terminal` | `@terminal why did it fail?` | Reads terminal output |
| `@github` | `@github open issues assigned to me?` | Queries GitHub (MCP) |
| `#file` | `#file:src/models/Task.js` | Adds file as context |
| `#selection` | Select code, then `#selection` | References highlighted code |
| `/explain` | Select code, `/explain` | Explains code |
| `/tests` | Select code, `/tests` | Generates tests |
| `/fix` | Select code, `/fix` | Auto-fixes issues |
| `/doc` | Select code, `/doc` | Generates docs |
| `/plan` | `/plan build a feature...` | Creates implementation plan |
