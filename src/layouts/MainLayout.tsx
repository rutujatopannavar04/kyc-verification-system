import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/ui/Navbar';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export { MainLayout };
