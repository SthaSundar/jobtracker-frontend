import { Outlet, Link, useNavigate } from 'react-router';
import useAuthStore from '../store/authStore';

function MainLayout() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="p-4 border-b border-slate-700 flex gap-4 items-center">
        <Link to="/" className="hover:text-blue-400">Dashboard</Link>
        {isAuthenticated ? (
          <button onClick={handleLogout} className="hover:text-blue-400 ml-auto">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-400">Login</Link>
            <Link to="/register" className="hover:text-blue-400">Register</Link>
          </>
        )}
        <Link to="/board" className="hover:text-blue-400">Board</Link>
      </nav>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;