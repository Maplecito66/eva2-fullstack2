import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* 1. Menú lateral izquierdo */}
      <AdminSidebar />
      
      {/* 2. Contenedor dinámico derecho para tus pantallas */}
      <main className="flex-grow-1 p-4" style={{ overflowY: 'auto', maxHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  );
}