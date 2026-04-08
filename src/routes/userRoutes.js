const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all users
router.get('/', (req, res) => {
  res.json(User.getAll());
});

// GET user by ID
router.get('/:id', (req, res) => {
  const user = User.getById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

// POST create user -- NO VALIDATION (intentional for workshop)
router.post('/', (req, res) => {
  const { name, email, role } = req.body;
  const user = User.create({ name, email, role });
  res.status(201).json(user);
});

// DELETE user
router.delete('/:id', (req, res) => {
  const success = User.delete(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.status(204).send();
});

module.exports = router;
