const BASE = '';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (res.status === 204) return null;
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

// Health
export const getHealth = () => request('/health');

// Tasks
export const getTasks = () => request('/api/tasks');
export const getTasksPaginated = (page, limit = 5) =>
  request(`/api/tasks?page=${page}&limit=${limit}`);
export const getTask = (id) => request(`/api/tasks/${id}`);
export const createTask = (data) =>
  request('/api/tasks', { method: 'POST', body: JSON.stringify(data) });
export const updateTask = (id, data) =>
  request(`/api/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteTask = (id) =>
  request(`/api/tasks/${id}`, { method: 'DELETE' });
export const searchTasks = (q) =>
  request(`/api/tasks/search?q=${encodeURIComponent(q)}`);
export const getTaskStats = () => request('/api/tasks/stats');
export const getTasksSorted = () => request('/api/tasks/sorted');

// Users
export const getUsers = () => request('/api/users');
export const createUser = (data) =>
  request('/api/users', { method: 'POST', body: JSON.stringify(data) });
export const deleteUser = (id) =>
  request(`/api/users/${id}`, { method: 'DELETE' });

// Analytics
export const getProductivity = () => request('/api/analytics/productivity');
export const getOverdue = () => request('/api/analytics/overdue');
