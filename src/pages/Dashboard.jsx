import { Link } from 'react-router';
import { useApplications, useDeleteApplication } from '../hooks/useApplications';

function Dashboard() {
  const { data: applications, isLoading, isError, error } = useApplications();
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

  if (isLoading) {
    return <p>Loading your applications...</p>;
  }

  if (isError) {
    return <p className="text-red-400">Error: {error.message}</p>;
  }

  if (applications.length === 0) {
    return (
      <div>
        <p className="mb-4">No applications yet.</p>
        <Link to="/applications/new" className="bg-blue-600 px-4 py-2 rounded inline-block">
          Add your first application
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl">Your Applications</h2>
        <Link to="/applications/new" className="bg-blue-600 px-4 py-2 rounded">
          + New Application
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {applications.map((app) => (
          <Link
            key={app.id}
            to={`/applications/${app.id}`}
            className="block p-4 bg-slate-800 rounded border border-slate-700 hover:border-blue-500"
          >
            <div className="flex justify-between">
              <div>
                <p className="font-bold">{app.role}</p>
                <p className="text-slate-400">{app.company}</p>
              </div>
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
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;