import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';

export default function Inicio() {
  const [productosBD, setProductosBD] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/productos')
      .then((res) => res.json())
      .then((data) => setProductosBD(data))
      .catch((err) => console.error('Error al cargar productos en Inicio:', err));
  }, []);

  const obtenerIdPorNombre = (palabraClave, idPorDefecto) => {
    const encontrado = productosBD.find((p) =>
      p.nombre.toLowerCase().includes(palabraClave.toLowerCase())
    );
    return encontrado ? encontrado.id : idPorDefecto;
  };

  const idSushi = obtenerIdPorNombre('sushi', 1);
  const idCaesar = obtenerIdPorNombre('césar', 2) || obtenerIdPorNombre('cesar', 2);
  const idHamburguesa = obtenerIdPorNombre('hamburguesa', 3);

  return (
    <div className="container">
      <main className="main-content">
        <section className="hero-banner">
          <h2>¡Comida deliciosa directo a tu puerta!</h2>
          <p>Descubre nuestros platillos preparados con ingredientes frescos y locales.</p>
          <Link to="/categorias" className="btn-primary">
            Ver Menú Completo
          </Link>
        </section>

        <section className="hero-banner">
          <h2>Productos Destacados</h2>
          <p>Los platillos más pedidos este mes</p>

          <Carousel id="carouselExample">
            <Carousel.Item>
              <Link to={`/categorias?id=${idSushi}`} title="Ver detalle de Sushi">
                <img
                  className="d-block w-100 carousel-img"
                  src="/img/sushi-index.jpg" 
                  alt="Sushi destacado"
                />
              </Link>
            </Carousel.Item>

            <Carousel.Item>
              <Link to={`/categorias?id=${idCaesar}`} title="Ver detalle de Ensalada César">
                <img
                  className="d-block w-100 carousel-img"
                  src="/img/ceasar-index.jpg" 
                  alt="Ensalada César destacada"
                />
              </Link>
            </Carousel.Item>

            <Carousel.Item>
              <Link to={`/categorias?id=${idHamburguesa}`} title="Ver detalle de Hamburguesa">
                <img
                  className="d-block w-100 carousel-img"
                  src="/img/hamburguesa-index.webp" 
                  alt="Hamburguesa destacada"
                />
              </Link>
            </Carousel.Item>
          </Carousel>
        </section>
      </main>
    </div>
  );
}