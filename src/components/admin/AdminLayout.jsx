import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

// Layout principal del panel de administración (gestiona la estructura y el menú móvil)
export default function AdminLayout() {
  const [menuAbierto, setMenuAbierto] = useState(false); // Controla si el menú lateral está abierto en móviles

  // Alterna el estado del menú entre abierto y cerrado
  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  // Cierra automáticamente el menú móvil si la pantalla se agranda a tamaño de escritorio
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && menuAbierto) {
        setMenuAbierto(false);
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Limpia el evento al desmontar el componente para evitar fugas de memoria
    return () => window.removeEventListener('resize', handleResize);
  }, [menuAbierto]);

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      
      {/* 1. Barra lateral de navegación izquierda */}
      <AdminSidebar menuAbierto={menuAbierto} toggleMenu={toggleMenu} />
      
      {/* 2. Contenedor principal derecho */}
      <main className="flex-grow-1 d-flex flex-column" style={{ overflowY: 'auto', maxHeight: '100vh', width: '100%' }}>
        
        {/* Barra superior visible únicamente en pantallas pequeñas (móviles) */}
        <div className="d-md-none bg-dark text-white p-3 d-flex justify-content-between align-items-center shadow-sm sticky-top">
          <span className="fs-5 fw-bold">Panel Admin</span>
          <button onClick={toggleMenu} className="btn btn-outline-light btn-sm">
            {menuAbierto ? '✖ Cerrar' : '☰ Menú'}
          </button>
        </div>

        {/* Contenedor dinámico donde se renderizan las sub-vistas (Dashboard, Productos, etc.) */}
        <div className="p-3 p-md-4 flex-grow-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}