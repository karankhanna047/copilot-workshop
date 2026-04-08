# Speed Challenge: Build a Complete Feature in 10 Minutes

## The Challenge

Build a **Notification System** for the TaskMaster API.

You have 10 minutes. Use EVERY Copilot feature you learned today.

## Requirements

### 1. Notification Model (`src/models/Notification.js`)
- Fields: id, userId, type, message, taskId, read, createdAt
- Types: "task_assigned", "task_overdue", "task_completed", "mention"
- Methods: create, getByUser, markAsRead, markAllAsRead, getUnreadCount

### 2. Notification Routes (`src/routes/notificationRoutes.js`)
- GET /api/notifications/:userId - Get all notifications for a user
- GET /api/notifications/:userId/unread - Get unread count
- PUT /api/notifications/:id/read - Mark one as read
- PUT /api/notifications/:userId/read-all - Mark all as read
- DELETE /api/notifications/:id - Delete a notification

### 3. Notification Service (`src/services/notificationService.js`)
- notifyAssignment(taskId, userId) - When a task is assigned
- notifyOverdue(taskId) - When a task becomes overdue
- notifyCompletion(taskId, assignee) - When a task is completed
- notifyMention(taskId, mentionedUserId, mentionerName) - When someone is @mentioned

### 4. Tests (`src/__tests__/notification.test.js`)
- Test all CRUD operations
- Test notification creation for each type
- Test marking as read

### 5. Wire It Up
- Add routes to `src/index.js`

## Scoring

- Model created and working: 2 points
- Routes created and working: 2 points
- Service created and working: 2 points
- Tests written and passing: 2 points
- Wired into index.js: 1 point
- Finished within 10 minutes: 1 point

## Recommended Approach

1. Start with `/plan` to get a plan (30 seconds)
2. Use Agent Mode to implement the plan (8 minutes)
3. Run `npm test` to verify (1 minute)
4. Fix any issues Agent Mode missed (30 seconds)

## How to Start

Open Agent Mode (Shift+Cmd+I / Ctrl+Shift+I) and paste:

```
/plan Build a notification system for the TaskMaster API:

1. Create src/models/Notification.js with: id, userId, type (task_assigned/task_overdue/task_completed/mention), message, taskId, read (boolean), createdAt. Methods: create, getByUser, markAsRead, markAllAsRead, getUnreadCount. Use in-memory array storage like the Task model.

2. Create src/services/notificationService.js with functions: notifyAssignment(taskId, userId), notifyOverdue(taskId), notifyCompletion(taskId, assignee), notifyMention(taskId, mentionedUserId, mentionerName). Each function should create a Notification with appropriate type and message.

3. Create src/routes/notificationRoutes.js with: GET /:userId, GET /:userId/unread, PUT /:id/read, PUT /:userId/read-all, DELETE /:id

4. Wire routes into src/index.js

5. Create src/__tests__/notification.test.js with full test coverage

6. Run the tests to make sure they pass
```

Then review the plan and say "Implement it".

## Timer

Start your timer NOW. Go!
