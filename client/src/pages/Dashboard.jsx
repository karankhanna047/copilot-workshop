import { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import PriorityBadge from '../components/PriorityBadge';
import StatusBadge from '../components/StatusBadge';
import * as api from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getTaskStats(), api.getTasks(), api.getUsers()])
      .then(([s, t, u]) => {
        setStats(s);
        setTasks(Array.isArray(t) ? t : t.tasks || []);
        setUsers(Array.isArray(u) ? u : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-gray-400 text-sm">Loading dashboard...</p>;
  }

  const recent = tasks.slice(0, 5);
  const totalTasks = stats?.totalTasks ?? tasks.length;
  const completed = stats?.completedTasks ?? 0;
  const inProgress = stats?.inProgressTasks ?? 0;
  const overdue = stats?.overdueTasks ?? 0;
  const completionRate = stats?.completionRate;
  const rateDisplay =
    completionRate != null && isFinite(completionRate)
      ? `${Math.round(completionRate)}%`
      : 'N/A';

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Tasks" value={totalTasks} />
        <StatCard label="Completed" value={completed} color="text-emerald-600" />
        <StatCard label="In Progress" value={inProgress} color="text-blue-600" />
        <StatCard label="Overdue" value={overdue} color="text-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-base font-semibold mb-4 flex items-center justify-between">
            Recent Tasks
            <span className="text-xs bg-[#667eea] text-white px-2 py-0.5 rounded-full">
              {recent.length}
            </span>
          </h2>
          <ul className="divide-y divide-gray-100">
            {recent.map((task) => (
              <li key={task.id} className="flex items-center gap-3 py-3">
                <PriorityBadge priority={task.priority} />
                <span className="flex-1 text-sm">{task.title}</span>
                <StatusBadge status={task.status} />
                <span className="text-xs text-gray-400">
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : ''}
                </span>
              </li>
            ))}
            {recent.length === 0 && (
              <li className="py-4 text-sm text-gray-400 text-center">
                No tasks yet. Seed the database or create some tasks!
              </li>
            )}
          </ul>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Completion Rate */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h2 className="text-base font-semibold mb-3">Completion Rate</h2>
            <div className="text-center mb-3">
              <span className="text-4xl font-bold text-[#667eea]">{rateDisplay}</span>
              <p className="text-xs text-gray-400 mt-1">
                {completed} of {totalTasks} tasks completed
              </p>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2]"
                style={{
                  width: `${isFinite(completionRate) ? Math.min(completionRate, 100) : 0}%`,
                }}
              />
            </div>
          </div>

          {/* Team Workload */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h2 className="text-base font-semibold mb-3">Team Workload</h2>
            <div className="divide-y divide-gray-100">
              {users.slice(0, 5).map((user) => {
                const count = tasks.filter((t) => t.assignee === user.name).length;
                const initials = (user.name || '')
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2);
                return (
                  <div key={user.id} className="flex items-center gap-3 py-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#667eea] text-white text-xs font-semibold flex items-center justify-center">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-gray-400">{count} active tasks</p>
                    </div>
                  </div>
                );
              })}
              {users.length === 0 && (
                <p className="py-3 text-sm text-gray-400 text-center">No users yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
