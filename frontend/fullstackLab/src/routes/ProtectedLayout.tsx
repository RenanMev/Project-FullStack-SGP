import Sidebar from '@/components/layout/sidebar';
import React from 'react';
import { Outlet } from 'react-router-dom';

const ProtectedLayout: React.FC = () => {
  return (
    <div >
      <Sidebar />
      <main className='flex-1 xl:ml-60 md:ml-0 p-2'>
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout; 