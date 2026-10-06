import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  const cantidadCarrito = 0; // Se conectará al estado global/context más adelante

  return (
    <header className="header-container">
      <div className="main-header">
        <Link to="/" className="logo text-decoration-none">
          <span className="logo-icon">🍔</span>
          <h1>Sabor & Aroma</h1>
        </Link>

        <nav className="navbar">
          <ul>
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
                Inicio
              </NavLink>
            </li>
            <li className="separator">|</li>
            <li>
              <NavLink to="/menu" className={({ isActive }) => (isActive ? 'active' : '')}>
                Menú
              </NavLink>
            </li>
            <li className="separator">|</li>
            <li>
              <NavLink to="/nosotros" className={({ isActive }) => (isActive ? 'active' : '')}>
                Nosotros
              </NavLink>
            </li>
            <li className="separator">|</li>
            <li>
              <NavLink to="/blog" className={({ isActive }) => (isActive ? 'active' : '')}>
                Blog Culinario
              </NavLink>
            </li>
            <li className="separator">|</li>
            <li>
              <NavLink to="/contacto" className={({ isActive }) => (isActive ? 'active' : '')}>
                Contacto
              </NavLink>
            </li>
          </ul>
        </nav>

        <Link to="/carrito" className="cart-btn">
          🛒 Mi Pedido ({cantidadCarrito})
        </Link>
      </div>

      <div className="user-subbar">
        <div className="user-links">
          <Link to="/login">Iniciar sesión</Link>
          <span className="separator">|</span>
          <Link to="/registro">Crear cuenta</Link>
        </div>
      </div>
    </header>
  );
}