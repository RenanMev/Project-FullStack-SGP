// src/components/layout/ProtectedLayout.tsx
import Sidebar from '@/components/layout/sidebar';
import React from 'react';
import { Outlet } from 'react-router-dom';

const ProtectedLayout: React.FC = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main className='pl-60 flex-1'>
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout;