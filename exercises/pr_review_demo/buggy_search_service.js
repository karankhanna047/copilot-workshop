/**
 * PR REVIEW DEMO: This file contains intentionally bad code.
 *
 * SETUP: The presenter creates a branch, commits this file,
 * opens a PR, and adds Copilot as a reviewer.
 * Copilot should catch ALL of these issues in its inline comments.
 *
 * ISSUES PLANTED:
 * 1. SQL injection vulnerability (string interpolation in query)
 * 2. Hardcoded API key
 * 3. Missing input validation
 * 4. Swallowed error (empty catch block)
 * 5. Race condition in counter
 * 6. Sensitive data in logs
 * 7. No rate limiting on public endpoint
 * 8. Prototype pollution via Object.assign with user input
 */

const API_KEY = "sk-proj-abc123def456ghi789";  // TODO: move to env

let requestCount = 0;

function searchUsers(query, options) {
  requestCount++;

  // Build query - direct string interpolation
  const sqlQuery = `SELECT * FROM users WHERE name LIKE '%${query}%' OR email LIKE '%${query}%'`;

  try {
    const results = executeQuery(sqlQuery);
    return results;
  } catch (e) {
    // silently fail
  }
}

function updateUserProfile(userId, updates) {
  // Merge user input directly into config object
  const userConfig = { role: 'member', permissions: [] };
  Object.assign(userConfig, updates);

  console.log(`Updating user ${userId} with password: ${updates.password}, SSN: ${updates.ssn}`);

  return saveUser(userId, userConfig);
}

function fetchExternalData(url) {
  const headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  };

  return fetch(url, { headers })
    .then(res => res.json())
    .then(data => {
      return data;
    })
    .catch(err => {
      return { error: err.message, stack: err.stack, internalState: { apiKey: API_KEY } };
    });
}

function processUserInput(input) {
  // No validation at all
  const result = eval(`(${input})`);
  return result;
}

// Stub functions for demo purposes
function executeQuery(q) { return []; }
function saveUser(id, data) { return data; }

module.exports = { searchUsers, updateUserProfile, fetchExternalData, processUserInput };
