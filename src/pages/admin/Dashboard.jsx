import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Dashboard() {
  // Estados para guardar las cantidades totales y controlar el spinner de carga
  const [metricas, setMetricas] = useState({ compras: 0, productos: 0, usuarios: 0 });
  const [cargando, setCargando] = useState(true); 
  
  const location = useLocation();

  // Función que trae los datos del backend para los contadores
  useEffect(() => {
    const cargarMetricas = async () => {
      setCargando(true); // Enciende el spinner
      try {
        // Promise.all ejecuta las 3 peticiones al mismo tiempo para que cargue más rápido
        const [resOrdenes, resProd, resUsu] = await Promise.all([
          fetch('http://localhost:5000/api/admin/ordenes', { cache: 'no-store' }),
          fetch('http://localhost:5000/api/admin/productos', { cache: 'no-store' }),
          fetch('http://localhost:5000/api/usuarios', { cache: 'no-store' })
        ]);
        
        // Si la respuesta es OK, la convierte a JSON. Si falla, devuelve un array vacío [].
        const ordenes = resOrdenes.ok ? await resOrdenes.json() : [];
        const productos = resProd.ok ? await resProd.json() : [];
        const usuarios = resUsu.ok ? await resUsu.json() : [];

        // Guarda en el estado la cantidad total (length) de cada tabla
        setMetricas({ compras: ordenes.length, productos: productos.length, usuarios: usuarios.length });
      } catch (error) {
        console.error("Error cargando métricas:", error);
      } finally {
        setCargando(false); // Apaga el spinner sin importar si hubo error o éxito
      }
    };
    
    cargarMetricas(); // Ejecuta la función al entrar a la pantalla
  }, [location.key]);

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h2 className="fw-bold">Dashboard</h2>
        <p className="text-muted">Resumen de las actividades diarias</p>
      </div>

      {/* --- ZONA DE TARJETAS DE MÉTRICAS --- */}
      <div className="row mb-4">
        
        {/* Tarjeta Compras */}
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-primary shadow-sm h-100">
            <div className="card-body d-flex flex-column justify-content-center align-items-center text-center">
              <h1 className="display-5 fw-bold mb-0">
                {/* Operador ternario: si 'cargando' es true dibuja el spinner, si es false dibuja el número */}
                {cargando ? <div className="spinner-border spinner-border-sm" role="status"></div> : `🛒 ${metricas.compras}`}
              </h1>
              <h5 className="card-title mt-2">Compras Totales</h5>
              <small>Probabilidad de aumento: 20%</small>
            </div>
          </div>
        </div>

        {/* Tarjeta Productos */}
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-success shadow-sm h-100">
            <div className="card-body d-flex flex-column justify-content-center align-items-center text-center">
              <h1 className="display-5 fw-bold mb-0">
                {cargando ? <div className="spinner-border spinner-border-sm" role="status"></div> : `📦 ${metricas.productos}`}
              </h1>
              <h5 className="card-title mt-2">Productos</h5>
              <small>Inventario actual</small>
            </div>
          </div>
        </div>

        {/* Tarjeta Usuarios */}
        <div className="col-md-4 mb-3">
          <div className="card text-dark bg-warning shadow-sm h-100">
            <div className="card-body d-flex flex-column justify-content-center align-items-center text-center">
              <h1 className="display-5 fw-bold mb-0">
                {cargando ? <div className="spinner-border spinner-border-sm" role="status"></div> : `👥 ${metricas.usuarios}`}
              </h1>
              <h5 className="card-title mt-2">Usuarios</h5>
              <small>Nuevos usuarios</small>
            </div>
          </div>
        </div>
      </div>

      {/* --- ZONA DE BOTONES DE NAVEGACIÓN --- */}
      <div className="row g-4">
        <TarjetaNavegacion titulo="Dashboard" icono="📊" desc="Visión general de todas las métricas." ruta="/admin" />
        <TarjetaNavegacion titulo="Órdenes" icono="🛒" desc="Seguimiento de compras." ruta="/admin/ordenes" />
        <TarjetaNavegacion titulo="Productos" icono="📦" desc="Administrar inventario." ruta="/admin/productos" />
        <TarjetaNavegacion titulo="Categorías" icono="📁" desc="Organizar productos." ruta="/admin/categorias" />
        <TarjetaNavegacion titulo="Usuarios" icono="👥" desc="Gestión de cuentas." ruta="/admin/usuarios" />
        <TarjetaNavegacion titulo="Reportes" icono="📈" desc="Informes de operaciones." ruta="/admin/reportes" />
        <TarjetaNavegacion titulo="Perfil" icono="👤" desc="Tu información personal." ruta="/admin/perfil" />
        <TarjetaNavegacion titulo="Tienda" icono="🏪" desc="Ver interfaz de cliente." ruta="/" />
      </div>
    </div>
  );
}

// Subcomponente reutilizable: Dibuja las tarjetas pequeñas de navegación de abajo
function TarjetaNavegacion({ titulo, icono, desc, ruta }) {
  return (
    <div className="col-md-3">
      <Link to={ruta} className="text-decoration-none text-dark">
        <div className="card shadow-sm h-100 text-center" style={{ cursor: 'pointer' }}>
          <div className="card-body p-4">
            <div className="fs-1 mb-2">{icono}</div>
            <h5 className="card-title fw-bold">{titulo}</h5>
            <p className="card-text text-muted small">{desc}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}