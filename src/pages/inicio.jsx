import React from 'react';
import { Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';

export default function Inicio() {
  return (
    <div className="container">
   
      <aside className="sidebar">
        <h3>Categorías</h3>
        <ul>
          <li><Link to="/menu?cat=todas">🍽️ Todo</Link></li>
          <li><Link to="/menu?cat=pizzas-hamburguesas">🍕 Pizzas y Hamburguesas</Link></li>
          <li><Link to="/menu?cat=saludable">🥗 Opción Saludable</Link></li>
          <li><Link to="/menu?cat=postres">🍰 Postres</Link></li>
          <li><Link to="/menu?cat=bebidas">🥤 Bebidas</Link></li>
          <li><Link to="/menu?cat=ofertas">🔥 Ofertas</Link></li>
        </ul>
      </aside>

     
      <main className="main-content">
      
        <section className="hero-banner">
          <h2>¡Comida deliciosa directo a tu puerta!</h2>
          <p>Descubre nuestros platillos preparados con ingredientes frescos y locales.</p>
          <Link to="/menu" className="btn-primary">
            Ver Menú Completo
          </Link>
        </section>

        <section className="hero-banner">
          <h2>Productos Destacados</h2>
          <p>Los platillos más pedidos este mes</p>

          <Carousel id="carouselExample">
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/img/sushi-index.jpg" 
                alt="Sushi destacado"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/img/ceasar-index.jpg" 
                alt="Ensalada César destacada"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/img/hamburguesa-index.webp" 
                alt="Hamburguesa destacada"
              />
            </Carousel.Item>
          </Carousel>
        </section>
      </main>
    </div>
  );
}