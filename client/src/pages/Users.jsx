import { useState, useEffect } from 'react';
import UserRow from '../components/UserRow';
import UserForm from '../components/UserForm';
import Modal from '../components/Modal';
import * as api from '../api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .getUsers()
      .then(setUsers)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = (data) => {
    api.createUser(data).then(() => {
      setShowCreate(false);
      load();
    });
  };

  const handleDelete = () => {
    api.deleteUser(deleting.id).then(() => {
      setDeleting(null);
      load();
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 text-sm text-white rounded-lg bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90"
        >
          + New User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="py-3 px-4 w-12"></th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserRow key={user.id} user={user} onDelete={setDeleting} />
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-400">
            {loading ? 'Loading...' : 'No users yet'}
          </p>
        )}
      </div>

      {/* Create modal */}
      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create User"
      >
        <UserForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete User"
      >
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to delete &quot;{deleting?.name}&quot;?
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
