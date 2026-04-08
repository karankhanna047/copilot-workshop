# Demo Prompts -- Copy-Paste Cheat Sheet

> Keep this open in a separate editor tab during the workshop.
> Each section has the exact prompts to paste into Copilot Chat / Inline Chat / Agent Mode.

---

## Section 1: Setup & WOW Moment (5 min)

### 1.1 Screenshot-to-Code

1. Open `exercises/ui_mockup/mockup.html` in browser
2. Take screenshot (Cmd+Shift+4 / Win+Shift+S)
3. Open **Copilot Chat**, paste the screenshot, then type:

```
Generate a React component with Tailwind CSS that matches this dashboard.
Include the stats cards, task list, sprint progress, and team workload sections.
```

---

## Section 2: Project Context (5 min)

### 2.1 @workspace Demo

Paste in **Copilot Chat**:

```
@workspace Give me a summary of this project -- what does it do, what's the tech stack, and what are the main files? Also flag any bugs or issues you can find.
```

### 2.2 Custom Instructions

Create `.github/copilot-instructions.md` and paste:

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

### 2.3 Bad vs Good Prompt Example

Bad:
```
make the user route better
```

Good:
```
Add input validation to POST /api/users in src/routes/userRoutes.js:
1. name is required, non-empty string, max 100 chars
2. email is required, valid email format
3. role must be one of: "admin", "member", "viewer"
4. Return 400 with { "error": "specific message" } for each failure
```

---

## Section 3: Bug Investigation & Fix (10 min)

### 3.1 /explain Legacy Code

1. Open `src/services/legacyReportEngine.js`
2. Select ALL code
3. In **Copilot Chat**, type:

```
/explain
```

### 3.2 Fix Pagination Bug (WATCH ME demo)

1. Open `src/models/Task.js`
2. Select the `paginate` method (~line 60)
3. Press **Cmd+I** (Inline Chat), type:

```
Fix the pagination: page 1 should return the first 'limit' items. startIndex should be (page - 1) * limit for 1-based pagination.
```

### 3.3 Fix Case-Sensitive Search (ATTENDEE)

Select the `search` method (~line 75), press **Cmd+I**:

```
Search is case-sensitive. Fix: convert both query and field values to lowercase.
```

### 3.4 Fix Date Sorting (ATTENDEE)

Select `sortByDueDate` (~line 82), press **Cmd+I**:

```
String subtraction doesn't compare dates. Fix: wrap dueDate in new Date() before subtracting.
```

### 3.5 Fix Division by Zero (ATTENDEE)

Select `getStats` (~line 96), press **Cmd+I**:

```
Division by zero when no tasks. Fix: return 0 for completionRate when total is 0.
```

### 3.6 @terminal Debugging

After running `npm test`, paste in **Copilot Chat**:

```
@terminal Why did the last test fail and how do I fix it?
```

### 3.7 /fix Bonus

1. Open `src/utils/dateHelpers.js`
2. Select the `formatDate` function
3. In **Copilot Chat**, type:

```
/fix
```

---

## Section 4: Automated PR Review (10 min)

### 4.1 Add Copilot as PR Reviewer

In terminal (replace PR_NUMBER):

```bash
gh pr edit <PR_NUMBER> --add-reviewer copilot
```

### 4.2 View PR in Browser

```bash
gh pr view <PR_NUMBER> --web
```

### 4.3 Alternative: In-Editor Review

Select all code in `exercises/pr_review_demo/buggy_search_service.js`, paste in **Copilot Chat**:

```
Review this code as a senior security engineer. For each issue found, report:
1. Severity: Critical / High / Medium / Low
2. Line number
3. What's wrong
4. The exact code fix
Format as a numbered list.
```

---

## Section 5: Plan, Approve & Build (10 min)

### 5.1 /plan Analytics Endpoints (WATCH ME)

Paste in **Copilot Chat**:

