import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  // NUEVO: Efecto para escuchar cuando se redimensiona la pantalla
  useEffect(() => {
    const handleResize = () => {
      // Si la pantalla crece a tamaño PC (768px o más) y el menú móvil quedó abierto, lo cerramos.
      if (window.innerWidth >= 768 && menuAbierto) {
        setMenuAbierto(false);
      }
    };

    // Agregamos el "oyente" de eventos al navegador
    window.addEventListener('resize', handleResize);
    
    // Limpieza: quitamos el oyente cuando el componente se destruye para evitar fugas de memoria
    return () => window.removeEventListener('resize', handleResize);
  }, [menuAbierto]);

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      
      {/* 1. Menú lateral izquierdo */}
      <AdminSidebar menuAbierto={menuAbierto} toggleMenu={toggleMenu} />
      
      {/* 2. Contenedor dinámico derecho */}
      <main className="flex-grow-1 d-flex flex-column" style={{ overflowY: 'auto', maxHeight: '100vh', width: '100%' }}>
        
        {/* Barra superior visible SOLO en móviles */}
        <div className="d-md-none bg-dark text-white p-3 d-flex justify-content-between align-items-center shadow-sm sticky-top">
          <span className="fs-5 fw-bold">Panel Admin</span>
          <button onClick={toggleMenu} className="btn btn-outline-light btn-sm">
            {menuAbierto ? '✖ Cerrar' : '☰ Menú'}
          </button>
        </div>

        {/* Las pantallas (Dashboard, Productos, etc.) */}
        <div className="p-3 p-md-4 flex-grow-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}