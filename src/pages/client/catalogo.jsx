import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function catalogo() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaURL = searchParams.get('cat') || 'todas';

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorBD, setErrorBD] = useState('');

  // Estado para la vista de detalle del producto
  const [productoDetalle, setProductoDetalle] = useState(null);
  const [mensajeToast, setMensajeToast] = useState('');

  // Cargar datos desde la Base de Datos MySQL
  const cargarDatosBD = async () => {
    try {
      setCargando(true);
      setErrorBD('');

      const [resProd, resCat] = await Promise.all([
        fetch('http://localhost:5000/api/productos'),
        fetch('http://localhost:5000/api/categorias')
      ]);

      if (!resProd.ok || !resCat.ok) {
        throw new Error('Error de comunicación con el servidor.');
      }

      const dataProd = await resProd.json();
      const dataCat = await resCat.json();

      setProductos(dataProd);
      setCategorias(dataCat);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setErrorBD('No se pudo conectar con la base de datos para cargar el menú.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatosBD();

    // Reconsultar base de datos automáticamente si el administrador realiza cambios
    const manejarCambiosBD = () => cargarDatosBD();
    window.addEventListener('categoryChange', manejarCambiosBD);

    return () => {
      window.removeEventListener('categoryChange', manejarCambiosBD);
    };
  }, []);

  // Formateador de precios en CLP
  const formatearPrecio = (valor) => {
    const num = Number(valor) || 0;
    return num.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  };

  // Agregar al carrito (BD si hay usuario logueado, localStorage si es invitado)
  const agregarAlCarrito = async (producto) => {
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

    if (usuarioActivo && usuarioActivo.id) {
      try {
        const response = await fetch('http://localhost:5000/api/carrito', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usuario_id: usuarioActivo.id,
            producto_id: producto.id,
            cantidad: 1
          })
        });

        if (!response.ok) throw new Error('Error al guardar en el carrito de BD');

        setMensajeToast(`¡"${producto.nombre}" guardado en tu pedido (BD)!`);
      } catch (err) {
        console.error(err);
        setMensajeToast('Error al guardar en la base de datos.');
      }
    } else {
      let carrito = JSON.parse(localStorage.getItem('carritoCompras')) || [];
      let enCarrito = carrito.find(item => item.id === producto.id);

      if (enCarrito) {
        enCarrito.cantidad += 1;
      } else {
        carrito.push({
          id: producto.id,
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: Number(producto.precio),
          imagen: producto.imagen,
          cantidad: 1
        });
      }

      localStorage.setItem('carritoCompras', JSON.stringify(carrito));
      setMensajeToast(`¡"${producto.nombre}" agregado al pedido!`);
    }

    // Disparar evento para refrescar el contador en el Header
    window.dispatchEvent(new Event('cartChange'));
    window.dispatchEvent(new Event('authChange'));

    setTimeout(() => setMensajeToast(''), 3000);
  };

  // Navegar a la vista de detalle de un producto
  const verDetalle = (prod) => {
    setProductoDetalle(prod);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Volver al listado general de productos
  const volverAlListado = () => {
    setProductoDetalle(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtrado de productos según la categoría seleccionada
  const productosFiltrados = categoriaURL === 'todas'
    ? productos
    : productos.filter(p => p.categoria === categoriaURL);

  // Generar 3 productos aleatorios para la sección "También te podría gustar"[cite: 6, 7]
  const obtenerRecomendados = (idActual) => {
    const disponibles = productos.filter(p => p.id !== idActual);
    return [...disponibles].sort(() => 0.5 - Math.random()).slice(0, 3);
  };

  if (cargando) {
    return (
      <div className="container">
        <main className="main-content" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h2>Cargando productos de la base de datos...</h2>
        </main>
      </div>
    );
  }

  if (errorBD) {
    return (
      <div className="container">
        <main className="main-content" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div className="alert-error" style={{ display: 'inline-block' }}>{errorBD}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Toast Informativo sin alert() */}
      {mensajeToast && <div className="toast-notificacion">🛒 {mensajeToast}</div>}

      {/* =========================================================
          VISTA 1: DETALLE DEL PRODUCTO
         ========================================================= */}
      {productoDetalle ? (
        <main className="main-content" style={{ width: '100%' }}>
          <div className="back-container" style={{ marginBottom: '1.5rem' }}>
            <button onClick={volverAlListado} className="btn-volver-blog">
              ← Volver al Menú
            </button>
          </div>

          <div className="detalle-container">
            <div className="detalle-imagen">
              <img 
                src={productoDetalle.imagen} 
                alt={productoDetalle.nombre}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen'; }} 
              />
            </div>
            <div className="detalle-info">
              <h2>{productoDetalle.nombre}</h2>
              <span className="precio">{formatearPrecio(productoDetalle.precio)}</span>
              {productoDetalle.porcentaje_descuento && (
                <span className="badge-oferta">
                  {productoDetalle.porcentaje_descuento}% OFF
                </span>
              )}
              <p>{productoDetalle.descripcion}</p>
              <div>
                <button 
                  className="btn-primary" 
                  onClick={() => agregarAlCarrito(productoDetalle)}
                >
                  Agregar al Pedido
                </button>
              </div>
            </div>
          </div>

          {/* SECCIÓN DE RECOMENDADOS */}
          <section className="productos-recomendados" style={{ marginTop: '3rem' }}>
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', textAlign: 'center' }}>
              También te podría gustar
            </h3>
            <div className="productos-grid">
              {obtenerRecomendados(productoDetalle.id).map((rec) => (
                <article key={rec.id} className="hero-banner">
                  <img 
                    src={rec.imagen} 
                    alt={rec.nombre} 
                    onClick={() => verDetalle(rec)}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Sin+Imagen'; }}
                    style={{ cursor: 'pointer' }}
                  />
                  <h3 onClick={() => verDetalle(rec)} style={{ cursor: 'pointer' }}>
                    {rec.nombre}
                  </h3>
                  <p className="precio">{formatearPrecio(rec.precio)}</p>
                  <button 
                    className="btn-primary" 
                    onClick={() => agregarAlCarrito(rec)}
                  >
                    Agregar al Pedido
                  </button>
                </article>
              ))}
            </div>
          </section>
        </main>
      ) : (

        /* =========================================================
            VISTA 2: LISTADO GENERAL Y SIDEBAR DE CATEGORÍAS
           ========================================================= */
        <>
          <aside className="sidebar">
            <h3>Categorías</h3>
            <ul>
              <li>
                <a 
                  href="#" 
                  className={categoriaURL === 'todas' ? 'active' : ''}
                  onClick={(e) => { e.preventDefault(); setSearchParams({}); }}
                >
                  🍽️ Todo
                </a>
              </li>
              {categorias.map((cat) => (
                <li key={cat.id_categoria}>
                  <a 
                    href="#" 
                    className={categoriaURL === cat.nombre_categoria ? 'active' : ''}
                    onClick={(e) => { 
                      e.preventDefault(); 
                      setSearchParams({ cat: cat.nombre_categoria }); 
                    }}
                  >
                    {cat.nombre_categoria === 'pizzas-hamburguesas' && '🍕 Pizzas y Hamburguesas'}
                    {cat.nombre_categoria === 'saludable' && '🥗 Opción Saludable'}
                    {cat.nombre_categoria === 'postres' && '🍰 Postres'}
                    {cat.nombre_categoria === 'bebidas' && '🥤 Bebidas'}
                    {!['pizzas-hamburguesas', 'saludable', 'postres', 'bebidas'].includes(cat.nombre_categoria) && 
                      cat.nombre_categoria.replace('-', ' ')}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          <main className="main-content">
            <h2>Nuestro Menú Gastronómico</h2>

            <div className="productos-grid">
              {productosFiltrados.length === 0 ? (
                <p>No hay productos disponibles en esta categoría.</p>
              ) : (
                productosFiltrados.map((p) => (
                  <article key={p.id} className="hero-banner">
                    {/* Al presionar la imagen o el título se abre la vista de detalle[cite: 7] */}
                    <img 
                      src={p.imagen} 
                      alt={p.nombre} 
                      onClick={() => verDetalle(p)}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Sin+Imagen'; }}
                      style={{ cursor: 'pointer' }}
                    />
                    <h3 onClick={() => verDetalle(p)} style={{ cursor: 'pointer' }}>
                      {p.nombre}
                    </h3>
                    <p className="precio">{formatearPrecio(p.precio)}</p>
                    <button 
                      className="btn-primary" 
                      onClick={() => agregarAlCarrito(p)}
                    >
                      Agregar al Pedido
                    </button>
                  </article>
                ))
              )}
            </div>
          </main>
        </>
      )}
    </div>
  );
}