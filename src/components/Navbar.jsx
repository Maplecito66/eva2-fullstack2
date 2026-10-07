import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const cantidadCarrito = 0;

  // Función para obtener los datos del usuario activo en localStorage
  const cargarUsuario = () => {
    const usuarioGuardado = localStorage.getItem('usuarioActivo');
    if (usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch (error) {
        console.error('Error al parsear el usuario:', error);
        setUsuario(null);
      }
    } else {
      setUsuario(null);
    }
  };

  useEffect(() => {
    // Carga inicial al montar el Navbar
    cargarUsuario();

    // Escucha el evento personalizado enviado desde Login o Registro
    window.addEventListener('authChange', cargarUsuario);

    return () => {
      window.removeEventListener('authChange', cargarUsuario);
    };
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('usuarioActivo');
    window.dispatchEvent(new Event('authChange'));
    navigate('/login');
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
          {usuario ? (
            <>
              <span className="user-welcome">
                Hola, <strong>{usuario.nombre}</strong>
              </span>

              {/* Si es administrador, se muestra enlace a su Panel */}
              {usuario.esAdmin && (
                <>
                  <span className="separator">|</span>
                  <Link to="/admin/dashboard" className="admin-link">
                    Panel Admin
                  </Link>
                </>
              )}

              <span className="separator">|</span>

              <button onClick={handleLogout} className="btn-logout-link">
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