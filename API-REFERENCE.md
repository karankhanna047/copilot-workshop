# TaskMaster API Reference

## Quick Start

```bash
# Start server with dummy data (15 tasks, 5 users)
node src/seed.js

# Or start empty server
npm start
```

Server runs on `http://localhost:3000`

---

## Health Check

```bash
curl http://localhost:3000/health
```
```json
{"status":"ok","timestamp":"2026-04-07T12:33:47.143Z"}
```

---

## Tasks

### Create a Task

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Fix login bug",
    "description": "Users cannot login on mobile",
    "priority": "high",
    "assignee": "alice",
    "dueDate": "2026-05-01",
    "tags": ["bug", "urgent"]
  }'
```
**Response** `201 Created`
```json
{
  "id": "a1b2c3d4-...",
  "title": "Fix login bug",
  "description": "Users cannot login on mobile",
  "priority": "high",
  "status": "todo",
  "assignee": "alice",
  "dueDate": "2026-05-01",
  "tags": ["bug", "urgent"],
  "createdAt": "2026-04-07T12:33:58.433Z",
  "updatedAt": "2026-04-07T12:33:58.433Z",
  "completedAt": null
}
```

### Create Task - Validation Error

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"description": "missing title"}'
```
**Response** `400 Bad Request`
```json
{"error":"Title is required"}
```

### Get All Tasks

```bash
curl http://localhost:3000/api/tasks
```
**Response** `200 OK` — Array of all tasks

### Get Task by ID

```bash
# Replace <TASK_ID> with an actual ID from the create response
curl http://localhost:3000/api/tasks/<TASK_ID>
```
**Response** `200 OK` — Single task object

### Get Task - Not Found

```bash
curl http://localhost:3000/api/tasks/nonexistent-id
```
**Response** `404 Not Found`
```json
{"error":"Task not found"}
```

### Update a Task

```bash
curl -X PUT http://localhost:3000/api/tasks/<TASK_ID> \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in-progress",
    "priority": "high"
  }'
```
**Response** `200 OK` — Updated task object

### Mark Task as Done

```bash
curl -X PUT http://localhost:3000/api/tasks/<TASK_ID> \
  -H "Content-Type: application/json" \
  -d '{"status": "done"}'
```
**Response** `200 OK` — Task with `completedAt` timestamp set

### Delete a Task

```bash
curl -X DELETE http://localhost:3000/api/tasks/<TASK_ID>
```
**Response** `204 No Content`

### Paginate Tasks

```bash
# Page 1, 3 tasks per page
curl "http://localhost:3000/api/tasks?page=1&limit=3"
```
**Response** `200 OK`
```json
{
  "tasks": [...],
  "total": 15,
  "page": 1,
  "limit": 3,
  "totalPages": 5
}
```
> **Known Bug**: Page 1 skips the first `limit` items (off-by-one error). Attendees fix this in the workshop.

### Search Tasks

```bash
curl "http://localhost:3000/api/tasks/search?q=login"
```
**Response** `200 OK` — Array of matching tasks

> **Known Bug**: Search is case-sensitive. Searching "Login" won't find "login". Attendees fix this.

### Search - Missing Query

```bash
curl "http://localhost:3000/api/tasks/search"
```
**Response** `400 Bad Request`
```json
{"error":"Search query is required"}
```

### Get Task Stats

```bash
curl http://localhost:3000/api/tasks/stats
```
**Response** `200 OK`
```json
{
  "total": 15,
  "completed": 3,
  "inProgress": 2,
  "todo": 10,
  "overdue": 3,
  "completionRate": 20
}
```
> **Known Bug**: Returns `NaN` for `completionRate` when there are zero tasks (division by zero). Attendees fix this.

### Sort Tasks by Due Date

```bash
curl http://localhost:3000/api/tasks/sorted
```
**Response** `200 OK` — Array sorted by due date (tasks without dates last)

> **Known Bug**: Date comparison uses string subtraction instead of Date objects. Attendees fix this.

---

## Users

### Create a User

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Kim",
    "email": "alice@company.com",
    "role": "admin"
  }'
