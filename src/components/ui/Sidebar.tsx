import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import {
  Shield,
  LayoutDashboard,
  FileText,
  CheckCircle,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  roles: ('user' | 'admin')[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    roles: ['user'],
  },
  {
    label: 'Submit KYC',
    icon: FileText,
    href: '/dashboard/submit',
    roles: ['user'],
  },
  {
    label: 'KYC Status',
    icon: CheckCircle,
    href: '/dashboard/status',
    roles: ['user'],
  },
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',
    roles: ['admin'],
  },
  {
    label: 'All Submissions',
    icon: Users,
    href: '/admin/submissions',
    roles: ['admin'],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const filteredItems = navItems.filter((item) =>
    item.roles.includes(user?.role || 'user')
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 z-40 flex flex-col',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg">
              <Shield className="text-primary-foreground" size={18} />
            </div>
            <span className="text-lg font-bold text-sidebar-foreground">
              Verify<span className="text-primary">KYC</span>
            </span>
          </div>
        )}
        <button
          onClick={onToggle}
          className={cn(
            'p-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors',
            isCollapsed && 'mx-auto'
          )}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        <ul className="space-y-1">
          {filteredItems.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                end={item.href === '/dashboard' || item.href === '/admin'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
                    isCollapsed && 'justify-center px-2'
                  )
                }
              >
                <item.icon size={20} />
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-3 border-t border-sidebar-border">
        {!isCollapsed && user && (
          <div className="mb-3 px-3 py-2 bg-sidebar-accent/50 rounded-lg">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user.fullName}
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              {user.email}
            </p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-medium text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-all duration-200',
            isCollapsed && 'justify-center px-2'
          )}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export { Sidebar };
