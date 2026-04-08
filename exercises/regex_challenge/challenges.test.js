const {
  validateEmail,
  validatePassword,
  extractUrls,
  parseISODate,
  validateCreditCard,
  parseSQLSelect,
} = require('./challenges');

describe('Regex Challenge 1: Email Validation', () => {
  test('accepts valid emails', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    expect(validateEmail('user+tag@example.com')).toBe(true);
  });

  test('rejects invalid emails', () => {
    expect(validateEmail('notanemail')).toBe(false);
    expect(validateEmail('@domain.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });
});

describe('Regex Challenge 2: Password Validation', () => {
  test('accepts strong passwords', () => {
    expect(validatePassword('Str0ng!Pass')).toBe(true);
    expect(validatePassword('MyP@ssw0rd')).toBe(true);
  });

  test('rejects weak passwords', () => {
    expect(validatePassword('short')).toBe(false);
    expect(validatePassword('alllowercase1!')).toBe(false);
    expect(validatePassword('ALLUPPERCASE1!')).toBe(false);
    expect(validatePassword('NoNumbers!!')).toBe(false);
    expect(validatePassword('NoSpecial123')).toBe(false);
  });
});

describe('Regex Challenge 3: URL Extraction', () => {
  test('extracts URLs from text', () => {
    const text = 'Visit https://example.com and http://test.org/path?q=1 for more info';
    const urls = extractUrls(text);
    expect(urls).toContain('https://example.com');
    expect(urls).toContain('http://test.org/path?q=1');
  });

  test('returns empty array when no URLs found', () => {
    expect(extractUrls('no urls here')).toEqual([]);
  });
});

describe('Regex Challenge 4: ISO Date Parsing', () => {
  test('parses UTC date', () => {
    const result = parseISODate('2024-01-15T14:30:00Z');
    expect(result).toBeTruthy();
    expect(result.year).toBe('2024');
    expect(result.month).toBe('01');
    expect(result.day).toBe('15');
    expect(result.hour).toBe('14');
    expect(result.minute).toBe('30');
    expect(result.second).toBe('00');
  });

  test('returns null for invalid input', () => {
    expect(parseISODate('not-a-date')).toBeNull();
  });
});

describe('Regex Challenge 5: Credit Card Validation', () => {
  test('validates Visa', () => {
    const result = validateCreditCard('4111111111111111');
    expect(result.valid).toBe(true);
    expect(result.type).toBe('visa');
  });

  test('validates Mastercard', () => {
    const result = validateCreditCard('5500000000000004');
    expect(result.valid).toBe(true);
    expect(result.type).toBe('mastercard');
  });

  test('validates Amex', () => {
    const result = validateCreditCard('340000000000009');
    expect(result.valid).toBe(true);
    expect(result.type).toBe('amex');
  });

  test('handles dashes and spaces', () => {
    const result = validateCreditCard('4111-1111-1111-1111');
    expect(result.valid).toBe(true);
  });

  test('rejects invalid numbers', () => {
    const result = validateCreditCard('1234567890');
    expect(result.valid).toBe(false);
  });
});

describe('Regex Challenge 6: SQL Parsing', () => {
  test('parses full SELECT query', () => {
    const result = parseSQLSelect('SELECT name, age FROM users WHERE age > 25 ORDER BY name');
    expect(result).toBeTruthy();
    expect(result.columns).toContain('name');
    expect(result.table).toBe('users');
    expect(result.where).toContain('age > 25');
    expect(result.orderBy).toContain('name');
  });

  test('parses simple query without WHERE or ORDER BY', () => {
    const result = parseSQLSelect('SELECT * FROM products');
    expect(result).toBeTruthy();
    expect(result.columns).toBe('*');
    expect(result.table).toBe('products');
  });
});
