import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/ui/Sidebar';
import { cn } from '@/lib/utils';

const DashboardLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      
      <main
        className={cn(
          'min-h-screen transition-all duration-300 p-6',
          isCollapsed ? 'ml-16' : 'ml-64'
        )}
      >
        <div className="max-w-7xl mx-auto animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export { DashboardLayout };
