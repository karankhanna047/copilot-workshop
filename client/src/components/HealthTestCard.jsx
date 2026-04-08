const borderColors = {
  pass: 'border-green-400 bg-green-50',
  fail: 'border-red-400 bg-red-50',
  'not-implemented': 'border-amber-400 bg-amber-50',
  pending: 'border-gray-200 bg-white',
};

const icons = {
  pass: '✅',
  fail: '❌',
  'not-implemented': '🟡',
  pending: '⏳',
};

export default function HealthTestCard({ name, description, status, detail }) {
  return (
    <div className={`border-2 rounded-xl p-4 ${borderColors[status] || borderColors.pending}`}>
      <div className="flex items-start gap-3">
        <span className="text-xl">{icons[status] || icons.pending}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm">{name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          {detail && (
            <p className="text-xs mt-2 text-gray-600 bg-white/60 rounded px-2 py-1 font-mono break-all">
              {detail}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
