import { useState, useEffect } from 'react';

const empty = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'todo',
  assignee: '',
  dueDate: '',
  tags: '',
};

export default function TaskForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || '',
        description: initial.description || '',
        priority: initial.priority || 'medium',
        status: initial.status || 'todo',
        assignee: initial.assignee || '',
        dueDate: initial.dueDate ? initial.dueDate.slice(0, 10) : '',
        tags: Array.isArray(initial.tags) ? initial.tags.join(', ') : '',
      });
    } else {
      setForm(empty);
    }
  }, [initial]);

  const handle = (e) => {
    e.preventDefault();
    const data = {
      ...form,
      tags: form.tags
        ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    };
    if (!data.dueDate) delete data.dueDate;
    onSubmit(data);
  };

  const field = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  return (
    <form onSubmit={handle} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title *</label>
        <input
          required
          value={form.title}
          onChange={(e) => field('title', e.target.value)}
          className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667eea]/40"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          rows={2}
          value={form.description}
          onChange={(e) => field('description', e.target.value)}
          className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667eea]/40"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select
            value={form.priority}
            onChange={(e) => field('priority', e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-lg"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={form.status}
            onChange={(e) => field('status', e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-lg"
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Assignee</label>
          <input
            value={form.assignee}
            onChange={(e) => field('assignee', e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667eea]/40"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Due Date</label>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => field('dueDate', e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-lg"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
        <input
          value={form.tags}
          onChange={(e) => field('tags', e.target.value)}
          className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667eea]/40"
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-sm text-white rounded-lg bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90"
        >
          {initial ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}
