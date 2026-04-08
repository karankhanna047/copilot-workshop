const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET productivity report -- INCOMPLETE (intentional for workshop)
router.get('/productivity', (req, res) => {
  // TODO: Calculate average completion time
  // TODO: Calculate tasks completed per week
  // TODO: Calculate priority distribution
  res.json({ message: 'Not implemented yet' });
});

// GET overdue report -- INCOMPLETE (intentional for workshop)
router.get('/overdue', (req, res) => {
  // TODO: Return all overdue tasks grouped by assignee
  // TODO: Include days overdue for each task
  res.json({ message: 'Not implemented yet' });
});

module.exports = router;
