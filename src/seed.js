/**
 * Seed script - Populates the API with realistic dummy data.
 *
 * Usage:
 *   node src/seed.js
 *
 * This starts the server, creates 15 tasks and 5 users,
 * then prints a summary. Server stays running on port 3000
 * so you can test the API immediately after.
 */

const app = require('./index');
const Task = require('./models/Task');
const User = require('./models/User');

const PORT = process.env.PORT || 3000;

// --- Users ---
const users = [
  { name: 'Alice Kim', email: 'alice@company.com', role: 'admin' },
  { name: 'Bob Johnson', email: 'bob@company.com', role: 'member' },
  { name: 'Carol Smith', email: 'carol@company.com', role: 'member' },
  { name: 'David Lee', email: 'david@company.com', role: 'member' },
  { name: 'Eva Martinez', email: 'eva@company.com', role: 'viewer' },
];

// --- Tasks ---
const now = new Date();
const daysAgo = (d) => new Date(now.getTime() - d * 86400000).toISOString().split('T')[0];
const daysFromNow = (d) => new Date(now.getTime() + d * 86400000).toISOString().split('T')[0];

const tasks = [
  // Overdue tasks
  { title: 'Fix authentication timeout on mobile', description: 'Users are getting logged out after 30 seconds on iOS Safari. Need to investigate token refresh logic.', priority: 'high', assignee: 'alice', dueDate: daysAgo(5), tags: ['bug', 'mobile', 'auth'] },
  { title: 'Resolve database connection pool exhaustion', description: 'Production DB connections hitting max pool size during peak traffic. Connections not being released properly.', priority: 'high', assignee: 'bob', dueDate: daysAgo(3), tags: ['bug', 'database', 'production'] },
  { title: 'Update payment gateway SDK', description: 'Current Stripe SDK version has known security vulnerability CVE-2025-1234. Needs immediate upgrade.', priority: 'high', assignee: 'carol', dueDate: daysAgo(10), tags: ['security', 'payments', 'urgent'] },

  // Due soon
  { title: 'Add rate limiting to public API', description: 'No rate limiting on /api/public endpoints. Need to add IP-based throttling with configurable limits.', priority: 'high', assignee: 'alice', dueDate: daysFromNow(2), tags: ['security', 'api'] },
  { title: 'Write unit tests for user service', description: 'User service has 0% test coverage. Need tests for signup, login, password reset, and profile update flows.', priority: 'medium', assignee: 'david', dueDate: daysFromNow(5), tags: ['testing', 'backend'] },
  { title: 'Implement dark mode toggle', description: 'Add dark/light theme switch in settings. Store preference in localStorage. Apply to all components.', priority: 'medium', assignee: 'eva', dueDate: daysFromNow(7), tags: ['feature', 'frontend', 'ui'] },

  // Future tasks
  { title: 'Migrate from REST to GraphQL', description: 'Evaluate and plan migration of top 5 most-used endpoints from REST to GraphQL. Start with read-only queries.', priority: 'low', assignee: 'bob', dueDate: daysFromNow(30), tags: ['architecture', 'api'] },
  { title: 'Set up CI/CD pipeline with GitHub Actions', description: 'Create workflows for lint, test, build, and deploy. Include staging and production environments.', priority: 'medium', assignee: 'carol', dueDate: daysFromNow(14), tags: ['devops', 'ci-cd'] },
  { title: 'Add search autocomplete to dashboard', description: 'Implement debounced search with typeahead suggestions. Use existing search API. Show recent searches.', priority: 'low', assignee: 'eva', dueDate: daysFromNow(21), tags: ['feature', 'frontend'] },
  { title: 'Refactor error handling middleware', description: 'Current error handler returns generic 500 for everything. Need structured error classes with proper status codes.', priority: 'medium', assignee: 'alice', dueDate: daysFromNow(10), tags: ['refactor', 'backend'] },

  // Tasks without due dates
  { title: 'Document API endpoints with OpenAPI spec', description: 'Create OpenAPI 3.0 specification for all endpoints. Include request/response schemas and examples.', priority: 'low', assignee: 'david', tags: ['docs', 'api'] },
  { title: 'Research caching strategy for dashboard', description: 'Evaluate Redis vs in-memory caching for dashboard widgets. Benchmark response times.', priority: 'low', assignee: 'bob', tags: ['research', 'performance'] },

  // Completed tasks
  { title: 'Set up project scaffolding', description: 'Initialize Express app with middleware, routes, models, and test framework.', priority: 'high', assignee: 'alice', dueDate: daysAgo(20), tags: ['setup'] },
  { title: 'Create user authentication flow', description: 'Implement signup, login, logout with JWT tokens and refresh tokens.', priority: 'high', assignee: 'carol', dueDate: daysAgo(15), tags: ['feature', 'auth'] },
  { title: 'Design database schema', description: 'Define tables for users, tasks, notifications, and audit logs. Create ER diagram.', priority: 'high', assignee: 'bob', dueDate: daysAgo(18), tags: ['database', 'design'] },
];

function seed() {
  // Create users
  const createdUsers = users.map(u => User.create(u));

  // Create tasks
  const createdTasks = tasks.map(t => Task.create(t));

  // Mark last 3 tasks as done (completed tasks)
  for (let i = createdTasks.length - 3; i < createdTasks.length; i++) {
    Task.update(createdTasks[i].id, {
      status: 'done',
      completedAt: daysAgo(Math.floor(Math.random() * 10) + 1),
    });
  }

  // Mark 2 tasks as in-progress
  Task.update(createdTasks[3].id, { status: 'in-progress' });
  Task.update(createdTasks[4].id, { status: 'in-progress' });

  return { users: createdUsers, tasks: createdTasks };
}

// Run
const { users: seededUsers, tasks: seededTasks } = seed();

console.log('\n--- Seed Data Loaded ---');
console.log(`Users:  ${seededUsers.length}`);
console.log(`Tasks:  ${seededTasks.length}`);
console.log(`  todo:        ${Task.getAll().filter(t => t.status === 'todo').length}`);
console.log(`  in-progress: ${Task.getAll().filter(t => t.status === 'in-progress').length}`);
console.log(`  done:        ${Task.getAll().filter(t => t.status === 'done').length}`);

const overdue = Task.getAll().filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'done');
console.log(`  overdue:     ${overdue.length}`);
console.log('\nServer running on http://localhost:3000');
console.log('Try: curl http://localhost:3000/api/tasks | jq');
console.log('Try: curl http://localhost:3000/api/tasks/stats');
console.log('Try: curl http://localhost:3000/api/users\n');

if (require.main === module) {
  const server = app.listen(PORT, () => {});
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${PORT} is already in use. Kill it first:`);
      console.log(`  lsof -ti:${PORT} | xargs kill -9`);
      console.log(`Or use a different port:`);
      console.log(`  PORT=3001 npm run seed`);
      process.exit(1);
    }
    throw err;
  });
}

module.exports = { seed };
