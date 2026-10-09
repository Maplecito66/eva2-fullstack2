import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function catalogo() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaURL = searchParams.get('cat') || 'todas';
  const idURL = searchParams.get('id');

  const { addToCart } = useCart();

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorBD, setErrorBD] = useState('');

  const [productoDetalle, setProductoDetalle] = useState(null);
  const [mensajeToast, setMensajeToast] = useState('');

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

    const manejarCambiosBD = () => cargarDatosBD();
    window.addEventListener('categoryChange', manejarCambiosBD);

    return () => {
      window.removeEventListener('categoryChange', manejarCambiosBD);
    };
  }, []);

  useEffect(() => {
    if (productos.length > 0 && idURL) {
      const encontrado = productos.find(p => String(p.id) === String(idURL));
      if (encontrado) {
        setProductoDetalle(encontrado);
      }
    } else if (!idURL) {
      setProductoDetalle(null);
    }
  }, [productos, idURL]);

  const formatearPrecio = (valor) => {
    const num = Number(valor) || 0;
    return num.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  };

  const handleAgregarAlPedido = async (producto) => {
    await addToCart(producto);
    setMensajeToast(`¡"${producto.nombre}" agregado al pedido!`);
    setTimeout(() => setMensajeToast(''), 3000);
  };

  const verDetalle = (prod) => {
    setProductoDetalle(prod);
    setSearchParams({ id: prod.id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const volverAlListado = () => {
    setProductoDetalle(null);
    setSearchParams({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const productosFiltrados = categoriaURL === 'todas'
    ? productos
    : productos.filter(p => p.categoria === categoriaURL);

  const obtenerRecomendados = (idActual) => {
    const disponibles = productos.filter(p => p.id !== idActual);
    return [...disponibles].sort(() => 0.5 - Math.random()).slice(0, 4);
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
      {mensajeToast && <div className="toast-notificacion">🛒 {mensajeToast}</div>}

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
                  onClick={() => handleAgregarAlPedido(productoDetalle)}
                >
                  Agregar al Pedido
                </button>
              </div>
            </div>
          </div>

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
                    onClick={() => handleAgregarAlPedido(rec)}
                  >
                    Agregar al Pedido
                  </button>
                </article>
              ))}
            </div>
          </section>
        </main>
      ) : (
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
                      onClick={() => handleAgregarAlPedido(p)}
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