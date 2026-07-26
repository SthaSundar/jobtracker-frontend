import { Outlet, Link } from 'react-router';

function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="p-4 border-b border-slate-700 flex gap-4">
        <Link to="/" className="hover:text-blue-400">Dashboard</Link>
        <Link to="/login" className="hover:text-blue-400">Login</Link>
      </nav>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;