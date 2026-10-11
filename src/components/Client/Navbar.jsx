import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { usuario, cerrarSesion, esAdministrador } = useAuth();
  const { obtenerTotalItems } = useCart();
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);
  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const dropdownRef = useRef(null);

  // Consultar categorías a la base de datos
  const cargarCategorias = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/categorias');
      if (res.ok) {
        const data = await res.json();
        setCategorias(data);
      }
    } catch (err) {
      console.error('Error al consultar categorías en el Navbar:', err);
    }
  };

  useEffect(() => {
    cargarCategorias();

    const manejarCambioCategorias = () => cargarCategorias();
    window.addEventListener('categoryChange', manejarCambioCategorias);

    // Cierra el menú desplegable cuando se hace clic fuera del elemento
    const manejarClicFuera = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownAbierto(false);
      }
    };
    document.addEventListener('mousedown', manejarClicFuera);

    return () => {
      window.removeEventListener('categoryChange', manejarCambioCategorias);
      document.removeEventListener('mousedown', manejarClicFuera);
    };
  }, []);

  const handleLogout = () => {
    cerrarSesion();
    navigate('/');
  };

  const handleSeleccionarCategoria = (nombreCat) => {
    setDropdownAbierto(false);
    if (nombreCat) {
      navigate(`/categorias?cat=${encodeURIComponent(nombreCat)}`);
    } else {
      navigate('/categorias');
    }
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownAbierto((prev) => !prev);
  };

  return (
    <>
      <header className="main-header">
        <div className="logo">
            <span className="logo-icon">🍔</span>
            <h1>Sabor & Aroma</h1>
        </div>

        <nav className="navbar">
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li className="separator">|</li>

            {/* Menú Desplegable con Clic Fijo en la Flecha */}
            <li className="dropdown-categorias-container" ref={dropdownRef}>
              <Link to="/categorias" className="nav-link-categorias">
                Categorías
              </Link>
              <button 
                type="button" 
                className="btn-flecha-dropdown"
                onClick={toggleDropdown}
                title="Desplegar categorías"
              >
                ▼
              </button>

              {dropdownAbierto && (
                <ul className="mini-menu-dropdown">
                  <li>
                    <button type="button" onClick={() => handleSeleccionarCategoria('')}>
                      🍽️ Todas las Categorías
                    </button>
                  </li>
                  {categorias.map((cat) => (
                    <li key={cat.id_categoria}>
                      <button type="button" onClick={() => handleSeleccionarCategoria(cat.nombre_categoria)}>
                        {cat.nombre_categoria}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li className="separator">|</li>
            <li><Link to="/ofertas">Ofertas</Link></li>
            <li className="separator">|</li>
            <li><Link to="/nosotros">Nosotros</Link></li>
            <li className="separator">|</li>
            <li><Link to="/blog">Blog Culinario</Link></li>
            <li className="separator">|</li>
            <li><Link to="/contacto">Contacto</Link></li>

            <li>
              <Link to="/carrito" className="cart-btn">
                🛒 Mi Pedido ({obtenerTotalItems()})
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <div className="user-subbar">
        <div className="user-links">
          {usuario ? (
            <>
              <span className="user-welcome">Hola, <strong>{usuario.nombre}</strong></span>
              <span className="separator">|</span>
              {esAdministrador() && (
                <>
                  <Link to="/admin" className="admin-link">⚙️ Panel Administrador</Link>
                  <span className="separator">|</span>
                </>
              )}
              <button type="button" onClick={handleLogout} className="btn-logout-link">
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
    </>
  );
}