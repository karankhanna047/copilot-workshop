import { useState, useEffect, useCallback } from 'react';
import TaskRow from '../components/TaskRow';
import TaskForm from '../components/TaskForm';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import * as api from '../api';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchResults, setSearchResults] = useState(null);
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadPage = useCallback((p) => {
    setLoading(true);
    api
      .getTasksPaginated(p, 5)
      .then((data) => {
        setTasks(data.tasks || []);
        setPage(data.page || p);
        setTotalPages(data.totalPages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  const handleSearch = (q) => {
    if (!q) {
      setSearchResults(null);
      return;
    }
    api.searchTasks(q).then(setSearchResults).catch(() => setSearchResults([]));
  };

  const handleCreate = (data) => {
    api.createTask(data).then(() => {
      setShowCreate(false);
      loadPage(page);
    });
  };

  const handleUpdate = (data) => {
    api.updateTask(editing.id, data).then(() => {
      setEditing(null);
      loadPage(page);
    });
  };

  const handleDelete = () => {
    api.deleteTask(deleting.id).then(() => {
      setDeleting(null);
      loadPage(page);
    });
  };

  const displayed = (searchResults ?? tasks).filter((t) => {
    if (filterPriority && t.priority !== filterPriority) return false;
    if (filterStatus && t.status !== filterStatus) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 text-sm text-white rounded-lg bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90"
        >
          + New Task
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <SearchBar onSearch={handleSearch} placeholder="Search tasks..." />
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2"
        >
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2"
        >
          <option value="">All Statuses</option>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        {searchResults && (
          <span className="text-xs text-gray-500">
            {searchResults.length} search result{searchResults.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="py-3 px-4 w-10"></th>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Assignee</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Due</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onEdit={setEditing}
                onDelete={setDeleting}
              />
            ))}
          </tbody>
        </table>
        {displayed.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-400">
            {loading ? 'Loading...' : 'No tasks found'}
          </p>
        )}
      </div>

      {/* Pagination (only when not searching) */}
      {!searchResults && (
        <Pagination page={page} totalPages={totalPages} onPageChange={loadPage} />
      )}

      {/* Create modal */}
      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create Task"
      >
        <TaskForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
      </Modal>

      {/* Edit modal */}
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit Task"
      >
        {editing && (
          <TaskForm
            initial={editing}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete Task"
      >
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to delete &quot;{deleting?.title}&quot;?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setDeleting(null)}
            className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
