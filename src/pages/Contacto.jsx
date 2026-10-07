import React, { useState, useEffect } from 'react';

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    comentario: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');

  // Sincronizar usuario activo al cargar el componente
  useEffect(() => {
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
    if (usuarioActivo) {
      setFormData((prev) => ({
        ...prev,
        nombre: usuarioActivo.nombre || '',
        email: usuarioActivo.email || ''
      }));
      setIsLoggedIn(true);
    }
  }, []);

  // Manejar cambios en los campos de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Ocultar el mensaje de error del campo que se está editando
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validación sin alertas
  const validate = () => {
    const newErrors = {};
    const nombre = formData.nombre.trim();
    const email = formData.email.trim().toLowerCase();
    const comentario = formData.comentario.trim();

    // 1. Validación de Nombre
    if (!nombre) {
      newErrors.nombre = 'El nombre completo es obligatorio.';
    } else if (nombre.length > 100) {
      newErrors.nombre = 'El nombre no puede tener más de 100 caracteres.';
    }

    // 2. Validación de Correo
    if (!email) {
      newErrors.email = 'El correo electrónico es obligatorio.';
    } else if (email.length > 100) {
      newErrors.email = 'El correo no puede tener más de 100 caracteres.';
    } else {
      const esGmail = email.endsWith('@gmail.com');
      const esDuoc = email.endsWith('@duoc.cl');
      const esProfesorDuoc = email.endsWith('@profesor.duoc.cl');

      if (!esGmail && !esDuoc && !esProfesorDuoc) {
        newErrors.email = 'Solo se permiten correos @gmail.com, @duoc.cl o @profesor.duoc.cl';
      }
    }

    // 3. Validación de Comentario
    if (!comentario) {
      newErrors.comentario = 'El comentario es obligatorio.';
    } else if (comentario.length > 500) {
      newErrors.comentario = 'El comentario no puede superar los 500 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMensajeExito('');

    if (validate()) {
      setMensajeExito('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');

      // Reiniciar comentario y mantener datos de usuario si está autenticado
      setFormData((prev) => ({
        nombre: isLoggedIn ? prev.nombre : '',
        email: isLoggedIn ? prev.email : '',
        comentario: ''
      }));
    }
  };

  return (
    <div className="container">
      <main className="main-content">
        <div className="form-card">
          <h2>Contáctanos</h2>

          {/* Mensaje global de éxito */}
          {mensajeExito && <div className="alert-success">{mensajeExito}</div>}

          <form onSubmit={handleSubmit} noValidate>
            
            {/* CAMPO NOMBRE */}
            <div className="form-group">
              <label htmlFor="nombre-contacto">NOMBRE COMPLETO</label>
              <input
                type="text"
                id="nombre-contacto"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                readOnly={isLoggedIn}
                className={`${errors.nombre ? 'input-error' : ''} ${isLoggedIn ? 'input-disabled' : ''}`}
                maxLength={100}
                placeholder="Ej. Juan Pérez"
              />
              {errors.nombre && <span className="error-message">{errors.nombre}</span>}
            </div>

            {/* CAMPO EMAIL */}
            <div className="form-group">
              <label htmlFor="email-contacto">CORREO ELECTRÓNICO</label>
              <input
                type="email"
                id="email-contacto"
                name="email"
                value={formData.email}
                onChange={handleChange}
                readOnly={isLoggedIn}
                className={`${errors.email ? 'input-error' : ''} ${isLoggedIn ? 'input-disabled' : ''}`}
                maxLength={100}
                placeholder="ejemplo@gmail.com"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            {/* CAMPO COMENTARIO */}
            <div className="form-group">
              <label htmlFor="comentario-contacto">COMENTARIO</label>
              <textarea
                id="comentario-contacto"
                name="comentario"
                rows="5"
                value={formData.comentario}
                onChange={handleChange}
                className={errors.comentario ? 'input-error' : ''}
                maxLength={500}
                placeholder="Escribe tu mensaje o consulta aquí..."
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '6px',
                  fontFamily: 'inherit'
                }}
              ></textarea>
              {errors.comentario && <span className="error-message">{errors.comentario}</span>}
            </div>

            <button type="submit" className="btn-primary form-btn">
              Enviar Mensaje
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}