```
/plan Implement the two incomplete analytics endpoints in src/routes/analyticsRoutes.js:

1. GET /api/analytics/productivity should return:
   - averageCompletionTime: avg hours from createdAt to completedAt for done tasks
   - tasksCompletedThisWeek: count of tasks completed in last 7 days
   - priorityDistribution: { low: count, medium: count, high: count }
   - topAssignees: top 3 assignees by completed task count
   - add UI support in React dashboard with all of this info + filters for team and date range


2. GET /api/analytics/overdue should return:
   - overdueByAssignee: object keyed by assignee, each with overdue tasks + daysOverdue
   - totalOverdue: total count
   - mostOverdue: single most overdue task
   - Add UI support in React dashboard with filters for team and priority

Also write tests in src/__tests__/analytics.test.js.
```

After reviewing the plan, switch to **Agent Mode** and type:

```
Looks good, implement it.
```

### 5.2 Assignment System (ATTENDEE)

Paste in **Agent Mode** (Shift+Cmd+I):

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

---

## Section 6: Collaborative Coding (8 min)

### 6.1 Refactoring Callback Hell (WATCH ME)

Paste in **Agent Mode** (Shift+Cmd+I):

```
Refactor exercises/refactoring_challenge/callbackHell.js completely:
1. Convert ALL functions from callbacks to async/await with Promises
2. Replace var with const/let
3. Replace single-letter variable names with descriptive names
4. Add error handling with try/catch
5. Add JSDoc comments
6. Keep the same functionality -- existing tests must pass
7. Run the tests after refactoring
```

### 6.2 Speed Challenge: Notification System (ATTENDEE)

Paste in **Agent Mode** (Shift+Cmd+I):

```
Build a notification system for TaskMaster:
1. Create src/models/Notification.js (id, userId, type, message, taskId, read, createdAt; methods: create, getByUser, markAsRead, markAllAsRead, getUnreadCount)
2. Create src/services/notificationService.js (notifyAssignment, notifyOverdue, notifyCompletion, notifyMention)
3. Create src/routes/notificationRoutes.js (GET /:userId, GET /:userId/unread, PUT /:id/read, PUT /:userId/read-all, DELETE /:id)
4. Wire into src/index.js
5. Write tests in src/__tests__/notification.test.js
6. Run tests
```

---

## Section 7: Power-Ups (7 min)

### 7.1 Files to Open (just show, no prompts needed)

- Prompt files: `exercises/powerups_demo/.github/prompts/create-api-endpoint.prompt.md`
- Prompt files: `exercises/powerups_demo/.github/prompts/write-tests.prompt.md`
- Hooks: `exercises/powerups_demo/.github/hooks/pre-commit-lint.sh`
- MCP config: `exercises/powerups_demo/.vscode/mcp.json`
- Custom agent: `exercises/custom_agents_demo/.github/agents/security-reviewer.agent.md`
- Custom agent: `exercises/custom_agents_demo/.github/agents/test-generator.agent.md`

### 7.2 Quick MCP Demo (if time)

Paste in **Copilot Chat**:

```
@github What are the open PRs in this repository?
```

---

## Section 8: Best Practices (3 min)

### Keyboard Shortcuts to Show

```
Cmd+I / Ctrl+I             --> Inline Chat (fastest edits)
Ctrl+Cmd+I / Ctrl+Alt+I    --> Chat Panel (Q&A, exploration)
Shift+Cmd+I / Ctrl+Shift+I --> Agent Mode (autonomous multi-file)
Tab                         --> Accept suggestion
Cmd+Alt+. / Ctrl+Alt+.     --> Switch AI model
```

### Resources to Share

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

## Section 9: Q&A (2 min)

### Weekly Challenge (say out loud)

> Pick THREE things from today and use them this week:
> 1. Create `.github/copilot-instructions.md` in your real project
> 2. Use inline chat (Cmd+I) for your next bug fix
> 3. Add Copilot as a reviewer on your next PR

---

## React UI Demo (Optional -- show anytime)

If you want to show the React UI during the workshop:

```bash
# Terminal 1 -- backend
npm run seed && npm run dev

# Terminal 2 -- React UI
npm run client:dev
```

Open http://localhost:5173 and show:
- **Dashboard**: Stats, recent tasks, team workload
- **Tasks**: Paginated list (shows pagination bug), search (shows case-sensitivity bug)
- **Workshop Health**: Click "Run All Tests" to show which bugs are fixed/broken
