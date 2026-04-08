const colors = {
  high: 'bg-red-500',
  medium: 'bg-amber-400',
  low: 'bg-emerald-500',
};

export default function PriorityBadge({ priority }) {
  return (
    <span
      className={`inline-block w-2.5 h-2.5 rounded-full ${colors[priority] || 'bg-gray-300'}`}
      title={priority}
    />
  );
}
