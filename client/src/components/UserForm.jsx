import { useState } from 'react';

export default function UserForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({ name: '', email: '', role: 'developer' });

  const handle = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ name: '', email: '', role: 'developer' });
  };

  const field = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  return (
    <form onSubmit={handle} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name *</label>
        <input
          required
          value={form.name}
          onChange={(e) => field('name', e.target.value)}
          className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667eea]/40"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email *</label>
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => field('email', e.target.value)}
          className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667eea]/40"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Role</label>
        <select
          value={form.role}
          onChange={(e) => field('role', e.target.value)}
          className="w-full px-3 py-2 text-sm border rounded-lg"
        >
          <option value="developer">Developer</option>
          <option value="designer">Designer</option>
          <option value="manager">Manager</option>
          <option value="qa">QA</option>
        </select>
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
          Create User
        </button>
      </div>
    </form>
  );
}
