import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="site-wrapper">
      <Navbar />
      
      {/* El contenido dinámico de cada vista se renderizará aquí */}
      <main className="container my-4">
        <Outlet />
      </main>

      <footer className="main-footer">
        <p>&copy; {new Date().getFullYear()} Sabor & Aroma. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}