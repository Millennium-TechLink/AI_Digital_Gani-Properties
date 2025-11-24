import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Plus, List, LogOut } from 'lucide-react';
import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <img
              src="/images/Logo.webp"
              alt="Gani Properties"
              className="h-10 w-auto object-contain"
            />
          </div>
          <h1 className="text-xl font-display font-bold text-gp-ink">
            Gani Properties
          </h1>
          <p className="text-sm text-gp-ink-muted mt-1">Admin Portal</p>
        </div>
        
        <nav className="mt-8 px-4 flex-1">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              isActive('/dashboard')
                ? 'bg-gp-accent/10 text-gp-accent font-medium'
                : 'text-gp-ink-muted hover:bg-gray-100'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          
          <Link
            to="/properties"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              isActive('/properties') && !isActive('/properties/new') && !location.pathname.includes('/edit')
                ? 'bg-gp-accent/10 text-gp-accent font-medium'
                : 'text-gp-ink-muted hover:bg-gray-100'
            }`}
          >
            <List className="h-5 w-5" />
            All Properties
          </Link>
          
          <Link
            to="/properties/new"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              isActive('/properties/new')
                ? 'bg-gp-accent/10 text-gp-accent font-medium'
                : 'text-gp-ink-muted hover:bg-gray-100'
            }`}
          >
            <Plus className="h-5 w-5" />
            Add Property
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gp-ink-muted hover:bg-gray-100 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}

