// Utility functions for date operations

function isOverdue(dueDate) {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}

function daysUntilDue(dueDate) {
  if (!dueDate) return null;
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = due - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// BUG: This function doesn't handle timezone correctly
function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
  // Bug: getMonth() is 0-indexed, should be getMonth() + 1
}

module.exports = { isOverdue, daysUntilDue, formatDate };
