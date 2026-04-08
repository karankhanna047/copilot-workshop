import { useState } from 'react';
import HealthTestCard from '../components/HealthTestCard';
import * as api from '../api';

const tests = [
  {
    id: 'health',
    name: 'API Health',
    description: 'Server is reachable and returns status ok',
    run: async () => {
      const data = await api.getHealth();
      if (data.status === 'ok') return { status: 'pass', detail: 'status: ok' };
      return { status: 'fail', detail: `Got status: ${data.status}` };
    },
  },
  {
    id: 'pagination',
    name: 'Pagination',
    description: 'Page 1 returns the correct first items',
    run: async () => {
      const [all, page1] = await Promise.all([
        api.getTasks(),
        api.getTasksPaginated(1, 2),
      ]);
      const allTasks = Array.isArray(all) ? all : all.tasks || [];
      const pageTasks = page1.tasks || [];
      if (allTasks.length === 0) return { status: 'fail', detail: 'No tasks in DB. Run npm run seed first.' };
      if (pageTasks.length === 0) return { status: 'fail', detail: 'Paginated response returned 0 tasks' };
      const match = allTasks[0]?.id === pageTasks[0]?.id;
      if (match) return { status: 'pass', detail: `First item matches: ${pageTasks[0].title}` };
      return {
        status: 'fail',
        detail: `Mismatch! All[0]="${allTasks[0]?.title}" vs Page1[0]="${pageTasks[0]?.title}"`,
      };
    },
  },
  {
    id: 'search',
    name: 'Case-Insensitive Search',
    description: 'search?q=fix and search?q=Fix return the same count',
    run: async () => {
      const [lower, upper] = await Promise.all([
        api.searchTasks('fix'),
        api.searchTasks('Fix'),
      ]);
      const lowerArr = Array.isArray(lower) ? lower : [];
      const upperArr = Array.isArray(upper) ? upper : [];
      if (lowerArr.length === upperArr.length) {
        return { status: 'pass', detail: `Both return ${lowerArr.length} results` };
      }
      return {
        status: 'fail',
        detail: `"fix" returned ${lowerArr.length}, "Fix" returned ${upperArr.length} (case-sensitive bug)`,
      };
    },
  },
  {
    id: 'sorting',
    name: 'Date Sorting',
    description: 'GET /api/tasks/sorted returns dates in ascending order',
    run: async () => {
      const sorted = await api.getTasksSorted();
      const arr = Array.isArray(sorted) ? sorted : [];
      if (arr.length < 2) return { status: 'pass', detail: 'Not enough tasks to verify' };
      const dates = arr.filter((t) => t.dueDate).map((t) => new Date(t.dueDate).getTime());
      for (let i = 1; i < dates.length; i++) {
        if (dates[i] < dates[i - 1]) {
          return { status: 'fail', detail: `Item ${i} has earlier date than item ${i - 1}` };
        }
      }
      return { status: 'pass', detail: `${dates.length} dated tasks in correct order` };
    },
  },
  {
    id: 'stats',
    name: 'Stats (No NaN)',
    description: 'completionRate is a finite number, not NaN',
    run: async () => {
      const stats = await api.getTaskStats();
      if (isFinite(stats.completionRate)) {
        return { status: 'pass', detail: `completionRate = ${stats.completionRate}` };
      }
      return {
        status: 'fail',
        detail: `completionRate = ${stats.completionRate} (NaN / Infinity)`,
      };
    },
  },
  {
    id: 'productivity',
    name: 'Analytics: Productivity',
    description: 'GET /api/analytics/productivity is implemented',
    run: async () => {
      const data = await api.getProductivity();
      if (data.message === 'Not implemented yet') {
        return { status: 'not-implemented', detail: 'Returns stub message' };
      }
      return { status: 'pass', detail: 'Endpoint returns real data' };
    },
  },
  {
    id: 'overdue',
    name: 'Analytics: Overdue',
    description: 'GET /api/analytics/overdue is implemented',
    run: async () => {
      const data = await api.getOverdue();
      if (data.message === 'Not implemented yet') {
        return { status: 'not-implemented', detail: 'Returns stub message' };
      }
      return { status: 'pass', detail: 'Endpoint returns real data' };
    },
  },
];

export default function WorkshopHealth() {
  const [results, setResults] = useState({});
  const [running, setRunning] = useState(false);

  const runAll = async () => {
    setRunning(true);
    const next = {};
    for (const test of tests) {
      try {
        next[test.id] = await test.run();
      } catch (err) {
        next[test.id] = { status: 'fail', detail: err.message };
      }
    }
    setResults(next);
    setRunning(false);
  };

  const passCount = Object.values(results).filter((r) => r.status === 'pass').length;
  const total = tests.length;
  const hasResults = Object.keys(results).length > 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Workshop Health</h1>
        <button
          onClick={runAll}
          disabled={running}
          className="px-4 py-2 text-sm text-white rounded-lg bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90 disabled:opacity-50"
        >
          {running ? 'Running...' : 'Run All Tests'}
        </button>
      </div>

      {hasResults && (
        <div className="mb-6 bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
          <div className="text-2xl font-bold text-[#667eea]">
            {passCount}/{total}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Tests Passing</p>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2]"
                style={{ width: `${(passCount / total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tests.map((test) => (
          <HealthTestCard
            key={test.id}
            name={test.name}
            description={test.description}
            status={results[test.id]?.status || 'pending'}
            detail={results[test.id]?.detail}
          />
        ))}
      </div>
    </div>
  );
}
