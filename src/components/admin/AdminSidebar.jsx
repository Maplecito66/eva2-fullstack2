import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Barra lateral de navegación del panel administrativo (recibe props para control en móviles)
export default function AdminSidebar({ menuAbierto, toggleMenu }) {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  // Cierra la sesión del usuario y lo redirige al login
  const handleLogout = () => {
    if (logout) logout();
    navigate('/login');
  };

  return (
    <>
      {/* Fondo oscuro traslúcido para móviles cuando el menú está desplegado */}
      {menuAbierto && (
        <div 
          className="d-md-none position-fixed w-100 h-100 bg-dark opacity-50 z-2" 
          onClick={toggleMenu} 
          style={{ top: 0, left: 0 }}
        ></div>
      )}

      {/* Menú lateral: fijo en escritorio y deslizable/absoluto en dispositivos móviles */}
      <div 
        className={`d-flex flex-column p-3 text-white bg-dark shadow z-3 transition-transform ${menuAbierto ? 'position-fixed h-100' : 'd-none d-md-flex'}`} 
        style={{ 
          width: '250px', 
          minHeight: '100vh',
          top: 0,
          left: 0,
          overflowY: 'auto' 
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Link to="/admin" className="text-white text-decoration-none" onClick={() => window.innerWidth < 768 && toggleMenu()}>
            <span className="fs-4 fw-bold">Panel Admin</span>
          </Link>
          {/* Botón para cerrar el menú en pantallas pequeñas */}
          <button className="btn btn-sm btn-outline-light d-md-none" onClick={toggleMenu}>✖</button>
        </div>
        
        {/* Enlaces de navegación con cambio dinámico de clase activa */}
        <ul className="nav nav-pills flex-column mb-auto gap-2">
          <li>
            <NavLink to="/admin" end className={({ isActive }) => `nav-link ${isActive ? 'active bg-primary' : 'text-white'}`} onClick={() => window.innerWidth < 768 && toggleMenu()}>
              📊 Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/ordenes" className={({ isActive }) => `nav-link ${isActive ? 'active bg-primary' : 'text-white'}`} onClick={() => window.innerWidth < 768 && toggleMenu()}>
              🛒 Órdenes
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/productos" className={({ isActive }) => `nav-link ${isActive ? 'active bg-primary' : 'text-white'}`} onClick={() => window.innerWidth < 768 && toggleMenu()}>
              📦 Productos
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/categorias" className={({ isActive }) => `nav-link ${isActive ? 'active bg-primary' : 'text-white'}`} onClick={() => window.innerWidth < 768 && toggleMenu()}>
              📁 Categorías
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/usuarios" className={({ isActive }) => `nav-link ${isActive ? 'active bg-primary' : 'text-white'}`} onClick={() => window.innerWidth < 768 && toggleMenu()}>
              👥 Usuarios
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/reportes" className={({ isActive }) => `nav-link ${isActive ? 'active bg-primary' : 'text-white'}`} onClick={() => window.innerWidth < 768 && toggleMenu()}>
              📈 Reportes
            </NavLink>
          </li>
        </ul>
        
        <hr className="text-white-50" />
        {/* Zona inferior con perfil, enlace a la tienda y cierre de sesión */}
        <div className="d-flex flex-column gap-2 mt-auto">
          <NavLink to="/admin/perfil" className={({ isActive }) => `nav-link ${isActive ? 'text-primary fw-bold mb-2' : 'text-white mb-2'}`} onClick={() => window.innerWidth < 768 && toggleMenu()}>
            👤 Mi Perfil
          </NavLink>
          <Link to="/" className="btn btn-outline-light w-100">Ver Tienda</Link>
          <button onClick={handleLogout} className="btn btn-danger w-100">Cerrar Sesión</button>
        </div>
      </div>
    </>
  );
}