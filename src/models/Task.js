const { v4: uuidv4 } = require('uuid');

// In-memory storage (simulates a database)
const tasks = [];

class Task {
  constructor({ title, description, priority, assignee, dueDate, tags }) {
    this.id = uuidv4();
    this.title = title;
    this.description = description || '';
    this.priority = priority || 'medium';
    this.status = 'todo';
    this.assignee = assignee || null;
    this.dueDate = dueDate || null;
    this.tags = tags || [];
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    this.completedAt = null;
  }

  static getAll() {
    return tasks;
  }

  static getById(id) {
    return tasks.find(t => t.id === id);
  }

  static create(data) {
    const task = new Task(data);
    tasks.push(task);
    return task;
  }

  static update(id, updates) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    tasks[index] = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    if (updates.status === 'done') {
      tasks[index].completedAt = new Date().toISOString();
    }

    return tasks[index];
  }

  static delete(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
  }

  // BUG 1: Off-by-one error in pagination
  static paginate(page, limit) {
    const startIndex = page * limit; // Bug: should be (page - 1) * limit
    const endIndex = startIndex + limit;
    const paginatedTasks = tasks.slice(startIndex, endIndex);

    return {
      tasks: paginatedTasks,
      total: tasks.length,
      page: page,
      limit: limit,
      totalPages: Math.ceil(tasks.length / limit)
    };
  }

  // BUG 2: Search doesn't handle case sensitivity properly
  static search(query) {
    return tasks.filter(t =>
      t.title.includes(query) || t.description.includes(query)
    );
  }

  // BUG 3: Sort function has incorrect comparison for dates
  static sortByDueDate() {
    return [...tasks].sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate - b.dueDate; // Bug: string comparison, not date comparison
    });
  }

  // BUG 4: Filter by priority doesn't validate input
  static filterByPriority(priority) {
    return tasks.filter(t => t.priority === priority);
  }

  // BUG 5: Stats calculation is wrong
  static getStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'done').length;
    const overdue = tasks.filter(t => {
      return t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done';
    }).length;

    // Bug: division by zero when no tasks
    const completionRate = (completed / total) * 100;

    return {
      total,
      completed,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      todo: tasks.filter(t => t.status === 'todo').length,
      overdue,
      completionRate
    };
  }

  static clearAll() {
    tasks.length = 0;
  }
}

module.exports = Task;

