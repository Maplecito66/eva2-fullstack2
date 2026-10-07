import React, { useState } from 'react';

export default function Blog() {
  // Estado para controlar la vista (null: Lista principal, 1: Noticia Pizza, 2: Noticia Frappés)
  const [articuloActivo, setArticuloActivo] = useState(null);

  // Función para cambiar de vista y subir automáticamente al inicio de la página
  const cambiarArticulo = (id) => {
    setArticuloActivo(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container">
      <main className="main-content">
        

        {articuloActivo === 1 && (
          <>
            <div className="back-container">
              <button 
                onClick={() => cambiarArticulo(null)} 
                className="btn-volver-blog"
              >
                ← Volver a Noticias y Eventos
              </button>
            </div>

            <article className="hero-banner detalle-articulo">
              <h2>🔥 "La Noche del Queso Infinito": Gran Lanzamiento de la Pizza con Borde Relleno</h2>
              <p className="subtitulo-fecha">Evento Exclusivo: Viernes 15 de Octubre en Sabor & Aroma</p>
              
              <div className="blog-img-detalle">
                <img 
                  src="img/pizza-relleno.jpg" 
                  alt="Pizza Borde Relleno Mozzarella" 
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/800x320?text=Pizza+Borde+Relleno'; }} 
                />
              </div>

              <h3>Una revolución quesera llega a nuestra cocina artesanal</h3>
              <p>
                En <strong>Sabor & Aroma</strong> nos apasiona la innovación culinaria y queremos invitar a toda nuestra comunidad a un evento gastronómico sin precedentes en nuestro local. Tras meses de pruebas y perfeccionamiento en nuestra cocina experimental, estamos listos para presentar oficialmente nuestra más reciente creación: la auténtica <em>Pizza Artesanal con Borde Relleno de Queso Mozzarella fundido y Especias Finas</em>. Cada rebanada combina una masa de fermentación lenta de 48 horas con una corteza dorada y crujiente por fuera, pero completamente desbordante de queso hilado caliente por dentro, logrando una textura inigualable desde el primer bocado hasta el último pedazo del borde.
              </p>

              <h3>Detalles de la Jornada e Ingredientes Selección</h3>
              <p>
                Para celebrar esta gran incorporación a nuestra carta, realizaremos la tan esperada <strong>"Noche del Queso Infinito"</strong>, una velada de inauguración en la que los asistentes podrán disfrutar de degustaciones guiadas por nuestro maestro pizzero, maridajes sugeridos y sorpresas exclusivas. Nuestra receta utiliza exclusivamente queso mozzarella 100% natural de fundido denso, sazonado con un toque secreto de orégano silvestre, ajo asado y aceite de oliva extra virgen. Además, todas las pizzas con borde relleno servidas durante la noche del evento vendrán acompañadas sin costo adicional de nuestra salsa dipping especial de la casa.
              </p>

              <h3>¿Cómo participar y obtener beneficios exclusivos?</h3>
              <ul className="lista-sabores">
                <li><strong>Horario del evento:</strong> La cita comenzará a partir de las 19:00 hrs en nuestro salón principal.</li>
                <li><strong>Entrada y Aforo:</strong> Acceso libre por orden de llegada hasta completar la capacidad del local.</li>
                <li><strong>Beneficio Digital:</strong> Aquellos clientes registrados que envíen sus datos a través de nuestro formulario de contacto recibirán un cupón digital con un 20% de descuento directo para su próxima compra online.</li>
              </ul>

              <p className="blog-nota-final">
                No dejes pasar la oportunidad de vivir esta experiencia única en compañía de amigos y familia. ¡Te esperamos para compartir una noche inolvidable repleta de sabor y pasión gastronómica!
              </p>

              <div className="blog-cta-container">
                <a href="/contacto" className="btn-primary">
                  ¡Reserva tu cupón en Contacto!
                </a>
              </div>
            </article>
          </>
        )}


        {articuloActivo === 2 && (
          <>
            <div className="back-container">
              <button 
                onClick={() => cambiarArticulo(null)} 
                className="btn-volver-blog"
              >
                ← Volver a Noticias y Eventos
              </button>
            </div>

            <article className="hero-banner detalle-articulo">
              <h2>🥤 "Frappé Fest": Estreno Oficial de Nuestra Nueva Línea de Bebidas Heladas</h2>
              <p className="subtitulo-fecha">Lanzamiento de Primavera: Sábado 23 de Octubre en Sabor & Aroma</p>
              
              <div className="blog-img-detalle">
                <img 
                  src="img/frapescaseros.webp" 
                  alt="Frappés Artesanales de Temporada" 
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/800x320?text=Frappes+Artesanales'; }} 
                />
              </div>

              <h3>Refresca tus tardes con recetas indulgentes y café de especialidad</h3>
              <p>
                Con la llegada de las tardes cálidas y soleadas, en <strong>Sabor & Aroma</strong> queremos renovar nuestra oferta con una propuesta dulce, helada y llena de energía. Nos complace anunciar el lanzamiento del festival <strong>"Frappé Fest"</strong>, donde presentaremos nuestra nueva carta de <em>Frappés Artesanales de Temporada</em>: una selección de bebidas frías cuidadosamente diseñadas para deleitar a los amantes del buen café y los postres líquidos. Elaborados con granos de café arábica de tostado medio, leches cremosas y jarabes preparados diariamente en nuestra barra, cada vaso se sirve sobre una presentación especial con una generosa corona de crema batida, salsa de chocolate amargo y trozos crujientes.
              </p>

              <h3>Conoce las variedades creadas por nuestros baristas</h3>
              <p>
                Durante el fin de semana de estreno, los asistentes podrán degustar en primicia las tres recetas estrella preparadas en barra en tiempo real:
              </p>

              <ul className="lista-sabores">
                <li><strong>Moka Caramelo Crunch:</strong> Base helada de espresso arábica, salsa dulce de caramelo, baño de fudge de chocolate y trozos de galleta artesanal crujiente.</li>
                <li><strong>Matcha Vainilla Ice:</strong> Té matcha orgánico seleccionado batido a temperatura helada con jarabe de vainilla natural y textura de crema suave.</li>
                <li><strong>Choco-Aromas Speziato:</strong> Fusión cremosa de cacao amargo con matices sutiles de canela de ceilán, avellanas tostadas y virutas de chocolate en copa.</li>
              </ul>

              <h3>Promoción Exclusiva 2x1 durante el Evento</h3>
              <p>
                Durante toda la jornada del sábado de lanzamiento, por la compra de cualquiera de nuestros platos o promociones del menú principal, podrás llevarte tu frappé favorito con un <strong>2x1 especial</strong> para compartir con quien tú quieras. Además, realizaremos sorteos en vivo y regalería de souvenirs gastronómicos entre quienes compartan su foto en el local etiquetando nuestras redes oficiales.
              </p>

              <div className="blog-cta-container">
                <a href="/contacto" className="btn-primary">
                  ¡Haz tus consultas en Contacto!
                </a>
              </div>
            </article>
          </>
        )}

        {articuloActivo === null && (
          <>
            <h2 className="blog-titulo-seccion">NOTICIAS Y PRÓXIMOS EVENTOS</h2>

            <article className="hero-banner blog-card">
              <div className="blog-info">
                <h2>🔥 EVENTO: LA NOCHE DEL QUESO INFINITO</h2>
                <p>
                  ¡Se acerca el lanzamiento más esperado del año! Ven a descubrir nuestra masa artesanal rellena con queso mozzarella fundido desbordante y especias finas. Conoce la fecha oficial, beneficios exclusivos e información del evento aquí.
                </p>
                <button 
                  onClick={() => cambiarArticulo(1)} 
                  className="btn-primary btn-blog-accion"
                >
                  MÁS INFORMACIÓN Y DETALLES
                </button>
              </div>
              <div className="blog-img">
                <img 
                  src="img/pizza-relleno.jpg" 
                  alt="Próximamente Pizza" 
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x250?text=Proximamente+Pizza'; }} 
                />
              </div>
            </article>

            <article className="hero-banner blog-card">
              <div className="blog-info">
                <h2>🥤 EVENTO: FRAPPÉ FEST DE TEMPORADA</h2>
                <p>
                  Celebra la llegada de la primavera con nuestras nuevas combinaciones de café de especialidad, crema batida y toppings crujientes. ¡Entérate de nuestra promoción 2x1 de lanzamiento y sorpresas del festival!
                </p>
                <button 
                  onClick={() => cambiarArticulo(2)} 
                  className="btn-primary btn-blog-accion"
                >
                  MÁS INFORMACIÓN Y DETALLES
                </button>
              </div>
              <div className="blog-img">
                <img 
                  src="img/frapescaseros.webp" 
                  alt="Próximamente Frappé" 
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x250?text=Proximamente+Frappe'; }} 
                />
              </div>
            </article>
          </>
        )}

      </main>
    </div>
  );
}