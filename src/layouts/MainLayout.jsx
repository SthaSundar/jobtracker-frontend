import { Outlet, Link, useNavigate } from 'react-router';
import { Sun, Moon } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';

function MainLayout() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-ink text-text-primary font-body">
      <nav className="px-6 py-4 border-b border-accent/20 flex items-center gap-6">
        <Link to="/" className="font-display italic text-xl text-text-primary mr-2">
          JobTracker
        </Link>
        <Link to="/" className="text-sm text-text-muted hover:text-accent transition-colors">
          Log
        </Link>
        <Link to="/board" className="text-sm text-text-muted hover:text-accent transition-colors">
          Board
        </Link>

        <div className="ml-auto flex items-center gap-4">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="text-text-muted hover:text-accent transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="text-sm text-text-muted hover:text-accent transition-colors">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="text-sm text-text-muted hover:text-accent transition-colors">Login</Link>
              <Link to="/register" className="text-sm text-text-muted hover:text-accent transition-colors">Register</Link>
            </>
          )}
        </div>
      </nav>
      <main className="px-6 py-6 max-w-6xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;