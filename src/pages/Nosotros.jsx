import React from 'react';

export default function Nosotros() {
  return (
    <div className="container">
      <main className="main-content">
        <section className="hero-banner">
          <h2>Nuestra Historia</h2>
          <p>
            En <strong>Sabor & Aroma</strong> nacimos con una misión clara: ofrecer comida artesanal preparada con pasión, ingredientes locales y de la mejor calidad. Desde nuestros inicios, nos hemos enfocado en llevar platillos frescos directo a tu mesa para crear experiencias gastronómicas memorables.
          </p>
        </section>
        
        <section className="grid-dos-columnas">
          <article className="tarjeta-nosotros">
            <h3>🎯 Nuestra Misión</h3>
            <p>
              Brindar platillos deliciosos, saludables y con recetas auténticas, garantizando una entrega rápida y un servicio al cliente excepcional en cada pedido.
            </p>
          </article>

          <article className="tarjeta-nosotros">
            <h3>👁️ Nuestra Visión</h3>
            <p>
              Convertirnos en la opción preferida de comida rápida y gourmet del sector, destacados por nuestra calidad, innovación culinaria y compromiso local.
            </p>
          </article>
        </section>

        <section className="seccion-valores">
          <h2>✨ Nuestros Valores</h2>
          <div className="grid-tres-columnas">
            <article className="tarjeta-valor">
              <h4>🌿 Frescura</h4>
              <p>Ingredientes 100% naturales y seleccionados día a día.</p>
            </article>

            <article className="tarjeta-valor">
              <h4>👨‍🍳 Pasión</h4>
              <p>Recetas creadas por chefs enfocados en el sabor real.</p>
            </article>

            <article className="tarjeta-valor">
              <h4>🚀 Rapidez</h4>
              <p>Entregas calientes y a tiempo hasta tu puerta.</p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}