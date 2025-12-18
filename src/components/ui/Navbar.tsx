import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Shield, LogOut, User, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary rounded-lg group-hover:shadow-glow transition-shadow duration-300">
              <Shield className="text-primary-foreground" size={20} />
            </div>
            <span className="text-xl font-bold text-foreground">
              Verify<span className="text-gradient">KYC</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
                  <User size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {user?.fullName}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full capitalize">
                    {user?.role}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="gradient" size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300',
            isMobileMenuOpen ? 'max-h-64 pb-4' : 'max-h-0'
          )}
        >
          {isAuthenticated ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                <User size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {user?.fullName}
                </span>
                <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full capitalize ml-auto">
                  {user?.role}
                </span>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="justify-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link to="/login">
                <Button variant="outline" className="w-full justify-center">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="gradient" className="w-full justify-center">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export { Navbar };
