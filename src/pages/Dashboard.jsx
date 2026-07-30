import { useState } from 'react';
import { Link } from 'react-router';
import { useApplications, useDeleteApplication } from '../hooks/useApplications';
import { useDebounce } from '../hooks/useDebounce';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useApplicationStats } from '../hooks/useApplicationStats';
import { toast } from 'sonner';

const STATUS_COLORS = {
  applied: '#3b82f6',
  interview: '#f59e0b',
  offer: '#22c55e',
  rejected: '#ef4444',
};

function Dashboard() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const filters = {};
  if (debouncedSearch) filters.search = debouncedSearch;
  if (status) filters.status = status;

  const { data: applications, isLoading, isError, error } = useApplications(filters);
  const deleteMutation = useDeleteApplication();
  const { statusBreakdown, timeline } = useApplicationStats(applications);

  const handleDelete = (e, id, role, company) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = window.confirm(
      `Delete the application for ${role} at ${company}? This can't be undone.`
    );

    if (confirmed) {
      deleteMutation.mutate(id);
      toast.success('Application deleted');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl">Your Applications</h2>
        <Link to="/applications/new" className="bg-blue-600 px-4 py-2 rounded">
          + New Application
        </Link>
      </div>

      {!isLoading && !isError && applications && applications.length > 0 && (
        <div className="flex flex-wrap gap-6 mb-6">
          <div className="bg-slate-800 border border-slate-700 rounded p-4">
            <h3 className="text-sm text-slate-400 mb-2">Status Breakdown</h3>
            <PieChart width={220} height={180}>
              <Pie
                data={statusBreakdown}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={60}
              >
                {statusBreakdown.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded p-4 flex-1 min-w-[300px]">
            <h3 className="text-sm text-slate-400 mb-2">Applications Over Time</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={timeline}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis allowDecimals={false} tick={{ fill: '#94a3b8' }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="flex gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search company or role..."
          className="flex-1 p-2 rounded bg-slate-800 border border-slate-700"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="p-2 rounded bg-slate-800 border border-slate-700"
        >
          <option value="">All statuses</option>
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {isLoading && <p>Loading your applications...</p>}
      {isError && <p className="text-red-400">Error: {error.message}</p>}

      {!isLoading && !isError && applications.length === 0 && (
        <p>No applications match your filters.</p>
      )}

      {!isLoading && !isError && applications.length > 0 && (
        <div className="flex flex-col gap-3">
          {applications.map((app) => (
            <Link
              key={app.id}
              to={`/applications/${app.id}`}
              className="block p-4 bg-slate-800 rounded border border-slate-700 hover:border-blue-500"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">{app.role}</p>
                  <p className="text-slate-400">{app.company}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm bg-slate-700 px-2 py-1 rounded h-fit">
                    {app.status}
                  </span>
                  <button
                    onClick={(e) => handleDelete(e, app.id, app.role, app.company)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;