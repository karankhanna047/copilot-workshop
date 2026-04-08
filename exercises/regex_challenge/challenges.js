/**
 * REGEX CHALLENGE - Use Copilot to generate these regexes
 *
 * Instructions:
 * 1. For each challenge, write a COMMENT describing what you need
 * 2. Let Copilot generate the regex
 * 3. Run `npm test -- --testPathPattern=regex` to check your answers
 *
 * DO NOT write the regex yourself. The goal is to learn to DESCRIBE
 * what you need in plain English and let Copilot do the work.
 */

// CHALLENGE 1: Easy
// Write a comment describing a regex that validates email addresses
// Then let Copilot generate it
function validateEmail(email) {
  // TODO: Your comment + Copilot's regex here
  const regex = null;
  return regex ? regex.test(email) : false;
}

// CHALLENGE 2: Medium
// Write a comment for a regex that matches strong passwords:
// - At least 8 characters
// - At least one uppercase letter
// - At least one lowercase letter
// - At least one number
// - At least one special character (!@#$%^&*)
function validatePassword(password) {
  // TODO: Your comment + Copilot's regex here
  const regex = null;
  return regex ? regex.test(password) : false;
}

// CHALLENGE 3: Medium
// Write a comment for a regex that extracts all URLs from a text string
// Should match http and https URLs
function extractUrls(text) {
  // TODO: Your comment + Copilot's regex here
  const regex = null;
  return regex ? text.match(regex) || [] : [];
}

// CHALLENGE 4: Hard
// Write a comment for a regex that validates and parses ISO 8601 dates
// Like: 2024-01-15T14:30:00Z or 2024-01-15T14:30:00+05:30
// Should capture: year, month, day, hour, minute, second, timezone
function parseISODate(dateString) {
  // TODO: Your comment + Copilot's regex here
  const regex = null;
  if (!regex) return null;
  const match = dateString.match(regex);
  if (!match) return null;
  return {
    year: match[1],
    month: match[2],
    day: match[3],
    hour: match[4],
    minute: match[5],
    second: match[6],
    timezone: match[7]
  };
}

// CHALLENGE 5: Hard
// Write a comment for a regex that validates credit card numbers
// Visa: starts with 4, 16 digits
// Mastercard: starts with 51-55, 16 digits
// Amex: starts with 34 or 37, 15 digits
// Should work with or without dashes/spaces between groups
function validateCreditCard(number) {
  // TODO: Your comment + Copilot's regex here
  const cleaned = number.replace(/[\s-]/g, '');
  const visa = null;
  const mastercard = null;
  const amex = null;

  if (!visa || !mastercard || !amex) return { valid: false, type: 'unknown' };

  if (visa.test(cleaned)) return { valid: true, type: 'visa' };
  if (mastercard.test(cleaned)) return { valid: true, type: 'mastercard' };
  if (amex.test(cleaned)) return { valid: true, type: 'amex' };
  return { valid: false, type: 'unknown' };
}

// CHALLENGE 6: Expert
// Write a comment for a regex that parses a simplified SQL SELECT query
// Example: SELECT name, age FROM users WHERE age > 25 ORDER BY name
// Should capture: columns, table, where clause, order by clause
function parseSQLSelect(query) {
  // TODO: Your comment + Copilot's regex here
  const regex = null;
  if (!regex) return null;
  const match = query.match(regex);
  if (!match) return null;
  return {
    columns: match[1] ? match[1].trim() : null,
    table: match[2] ? match[2].trim() : null,
    where: match[3] ? match[3].trim() : null,
    orderBy: match[4] ? match[4].trim() : null,
  };
}

module.exports = {
  validateEmail,
  validatePassword,
  extractUrls,
  parseISODate,
  validateCreditCard,
  parseSQLSelect,
};
