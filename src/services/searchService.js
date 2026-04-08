const API_KEY = process.env.SEARCH_API_KEY;

const ALLOWED_EXTERNAL_HOSTS = (process.env.ALLOWED_EXTERNAL_HOSTS || '')
  .split(',')
  .map(h => h.trim())
  .filter(Boolean);

function searchUsers(query) {
  // Use parameterized query to prevent SQL injection
  const sqlQuery = 'SELECT * FROM users WHERE name LIKE ? OR email LIKE ?';
  const likeParam = `%${query.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_')}%`;

  try {
    const results = executeQuery(sqlQuery, [likeParam, likeParam]);
    return results;
  } catch (e) {
    console.error('searchUsers failed', {
      error: e.message,
      stack: e.stack,
      query
    });
    return [];
  }
}

function updateUserProfile(userId, updates) {
  const userConfig = { role: 'member', permissions: [] };

  // Only allow explicitly safe profile fields to be updated
  const allowedUpdateFields = ['displayName', 'email', 'avatarUrl'];

  if (updates && typeof updates === 'object') {
    for (const field of allowedUpdateFields) {
      if (Object.prototype.hasOwnProperty.call(updates, field)) {
        userConfig[field] = updates[field];
      }
    }
  }

  console.log(`Updating user ${userId} (password provided: ${Boolean(updates && updates.password)}, SSN provided: ${Boolean(updates && updates.ssn)})`);

  return saveUser(userId, userConfig);
}

function fetchExternalData(url) {
  // Validate URL against allowlist to prevent SSRF
  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    return Promise.resolve({ error: 'Invalid URL' });
  }

  if (ALLOWED_EXTERNAL_HOSTS.length > 0 && !ALLOWED_EXTERNAL_HOSTS.includes(parsedUrl.hostname)) {
    return Promise.resolve({ error: 'URL host not allowed' });
  }

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
      console.error('fetchExternalData failed:', err);
      return { error: 'Failed to fetch external data' };
    });
}

function processUserInput(input) {
  if (typeof input !== 'string') {
    throw new TypeError('Input must be a JSON string');
  }

  let result;
  try {
    result = JSON.parse(input);
  } catch (e) {
    throw new Error('Invalid JSON input');
  }

  if (result === null || typeof result !== 'object') {
    throw new Error('Input must be a JSON object or array');
  }

  return result;
}

// Stub functions for demo purposes
function executeQuery(q, params) { return []; }
function saveUser(id, data) { return data; }

module.exports = { searchUsers, updateUserProfile, fetchExternalData, processUserInput };