```
**Response** `201 Created`
```json
{
  "id": "e5f6g7h8-...",
  "name": "Alice Kim",
  "email": "alice@company.com",
  "role": "admin",
  "createdAt": "2026-04-07T12:34:23.975Z"
}
```

> **Note**: No input validation on this endpoint. Attendees add validation during the workshop.

### Get All Users

```bash
curl http://localhost:3000/api/users
```
**Response** `200 OK` — Array of all users

### Get User by ID

```bash
curl http://localhost:3000/api/users/<USER_ID>
```
**Response** `200 OK` — Single user object

### Delete a User

```bash
curl -X DELETE http://localhost:3000/api/users/<USER_ID>
```
**Response** `204 No Content`

---

## Analytics (Not Implemented)

These endpoints return placeholder responses. Attendees implement them during Section 5 of the workshop.

### Productivity Report

```bash
curl http://localhost:3000/api/analytics/productivity
```
**Response** `200 OK`
```json
{"message":"Not implemented yet"}
```

**Expected (after implementation)**:
```json
{
  "averageCompletionTime": 48.5,
  "tasksCompletedThisWeek": 2,
  "priorityDistribution": {"low": 4, "medium": 5, "high": 6},
  "topAssignees": [
    {"assignee": "alice", "completed": 3},
    {"assignee": "carol", "completed": 2},
    {"assignee": "bob", "completed": 1}
  ]
}
```

### Overdue Report

```bash
curl http://localhost:3000/api/analytics/overdue
```
**Response** `200 OK`
```json
{"message":"Not implemented yet"}
```

**Expected (after implementation)**:
```json
{
  "overdueByAssignee": {
    "alice": [{"title": "Fix auth timeout", "daysOverdue": 5}],
    "bob": [{"title": "Resolve DB pool", "daysOverdue": 3}],
    "carol": [{"title": "Update payment SDK", "daysOverdue": 10}]
  },
  "totalOverdue": 3,
  "mostOverdue": {"title": "Update payment SDK", "daysOverdue": 10}
}
```

---

## Quick Test Script

Run all endpoints in sequence to verify everything works:

```bash
# Start server with seed data
node src/seed.js &
sleep 2

echo "=== Health ==="
curl -s http://localhost:3000/health

echo -e "\n\n=== All Tasks ==="
curl -s http://localhost:3000/api/tasks | head -c 200

echo -e "\n\n=== Stats ==="
curl -s http://localhost:3000/api/tasks/stats

echo -e "\n\n=== Search 'auth' ==="
curl -s "http://localhost:3000/api/tasks/search?q=auth"

echo -e "\n\n=== Paginate (page 1, limit 3) ==="
curl -s "http://localhost:3000/api/tasks?page=1&limit=3" | head -c 200

echo -e "\n\n=== Sorted by due date ==="
curl -s http://localhost:3000/api/tasks/sorted | head -c 200

echo -e "\n\n=== All Users ==="
curl -s http://localhost:3000/api/users

echo -e "\n\n=== Create new task ==="
curl -s -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New task from curl","priority":"medium"}'

echo -e "\n\n=== Create new user ==="
curl -s -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","role":"member"}'

echo -e "\n\n=== Analytics (not implemented) ==="
curl -s http://localhost:3000/api/analytics/productivity
curl -s http://localhost:3000/api/analytics/overdue

echo -e "\n\n=== Error cases ==="
curl -s -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" -d '{}'
curl -s http://localhost:3000/api/tasks/nonexistent
curl -s http://localhost:3000/api/tasks/search

# Stop server
kill %1 2>/dev/null
echo -e "\n\nDone!"
```

---

## Endpoints Built During Workshop

These endpoints DON'T EXIST yet. Attendees build them using Copilot:

| Endpoint | Built In |
|---|---|
| `POST /api/assignments/:taskId/assign` | Section 5 |
| `DELETE /api/assignments/:taskId/unassign` | Section 5 |
| `GET /api/assignments/user/:userId` | Section 5 |
| `GET /api/assignments/workload` | Section 5 |
| `GET /api/notifications/:userId` | Section 6 (speed challenge) |
| `GET /api/notifications/:userId/unread` | Section 6 (speed challenge) |
| `PUT /api/notifications/:id/read` | Section 6 (speed challenge) |
| `PUT /api/notifications/:userId/read-all` | Section 6 (speed challenge) |
| `DELETE /api/notifications/:id` | Section 6 (speed challenge) |

---

## Known Bugs (Workshop Exercise Material)

| Bug | Endpoint | What's Wrong |
|---|---|---|
| Off-by-one pagination | `GET /api/tasks?page=1&limit=2` | Page 1 skips first items |
| Case-sensitive search | `GET /api/tasks/search?q=Login` | Won't find "login" |
| Date sort broken | `GET /api/tasks/sorted` | String comparison instead of Date |
| Division by zero | `GET /api/tasks/stats` | NaN when 0 tasks |
| Month off-by-one | `dateHelpers.formatDate()` | January shows as month 0 |
| No user validation | `POST /api/users` | Accepts empty body |
