import Sidebar from '@/components/layout/sidebar';
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

const ProtectedLayout: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState<boolean>(() => {
    const savedState = localStorage.getItem('sidebarMinimized');
    return savedState ? JSON.parse(savedState) : false;
  });

  const toggleMinimize = () => {
    setIsMinimized((prevState: boolean) => {
      const newState = !prevState;
      localStorage.setItem('sidebarMinimized', JSON.stringify(newState));
      return newState;
    });
  };

  return (
    <div className="flex transition-all duration-300">
      <Sidebar isMinimized={isMinimized} toggleMinimize={toggleMinimize} />
      <main className={`flex-1 p-2 transition-all duration-300 ${isMinimized ? 'ml-20' : 'ml-64'}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout;
