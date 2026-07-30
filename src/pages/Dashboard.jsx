import { useState } from 'react';
import { Link } from 'react-router';
import { useApplications, useDeleteApplication } from '../hooks/useApplications';
import { useDebounce } from '../hooks/useDebounce';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useApplicationStats } from '../hooks/useApplicationStats';
import { toast } from 'sonner';
import StatusStamp from '../components/StatusStamp';
import ConfirmModal from '../components/ConfirmModal';

const STATUS_COLORS = {
  applied: '#6c87a8',
  interview: '#d98f3f',
  offer: '#4b9e6e',
  rejected: '#b5533c',
};

function Dashboard() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [pendingDelete, setPendingDelete] = useState(null); // { id, role, company } | null

  const filters = {};
  if (debouncedSearch) filters.search = debouncedSearch;
  if (status) filters.status = status;

  const { data: applications, isLoading, isError, error } = useApplications(filters);
  const deleteMutation = useDeleteApplication();
  const { statusBreakdown, timeline } = useApplicationStats(applications);

  const handleDeleteClick = (e, id, role, company) => {
    e.preventDefault();
    e.stopPropagation();
    setPendingDelete({ id, role, company });
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    deleteMutation.mutate(pendingDelete.id);
    toast.success('Application deleted');
    setPendingDelete(null);
  };

  const cancelDelete = () => setPendingDelete(null);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl">Your Applications</h2>
        <Link to="/applications/new" className="bg-accent text-ink font-medium px-4 py-2 rounded-md hover:bg-accent-hover transition-colors">
          + New Application
        </Link>
      </div>

      {!isLoading && !isError && applications && applications.length > 0 && (
        <div className="flex flex-wrap gap-6 mb-6">
          <div className="bg-surface border border-accent/10 rounded-md p-4 w-full sm:w-auto">
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

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search company or role..."
          className="flex-1 p-2.5 rounded-md bg-surface border border-accent/20 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="p-2.5 rounded-md bg-surface border border-accent/20 text-text-primary focus:outline-none focus:border-accent"
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
              className="block p-4 bg-surface border border-accent/10 border-l-4 rounded-md hover:border-l-accent transition-colors"
              style={{ borderLeftColor: STATUS_COLORS[app.status] }}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div>
                  <p className="font-bold">{app.role}</p>
                  <p className="text-slate-400">{app.company}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusStamp status={app.status} />
                  <button
                    onClick={(e) => handleDeleteClick(e, app.id, app.role, app.company)}
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

      <ConfirmModal
        open={!!pendingDelete}
        title="Delete application?"
        message={
          pendingDelete
            ? `Delete the application for ${pendingDelete.role} at ${pendingDelete.company}? This can't be undone.`
            : ''
        }
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}

export default Dashboard;