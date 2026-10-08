import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('usuarioActivo');
    window.dispatchEvent(new Event('authChange'));
    navigate('/login');
  };

  return (
    <div className="d-flex flex-column p-3 text-white bg-dark shadow" style={{ width: '250px', minHeight: '100vh' }}>
      <Link to="/admin" className="d-flex align-items-center mb-4 text-white text-decoration-none">
        <span className="fs-4 fw-bold">Panel Admin</span>
      </Link>
      
      <ul className="nav nav-pills flex-column mb-auto gap-2">
        <li>
          <NavLink to="/admin" end className={({ isActive }) => `nav-link ${isActive ? 'active bg-primary' : 'text-white'}`}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/productos" className={({ isActive }) => `nav-link ${isActive ? 'active bg-primary' : 'text-white'}`}>
            Productos
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/usuarios" className={({ isActive }) => `nav-link ${isActive ? 'active bg-primary' : 'text-white'}`}>
            Usuarios
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/ordenes" className={({ isActive }) => `nav-link ${isActive ? 'active bg-primary' : 'text-white'}`}>
            Órdenes
          </NavLink>
        </li>
      </ul>
      
      <hr />
      <div className="d-flex flex-column gap-2">
        <Link to="/" className="btn btn-outline-light w-100">Ver Tienda</Link>
        <button onClick={handleLogout} className="btn btn-danger w-100">Cerrar Sesión</button>
      </div>
    </div>
  );
}