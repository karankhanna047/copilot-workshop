export default function StatCard({ label, value, subtitle, color = 'text-gray-900' }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}
