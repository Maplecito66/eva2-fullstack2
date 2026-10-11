import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const estadoInicial = {
  nombre: '',
  email: '',
  confirmarEmail: '',
  password: '',
  confirmarPassword: '',
  telefono: '',
  region: '',
  comuna: ''
};

export default function Registro() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(estadoInicial);
  const [errors, setErrors] = useState({});
  const [mensajeToast, setMensajeToast] = useState('');
  const [errorServidor, setErrorServidor] = useState('');

  // Estados para regiones y comunas dinámicas desde la BD
  const [listaRegiones, setListaRegiones] = useState([]);
  const [listaComunas, setListaComunas] = useState([]);
  const [cargandoRegiones, setCargandoRegiones] = useState(true);

  // 1. Cargar la lista de regiones desde MySQL al montar el componente
  useEffect(() => {
    const cargarRegionesBD = async () => {
      try {
        setCargandoRegiones(true);
        const res = await fetch('http://localhost:5000/api/regiones');
        if (res.ok) {
          const data = await res.json();
          setListaRegiones(data);
        }
      } catch (err) {
        console.error('Error al obtener regiones desde la BD:', err);
      } finally {
        setCargandoRegiones(false);
      }
    };

    cargarRegionesBD();
  }, []);

  // 2. Cargar comunas asociadas cada vez que cambie la región seleccionada
  useEffect(() => {
    if (!formData.region) {
      setListaComunas([]);
      return;
    }

    const cargarComunasBD = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/comunas?region=${encodeURIComponent(formData.region)}`);
        if (res.ok) {
          const data = await res.json();
          setListaComunas(data);
        }
      } catch (err) {
        console.error('Error al obtener comunas desde la BD:', err);
      }
    };

    cargarComunasBD();
  }, [formData.region]);

  const validarCampo = (name, value, currentFormData = formData) => {
    let errorText = '';

    switch (name) {
      case 'nombre':
        if (!value.trim()) errorText = 'El nombre completo es obligatorio.';
        break;

      case 'email': {
        const emailVal = value.trim().toLowerCase();
        if (!emailVal) {
          errorText = 'El correo electrónico es obligatorio.';
        } else if (emailVal.length > 100) {
          errorText = 'El correo no puede tener más de 100 caracteres.';
        } else {
          const esGmail = emailVal.endsWith('@gmail.com');
          const esDuoc = emailVal.endsWith('@duoc.cl');
          const esProfesorDuoc = emailVal.endsWith('@profesor.duoc.cl');
          if (!esGmail && !esDuoc && !esProfesorDuoc) {
            errorText = 'Solo se permiten correos @gmail.com, @duoc.cl o @profesor.duoc.cl';
          }
        }
        break;
      }

      case 'confirmarEmail': {
        const confEmailVal = value.trim().toLowerCase();
        const mainEmailVal = currentFormData.email.trim().toLowerCase();
        if (confEmailVal !== mainEmailVal) {
          errorText = 'Los correos electrónicos no coinciden.';
        }
        break;
      }

      case 'password':
        if (!value) {
          errorText = 'La contraseña es obligatoria.';
        } else if (value.length < 4 || value.length > 10) {
          errorText = 'La contraseña debe tener entre 4 y 10 caracteres.';
        }
        break;

      case 'confirmarPassword':
        if (value !== currentFormData.password) {
          errorText = 'Las contraseñas no coinciden.';
        }
        break;

      case 'region':
        if (!value) errorText = 'Por favor seleccione una región.';
        break;

      case 'comuna':
        if (!value) errorText = 'Por favor seleccione una comuna.';
        break;

      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorText
    }));

    return errorText;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };

    if (name === 'region') {
      newFormData.comuna = '';
      setErrors((prev) => ({ ...prev, comuna: '' }));
    }

    setFormData(newFormData);
    validarCampo(name, value, newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorServidor('');

    let nuevosErrores = {};
    Object.keys(formData).forEach((campo) => {
      if (campo !== 'telefono') {
        const err = validarCampo(campo, formData[campo], formData);
        if (err) nuevosErrores[campo] = err;
      }
    });

    if (Object.keys(nuevosErrores).length > 0) return;

    const emailLimpio = formData.email.trim().toLowerCase();
    
    // Asignar rol Administrador si el correo termina en @profesor.duoc.cl
    const esAdministradorRol = emailLimpio.endsWith('@profesor.duoc.cl') ? 1 : 0;

    const nuevoUsuario = {
      nombre: formData.nombre.trim(),
      email: emailLimpio,
      password: formData.password,
      telefono: formData.telefono,
      region: formData.region,
      comuna: formData.comuna,
      esadmin: esAdministradorRol
    };

    try {
      const response = await fetch('http://localhost:5000/api/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoUsuario)
      });

      const data = await response.json();

      if (response.ok) {
        const tipoCuenta = esAdministradorRol === 1 ? 'Administrador' : 'Cliente';
        setMensajeToast(`🎉 ¡Registro exitoso como ${tipoCuenta}! Redirigiendo a Iniciar Sesión...`);
        setFormData(estadoInicial);
        setErrors({});
        setTimeout(() => {
          navigate('/login');
        }, 2200);
      } else {
        setErrorServidor(data.error || 'Ocurrió un error al registrar.');
      }
    } catch (error) {
      console.error('Error de red:', error);
      setErrorServidor('No se pudo conectar con el servidor backend.');
    }
  };

  return (
    <div className="login-wrapper">
      {mensajeToast && <div className="toast-notificacion toast-exito">{mensajeToast}</div>}

      <div className="login-card-split login-card-wide">
        
        {/* Columna Izquierda: Imagen Gastronómica */}
        <div className="login-image-side">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80" 
            alt="Únete a Sabor & Aroma" 
          />
          <div className="login-image-overlay">
            <h3>¡Únete a Sabor & Aroma!</h3>
            <p>Crea tu cuenta para realizar pedidos de forma rápida, guardar tu dirección y acceder a promociones exclusivas.</p>
          </div>
        </div>

        {/* Columna Derecha: Formulario de Registro */}
        <div className="login-form-side login-form-side-padded">
          <h2 className="form-title-centered">
            Registro de Usuario
          </h2>

          {errorServidor && <div className="alert-error">{errorServidor}</div>}

          <form onSubmit={handleSubmit} noValidate>
            
            {/* NOMBRE COMPLETO */}
            <div className="form-group">
              <label htmlFor="nombre">NOMBRE COMPLETO</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                className={`form-input-dark ${errors.nombre ? 'input-error' : ''}`}
                value={formData.nombre}
                onChange={handleChange}
              />
              {errors.nombre && (
                <span className="error-message error-message-block">
                  {errors.nombre}
                </span>
              )}
            </div>

            {/* CORREO */}
            <div className="form-group">
              <label htmlFor="email">CORREO</label>
              <input
                type="email"
                id="email"
                name="email"
                maxLength={110}
                className={`form-input-dark ${errors.email ? 'input-error' : ''}`}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <span className="error-message error-message-block">
                  {errors.email}
                </span>
              )}
            </div>

            {/* CONFIRMAR CORREO */}
            <div className="form-group">
              <label htmlFor="confirmarEmail">CORREO (Confirmación)</label>
              <input
                type="email"
                id="confirmarEmail"
                name="confirmarEmail"
                maxLength={110}
                className={`form-input-dark ${errors.confirmarEmail ? 'input-error' : ''}`}
                value={formData.confirmarEmail}
                onChange={handleChange}
              />
              {errors.confirmarEmail && (
                <span className="error-message error-message-block">
                  {errors.confirmarEmail}
                </span>
              )}
            </div>

            {/* CONTRASEÑA */}
            <div className="form-group">
              <label htmlFor="password">CONTRASEÑA</label>
              <input
                type="password"
                id="password"
                name="password"
                maxLength={10}
                className={`form-input-dark ${errors.password ? 'input-error' : ''}`}
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <span className="error-message error-message-block">
                  {errors.password}
                </span>
              )}
            </div>

            {/* CONFIRMAR CONTRASEÑA */}
            <div className="form-group">
              <label htmlFor="confirmarPassword">CONFIRMAR CONTRASEÑA</label>
              <input
                type="password"
                id="confirmarPassword"
                name="confirmarPassword"
                maxLength={10}
                className={`form-input-dark ${errors.confirmarPassword ? 'input-error' : ''}`}
                value={formData.confirmarPassword}
                onChange={handleChange}
              />
              {errors.confirmarPassword && (
                <span className="error-message error-message-block">
                  {errors.confirmarPassword}
                </span>
              )}
            </div>

            {/* TELÉFONO */}
            <div className="form-group">
              <label htmlFor="telefono">TELÉFONO (opcional)</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                className="form-input-dark"
                value={formData.telefono}
                onChange={handleChange}
              />
            </div>

            {/* REGIÓN Y COMUNA DESDE MYSQL */}
            <div className="form-row-flex">
              <div className="form-group form-group-flex">
                <label htmlFor="region">Región</label>
                <select
                  id="region"
                  name="region"
                  className={`form-input-dark ${errors.region ? 'input-error' : ''}`}
                  value={formData.region}
                  onChange={handleChange}
                  disabled={cargandoRegiones}
                >
                  <option value="" className="select-option-dark">
                    {cargandoRegiones ? 'Cargando regiones...' : '-- Seleccione la región --'}
                  </option>
                  {listaRegiones.map((reg) => {
                    const nombreReg = typeof reg === 'string' ? reg : reg.nombre_region || reg.nombre;
                    return (
                      <option key={reg.id_region || nombreReg} value={nombreReg} className="select-option-dark">
                        {nombreReg}
                      </option>
                    );
                  })}
                </select>
                {errors.region && (
                  <span className="error-message error-message-block">
                    {errors.region}
                  </span>
                )}
              </div>

              <div className="form-group form-group-flex">
                <label htmlFor="comuna">Comuna</label>
                <select
                  id="comuna"
                  name="comuna"
                  className={`form-input-dark ${errors.comuna ? 'input-error' : ''}`}
                  value={formData.comuna}
                  onChange={handleChange}
                  disabled={!formData.region || listaComunas.length === 0}
                >
                  <option value="" className="select-option-dark">-- Seleccione la comuna --</option>
                  {listaComunas.map((com) => {
                    const nombreCom = typeof com === 'string' ? com : com.nombre_comuna || com.nombre;
                    return (
                      <option key={com.id_comuna || nombreCom} value={nombreCom} className="select-option-dark">
                        {nombreCom}
                      </option>
                    );
                  })}
                </select>
                {errors.comuna && (
                  <span className="error-message error-message-block">
                    {errors.comuna}
                  </span>
                )}
              </div>
            </div>

            <button type="submit" className="btn-primary form-btn">
              Registrarse
            </button>
          </form>

          <p className="form-footer-text">
            ¿Ya tienes una cuenta? <Link to="/login" className="link-bold-primary">Inicia sesión aquí</Link>
          </p>
        </div>

      </div>
    </div>
  );
}