import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { usuario, logout, isAdmin } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [listaCategorias, setListaCategorias] = useState([]);
  const [menuCategoriasAbierto, setMenuCategoriasAbierto] = useState(false);

  const obtenerCategoriasBD = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/categorias');
      if (res.ok) {
        const data = await res.json();
        setListaCategorias(data);
      }
    } catch (err) {
      console.error('Error al cargar categorías desde MySQL:', err);
    }
  };

  useEffect(() => {
    obtenerCategoriasBD();

    const manejarCambioCategoria = () => obtenerCategoriasBD();
    window.addEventListener('categoryChange', manejarCambioCategoria);

    const manejarClicFuera = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuCategoriasAbierto(false);
      }
    };
    document.addEventListener('mousedown', manejarClicFuera);

    return () => {
      window.removeEventListener('categoryChange', manejarCambioCategoria);
      document.removeEventListener('mousedown', manejarClicFuera);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const irACategoria = (nombreCat) => {
    setMenuCategoriasAbierto(false);
    if (nombreCat === 'todas') {
      navigate('/categorias');
    } else {
      navigate(`/categorias?cat=${encodeURIComponent(nombreCat)}`);
    }
  };

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

            <li className="dropdown-categorias-container" ref={dropdownRef}>
              <NavLink 
                to="/categorias" 
                className={({ isActive }) => `nav-link-categorias ${isActive ? 'active' : ''}`}
                onClick={() => setMenuCategoriasAbierto(false)}
              >
                Categorías
              </NavLink>

              <button 
                type="button" 
                className="btn-flecha-dropdown"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuCategoriasAbierto(!menuCategoriasAbierto);
                }}
                title="Desplegar categorías"
              >
                ▼
              </button>

              {menuCategoriasAbierto && (
                <ul className="mini-menu-dropdown">
                  <li>
                    <button type="button" onClick={() => irACategoria('todas')}>
                      🍽️ Todas las Categorías
                    </button>
                  </li>
                  {listaCategorias.map((cat) => (
                    <li key={cat.id_categoria}>
                      <button type="button" onClick={() => irACategoria(cat.nombre_categoria)}>
                        {cat.nombre_categoria === 'pizzas-hamburguesas' && '🍕 '}
                        {cat.nombre_categoria === 'saludable' && '🥗 '}
                        {cat.nombre_categoria === 'postres' && '🍰 '}
                        {cat.nombre_categoria === 'bebidas' && '🥤 '}
                        {cat.nombre_categoria.replace('-', ' ').toUpperCase()}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
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
          🛒 Mi Pedido ({getTotalItems()})
        </Link>
      </div>

      <div className="user-subbar">
        <div className="user-links">
          {usuario ? (
            <>
              <span className="user-welcome">
                Hola, <strong>{usuario.nombre}</strong>
              </span>

              {isAdmin() && (
                <>
                  <span className="separator">|</span>
                  <Link to="/admin" className="admin-link">
                    Panel Admin
                  </Link>
                </>
              )}

              <span className="separator">|</span>
              <button 
                type="button"
                onClick={handleLogout} 
                className="btn-logout-link" 
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Iniciar sesión</Link>
              <span className="separator">|</span>
              <Link to="/registro">Crear cuenta</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}