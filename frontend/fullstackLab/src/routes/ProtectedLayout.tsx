import Sidebar from '@/components/layout/sidebar';
import React from 'react';
import { Outlet } from 'react-router-dom';

const ProtectedLayout: React.FC = () => {
  return (
    <div >
      <Sidebar />
      <main className='flex-1 ml-60'>
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout; 