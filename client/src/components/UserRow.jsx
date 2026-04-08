export default function UserRow({ user, onDelete }) {
  const initials = (user.name || '')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50">
      <td className="py-3 px-4">
        <div className="w-8 h-8 rounded-full bg-[#667eea] text-white text-xs font-semibold flex items-center justify-center">
          {initials}
        </div>
      </td>
      <td className="py-3 px-4 text-sm font-medium">{user.name}</td>
      <td className="py-3 px-4 text-sm text-gray-500">{user.email}</td>
      <td className="py-3 px-4 text-sm text-gray-500">{user.role || '—'}</td>
      <td className="py-3 px-4 text-right">
        <button
          onClick={() => onDelete(user)}
          className="text-xs text-red-500 hover:underline"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
