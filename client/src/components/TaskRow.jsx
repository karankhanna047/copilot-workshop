import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';

export default function TaskRow({ task, onEdit, onDelete }) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50">
      <td className="py-3 px-4">
        <PriorityBadge priority={task.priority} />
      </td>
      <td className="py-3 px-4 font-medium text-sm">{task.title}</td>
      <td className="py-3 px-4 text-sm text-gray-500">{task.assignee || '—'}</td>
      <td className="py-3 px-4">
        <StatusBadge status={task.status} />
      </td>
      <td className="py-3 px-4 text-xs text-gray-400">
        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
      </td>
      <td className="py-3 px-4 text-right">
        <button
          onClick={() => onEdit(task)}
          className="text-xs text-[#667eea] hover:underline mr-3"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task)}
          className="text-xs text-red-500 hover:underline"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
