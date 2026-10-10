import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Recibe los props de AdminLayout
export default function AdminSidebar({ menuAbierto, toggleMenu }) {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  const handleLogout = () => {
    if (logout) logout();
    navigate('/login');
  };

  return (
    <>
      {/* FONDO OSCURO PARA MÓVILES: Solo aparece si el menú está abierto en pantallas pequeñas */}
      {menuAbierto && (
        <div 
          className="d-md-none position-fixed w-100 h-100 bg-dark opacity-50 z-2" 
          onClick={toggleMenu} 
          style={{ top: 0, left: 0 }}
        ></div>
      )}

      {/* MENÚ LATERAL: 
          - En escritorio (d-md-flex): Siempre visible, ocupa 250px.
          - En móviles: Oculto por defecto, se posiciona absoluto sobre el contenido al abrirse. */}
      <div 
        className={`d-flex flex-column p-3 text-white bg-dark shadow z-3 transition-transform ${menuAbierto ? 'position-fixed h-100' : 'd-none d-md-flex'}`} 
        style={{ 
          width: '250px', 
          minHeight: '100vh',
          top: 0,
          left: 0,
          overflowY: 'auto' // Permite scroll dentro del menú si la pantalla es muy pequeña
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Link to="/admin" className="text-white text-decoration-none" onClick={() => window.innerWidth < 768 && toggleMenu()}>
            <span className="fs-4 fw-bold">Panel Admin</span>
          </Link>
          {/* Botón de cierre interno para móviles */}
          <button className="btn btn-sm btn-outline-light d-md-none" onClick={toggleMenu}>✖</button>
        </div>
        
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