const request = require('supertest');
const app = require('../index');
const Task = require('../models/Task');

beforeEach(() => {
  Task.clearAll();
});

describe('POST /api/tasks', () => {
  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test Task', description: 'A test task', priority: 'high' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test Task');
    expect(res.body.id).toBeDefined();
  });

  it('should return 400 if title is missing', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ description: 'No title' });

    expect(res.status).toBe(400);
  });
});

describe('GET /api/tasks', () => {
  it('should return all tasks', async () => {
    Task.create({ title: 'Task 1' });
    Task.create({ title: 'Task 2' });

    const res = await request(app).get('/api/tasks');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

describe('GET /api/tasks/:id', () => {
  it('should return a task by ID', async () => {
    const task = Task.create({ title: 'Find me' });

    const res = await request(app).get(`/api/tasks/${task.id}`);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Find me');
  });

  it('should return 404 for non-existent task', async () => {
    const res = await request(app).get('/api/tasks/nonexistent-id');
    expect(res.status).toBe(404);
  });
});

// NOTE: More tests are intentionally missing -- attendees will generate them
