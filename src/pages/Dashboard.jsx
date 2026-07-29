import { useState } from 'react';
import { Link } from 'react-router';
import { useApplications, useDeleteApplication } from '../hooks/useApplications';
import { useDebounce } from '../hooks/useDebounce';

function Dashboard() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const filters = {};
  if (debouncedSearch) filters.search = debouncedSearch;
  if (status) filters.status = status;

  const { data: applications, isLoading, isError, error } = useApplications(filters);
  const deleteMutation = useDeleteApplication();

  const handleDelete = (e, id, role, company) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = window.confirm(
      `Delete the application for ${role} at ${company}? This can't be undone.`
    );

    if (confirmed) {
      deleteMutation.mutate(id);
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