/**
 * REFACTORING CHALLENGE: Callback Hell to Async/Await
 *
 * This file simulates a real-world scenario: a data pipeline
 * written years ago using nested callbacks. It works, but
 * it's unmaintainable.
 *
 * EXERCISE:
 * 1. Select ALL the code in this file
 * 2. Open Copilot Chat and ask:
 *    "Refactor this entire file from callback-based code to modern
 *     async/await. Maintain the same functionality. Add proper error
 *     handling with try/catch. Use descriptive variable names.
 *     Add JSDoc comments to each function."
 * 3. Compare the before and after
 * 4. Run the test file to verify it still works
 */

function fetchUserData(userId, callback) {
  setTimeout(function() {
    if (!userId) {
      callback(new Error('User ID required'), null);
      return;
    }
    var users = {
      'u1': { id: 'u1', name: 'Alice', department: 'Engineering' },
      'u2': { id: 'u2', name: 'Bob', department: 'Marketing' },
      'u3': { id: 'u3', name: 'Carol', department: 'Engineering' },
    };
    var user = users[userId];
    if (!user) {
      callback(new Error('User not found'), null);
      return;
    }
    callback(null, user);
  }, 100);
}

function fetchUserTasks(userId, callback) {
  setTimeout(function() {
    var allTasks = [
      { id: 't1', userId: 'u1', title: 'Deploy v2.0', status: 'done', hours: 8 },
      { id: 't2', userId: 'u1', title: 'Write tests', status: 'done', hours: 4 },
      { id: 't3', userId: 'u1', title: 'Code review', status: 'in-progress', hours: 2 },
      { id: 't4', userId: 'u2', title: 'Campaign launch', status: 'done', hours: 12 },
      { id: 't5', userId: 'u2', title: 'Analytics report', status: 'todo', hours: 6 },
      { id: 't6', userId: 'u3', title: 'API redesign', status: 'in-progress', hours: 20 },
      { id: 't7', userId: 'u3', title: 'Onboard intern', status: 'done', hours: 3 },
    ];
    var tasks = allTasks.filter(function(t) { return t.userId === userId; });
    callback(null, tasks);
  }, 100);
}

function fetchDepartmentBudget(department, callback) {
  setTimeout(function() {
    var budgets = {
      'Engineering': { total: 50000, spent: 32000 },
      'Marketing': { total: 30000, spent: 28000 },
    };
    var budget = budgets[department];
    if (!budget) {
      callback(new Error('Department not found'), null);
      return;
    }
    callback(null, budget);
  }, 100);
}

function generateUserReport(userId, callback) {
  fetchUserData(userId, function(err, user) {
    if (err) {
      callback(err, null);
      return;
    }
    fetchUserTasks(userId, function(err, tasks) {
      if (err) {
        callback(err, null);
        return;
      }
      fetchDepartmentBudget(user.department, function(err, budget) {
        if (err) {
          callback(err, null);
          return;
        }
        var completedTasks = tasks.filter(function(t) { return t.status === 'done'; });
        var totalHours = tasks.reduce(function(sum, t) { return sum + t.hours; }, 0);
        var completedHours = completedTasks.reduce(function(sum, t) { return sum + t.hours; }, 0);

        var report = {
          user: user,
          taskSummary: {
            total: tasks.length,
            completed: completedTasks.length,
            inProgress: tasks.filter(function(t) { return t.status === 'in-progress'; }).length,
            todo: tasks.filter(function(t) { return t.status === 'todo'; }).length,
          },
          hours: {
            total: totalHours,
            completed: completedHours,
            remaining: totalHours - completedHours,
          },
          department: {
            name: user.department,
            budgetTotal: budget.total,
            budgetSpent: budget.spent,
            budgetRemaining: budget.total - budget.spent,
            utilizationRate: ((budget.spent / budget.total) * 100).toFixed(1) + '%',
          },
          generatedAt: new Date().toISOString(),
        };

        callback(null, report);
      });
    });
  });
}

function generateTeamReport(userIds, callback) {
  var reports = [];
  var errors = [];
  var completed = 0;

  if (userIds.length === 0) {
    callback(null, { reports: [], summary: {} });
    return;
  }

  userIds.forEach(function(userId) {
    generateUserReport(userId, function(err, report) {
      completed++;
      if (err) {
        errors.push({ userId: userId, error: err.message });
      } else {
        reports.push(report);
      }

      if (completed === userIds.length) {
        var totalTasks = reports.reduce(function(sum, r) { return sum + r.taskSummary.total; }, 0);
        var totalCompleted = reports.reduce(function(sum, r) { return sum + r.taskSummary.completed; }, 0);
        var totalHours = reports.reduce(function(sum, r) { return sum + r.hours.total; }, 0);

        callback(null, {
          reports: reports,
          errors: errors,
          summary: {
            teamSize: reports.length,
            totalTasks: totalTasks,
            totalCompleted: totalCompleted,
            completionRate: totalTasks > 0 ? ((totalCompleted / totalTasks) * 100).toFixed(1) + '%' : '0%',
            totalHours: totalHours,
          },
        });
      }
    });
  });
}

module.exports = {
  fetchUserData,
  fetchUserTasks,
  fetchDepartmentBudget,
  generateUserReport,
  generateTeamReport,
};
