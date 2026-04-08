---
description: Generate a new REST API endpoint following project conventions
---

# Create API Endpoint

You are generating a new REST API endpoint for an Express.js application.

## Context
- Framework: Express.js with Node.js
- Testing: Jest + Supertest
- Validation: Input validated in route handler
- Error format: `{ "error": "message" }`

## Requirements
When creating the endpoint:

1. **Route handler** in `src/routes/` following existing patterns
2. **Input validation** for all request body fields
3. **Proper HTTP status codes**: 201 (created), 400 (bad input), 404 (not found), 204 (deleted)
4. **Error handling** with descriptive error messages
5. **Tests** in `src/__tests__/` covering success, validation errors, and not-found cases

## Template

```javascript
const express = require('express');
const router = express.Router();

// GET /api/{resource}
router.get('/', (req, res) => {
  // Implementation
});

// POST /api/{resource}
router.post('/', (req, res) => {
  const { /* fields */ } = req.body;

  // Validate required fields
  if (!field) {
    return res.status(400).json({ error: 'Field is required' });
  }

  // Create and return
  res.status(201).json(result);
});

module.exports = router;
```

Generate the endpoint for: {{ user_request }}
