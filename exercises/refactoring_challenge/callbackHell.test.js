/**
 * Tests for the callback hell refactoring exercise.
 * These tests use the CALLBACK version.
 *
 * BONUS EXERCISE: After refactoring to async/await,
 * ask Copilot to also refactor these tests to use async/await.
 */

const {
  fetchUserData,
  fetchUserTasks,
  generateUserReport,
  generateTeamReport,
} = require('./callbackHell');

describe('fetchUserData', () => {
  test('returns user data for valid ID', (done) => {
    fetchUserData('u1', (err, user) => {
      expect(err).toBeNull();
      expect(user.name).toBe('Alice');
      expect(user.department).toBe('Engineering');
      done();
    });
  });

  test('returns error for invalid ID', (done) => {
    fetchUserData('invalid', (err, user) => {
      expect(err).toBeTruthy();
      expect(err.message).toBe('User not found');
      done();
    });
  });
});

describe('generateUserReport', () => {
  test('generates complete report for valid user', (done) => {
    generateUserReport('u1', (err, report) => {
      expect(err).toBeNull();
      expect(report.user.name).toBe('Alice');
      expect(report.taskSummary.total).toBe(3);
      expect(report.taskSummary.completed).toBe(2);
      expect(report.hours.total).toBe(14);
      expect(report.department.name).toBe('Engineering');
      expect(report.generatedAt).toBeDefined();
      done();
    });
  });

  test('returns error for invalid user', (done) => {
    generateUserReport('invalid', (err, report) => {
      expect(err).toBeTruthy();
      done();
    });
  });
});

describe('generateTeamReport', () => {
  test('generates team report for multiple users', (done) => {
    generateTeamReport(['u1', 'u2', 'u3'], (err, result) => {
      expect(err).toBeNull();
      expect(result.reports).toHaveLength(3);
      expect(result.errors).toHaveLength(0);
      expect(result.summary.teamSize).toBe(3);
      expect(parseInt(result.summary.completionRate)).toBeGreaterThan(0);
      done();
    });
  });

  test('handles mixed valid and invalid users', (done) => {
    generateTeamReport(['u1', 'invalid', 'u2'], (err, result) => {
      expect(err).toBeNull();
      expect(result.reports).toHaveLength(2);
      expect(result.errors).toHaveLength(1);
      done();
    });
  });

  test('handles empty user list', (done) => {
    generateTeamReport([], (err, result) => {
      expect(err).toBeNull();
      expect(result.reports).toHaveLength(0);
      done();
    });
  });
});
