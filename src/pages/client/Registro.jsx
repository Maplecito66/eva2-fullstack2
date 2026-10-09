import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const regionesYComunas = {
  "Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
  "Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
  "Antofagasta": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"],
  "Atacama": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"],
  "Coquimbo": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"],
  "Valparaíso": ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Algarrobo", "El Quisco", "El Tabo", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María", "Quilpué", "Limache", "Olmué", "Villa Alemana"],
  "Región Metropolitana de Santiago": ["Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Santiago", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"],
  "O'Higgins": ["Rancagua", "Codegua", "Coinco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchigüe", "Navidad", "Paredones", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"],
  "Maule": ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "San Javier", "Villa Alegre", "Yerbas Buenas"],
  "Ñuble": ["Chillán", "Bulnes", "Cobquecura", "Coelemu", "Coihueco", "Chillán Viejo", "El Carmen", "Ninhue", "Ñiquén", "Pemuco", "Pinto", "Portezuelo", "Quillón", "Quirihue", "Ranquil", "San Carlos", "San Fabián", "San Ignacio", "San Nicolás", "Treguaco", "Yungay"],
  "Bío Bío": ["Concepción", "Coronel", "Chiguayante", "Florida", "Graneros", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío"],
  "Araucanía": ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre Las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"],
  "Los Ríos": ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"],
  "Los Lagos": ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena"],
  "Aysén": ["Coyhaique", "Lago Verde", "Aysén", "Cisnes", "Guaitecas", "Cochrane", "O'Higgins", "Tortel", "Chile Chico", "Río Ibáñez"],
  "Magallanes": ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos", "Antártica", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"]
};

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

  const inputStyle = {
    color: '#1a1a1a',
    backgroundColor: '#ffffff'
  };

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

    let nuevosErrores = {};
    Object.keys(formData).forEach((campo) => {
      if (campo !== 'telefono') {
        const err = validarCampo(campo, formData[campo], formData);
        if (err) nuevosErrores[campo] = err;
      }
    });

    if (Object.keys(nuevosErrores).length > 0) return;

    const nuevoUsuario = {
      nombre: formData.nombre.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      region: formData.region,
      comuna: formData.comuna
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
        alert('¡Registro exitoso! Guardado en la base de datos.');
        setFormData(estadoInicial);
        setErrors({});
        navigate('/login');
      } else {
        alert(data.error || 'Ocurrió un error al registrar.');
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('No se pudo conectar con el servidor backend.');
    }
  };

  return (
    <div className="container">
      <main className="main-content">
        <div className="form-card">
          <h2>Registro de usuario</h2>
          <form onSubmit={handleSubmit} noValidate>
            
            {/* NOMBRE COMPLETO */}
            <div className="form-group">
              <label htmlFor="nombre">NOMBRE COMPLETO</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                style={inputStyle}
                className={errors.nombre ? 'error' : ''}
                value={formData.nombre}
                onChange={handleChange}
              />
              {errors.nombre && (
                <span className="error-message" style={{ display: 'block' }}>
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
                style={inputStyle}
                className={errors.email ? 'error' : ''}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <span className="error-message" style={{ display: 'block' }}>
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
                style={inputStyle}
                className={errors.confirmarEmail ? 'error' : ''}
                value={formData.confirmarEmail}
                onChange={handleChange}
              />
              {errors.confirmarEmail && (
                <span className="error-message" style={{ display: 'block' }}>
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
                style={inputStyle}
                className={errors.password ? 'error' : ''}
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <span className="error-message" style={{ display: 'block' }}>
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
                style={inputStyle}
                className={errors.confirmarPassword ? 'error' : ''}
                value={formData.confirmarPassword}
                onChange={handleChange}
              />
              {errors.confirmarPassword && (
                <span className="error-message" style={{ display: 'block' }}>
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
                style={inputStyle}
                value={formData.telefono}
                onChange={handleChange}
              />
            </div>

            {/* REGIÓN Y COMUNA */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
                <label htmlFor="region">Región</label>
                <select
                  id="region"
                  name="region"
                  style={inputStyle}
                  className={errors.region ? 'error' : ''}
                  value={formData.region}
                  onChange={handleChange}
                >
                  <option value="" style={{ color: '#1a1a1a' }}>-- Seleccione la región --</option>
                  {Object.keys(regionesYComunas).map((reg) => (
                    <option key={reg} value={reg} style={{ color: '#1a1a1a' }}>
                      {reg}
                    </option>
                  ))}
                </select>
                {errors.region && (
                  <span className="error-message" style={{ display: 'block' }}>
                    {errors.region}
                  </span>
                )}
              </div>

              <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
                <label htmlFor="comuna">Comuna</label>
                <select
                  id="comuna"
                  name="comuna"
                  style={inputStyle}
                  className={errors.comuna ? 'error' : ''}
                  value={formData.comuna}
                  onChange={handleChange}
                  disabled={!formData.region}
                >
                  <option value="" style={{ color: '#1a1a1a' }}>-- Seleccione la comuna --</option>
                  {formData.region &&
                    regionesYComunas[formData.region].map((com) => (
                      <option key={com} value={com} style={{ color: '#1a1a1a' }}>
                        {com}
                      </option>
                    ))}
                </select>
                {errors.comuna && (
                  <span className="error-message" style={{ display: 'block' }}>
                    {errors.comuna}
                  </span>
                )}
              </div>
            </div>

            <button type="submit" className="btn-primary form-btn">
              Registrarse
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}