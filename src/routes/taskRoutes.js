const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET all tasks with optional pagination
router.get('/', (req, res) => {
  const { page, limit } = req.query;

  if (page && limit) {
    const result = Task.paginate(parseInt(page), parseInt(limit));
    return res.json(result);
  }

  res.json(Task.getAll());
});

// GET search tasks
router.get('/search', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Search query is required' });
  }
  const results = Task.search(q);
  res.json(results);
});

// GET task stats
router.get('/stats', (req, res) => {
  const stats = Task.getStats();
  res.json(stats);
});

// GET sorted by due date
router.get('/sorted', (req, res) => {
  const sorted = Task.sortByDueDate();
  res.json(sorted);
});

// GET task by ID
router.get('/:id', (req, res) => {
  const task = Task.getById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

// POST create task
router.post('/', (req, res) => {
  const { title, description, priority, assignee, dueDate, tags } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const task = Task.create({ title, description, priority, assignee, dueDate, tags });
  res.status(201).json(task);
});

// PUT update task
router.put('/:id', (req, res) => {
  const task = Task.update(req.params.id, req.body);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

// DELETE task
router.delete('/:id', (req, res) => {
  const success = Task.delete(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.status(204).send();
});

module.exports = router;
