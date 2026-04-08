---
description: Generate comprehensive tests for existing code
---

# Generate Tests

You are generating tests for a Node.js Express application.

## Test Framework
- Jest + Supertest for HTTP tests
- Test file location: `src/__tests__/*.test.js`

## Test Structure
```javascript
const request = require('supertest');
const app = require('../index');

beforeEach(() => {
  // Reset state between tests
});

describe('[HTTP Method] [Endpoint]', () => {
  describe('success cases', () => {
    // Happy path tests
  });
  describe('validation errors', () => {
    // Missing/invalid input
  });
  describe('edge cases', () => {
    // Empty data, boundary values, special characters
  });
});
```

## Naming Convention
`should [expected behavior] when [condition]`

## Coverage Requirements
For each endpoint generate tests for:
- Valid input (happy path)
- Each required field missing
- Invalid field values (wrong type, too long, invalid format)
- Not found cases (invalid IDs)
- Empty results
- Boundary values

Generate tests for: {{ user_request }}
