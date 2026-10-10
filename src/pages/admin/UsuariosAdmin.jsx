import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Diccionario estático para los selects sin necesidad de tablas extra en BD
const datosUbicacion = {
  "Región Metropolitana": ["Santiago", "Providencia", "San Joaquín", "Maipú", "Puente Alto", "La Florida", "El Bosque"],
  "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué"],
  "Biobío": ["Concepción", "Talcahuano", "Los Ángeles"]
};

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  
  // Adaptado a las columnas exactas de tu tabla 'usuarios'
  const [formData, setFormData] = useState({ 
    nombre: '', email: '', password: '', region: '', comuna: '', esadmin: '0' 
  });
  
  const [comunasDisponibles, setComunasDisponibles] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [toast, setToast] = useState({ mostrar: false, mensaje: '', tipo: 'success' });
  
  const location = useLocation();

  const mostrarMensaje = (mensaje, tipo = 'success') => {
    setToast({ mostrar: true, mensaje, tipo });
    setTimeout(() => setToast({ mostrar: false, mensaje: '', tipo: 'success' }), 3000);
  };

  const obtenerUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/usuarios', { cache: 'no-store' });
      if (response.ok) {
        setUsuarios(await response.json());
      }
    } catch (error) {
      mostrarMensaje('Error de conexión al cargar usuarios.', 'danger');
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, [location.key]);

  // Maneja el cambio de región y actualiza las comunas disponibles
  const handleRegionChange = (e) => {
    const regionSeleccionada = e.target.value;
    setFormData({ ...formData, region: regionSeleccionada, comuna: '' }); // Limpia la comuna
    
    if (regionSeleccionada && datosUbicacion[regionSeleccionada]) {
      setComunasDisponibles(datosUbicacion[regionSeleccionada]);
    } else {
      setComunasDisponibles([]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editandoId 
        ? `http://localhost:5000/api/usuarios/${editandoId}` 
        : 'http://localhost:5000/api/usuarios/registro'; // Asegúrate de que tu backend use esta ruta
      
      const method = editandoId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        obtenerUsuarios();
        setFormData({ nombre: '', email: '', password: '', region: '', comuna: '', esadmin: '0' }); 
        setComunasDisponibles([]);
        setEditandoId(null);
        mostrarMensaje(editandoId ? '✅ Usuario actualizado' : '✅ Usuario creado');
      } else {
        const data = await response.json();
        mostrarMensaje('❌ Error: ' + (data.error || 'No se pudo guardar'), 'danger');
      }
    } catch (error) {
      mostrarMensaje('⚠️ Error de conexión con el backend.', 'danger');
    }
  };

  const handleEdit = (usuario) => {
    setFormData({
      nombre: usuario.nombre,
      email: usuario.email,
      password: '', // Se deja en blanco por seguridad
      region: usuario.region || '',
      comuna: usuario.comuna || '',
      esadmin: usuario.esadmin ? '1' : '0' // Transforma el tinyint de MySQL a string para el select
    });
    
    // Carga las comunas correspondientes a la región del usuario
    if (usuario.region && datosUbicacion[usuario.region]) {
      setComunasDisponibles(datosUbicacion[usuario.region]);
    } else {
      setComunasDisponibles([]);
    }
    
    setEditandoId(usuario.id);
  };

  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Seguro que deseas eliminar al usuario "${nombre}"?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/usuarios/${id}`, { method: 'DELETE' });
        if (response.ok) {
          obtenerUsuarios();
          mostrarMensaje(`🗑️ "${nombre}" eliminado.`, 'warning');
        } else {
          mostrarMensaje('❌ No se pudo eliminar. Puede tener órdenes asociadas.', 'danger');
        }
      } catch (error) {
        mostrarMensaje('Error de red.', 'danger');
      }
    }
  };

  return (
    <div className="container-fluid py-4 position-relative">
      
      {toast.mostrar && (
        <div className={`alert alert-${toast.tipo} position-fixed top-0 end-0 m-3 shadow-lg z-3`} style={{ zIndex: 1050 }}>
          {toast.mensaje}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0">Gestión de Usuarios</h2>
        {editandoId && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setEditandoId(null); setFormData({ nombre: '', email: '', password: '', region: '', comuna: '', esadmin: '0' }); setComunasDisponibles([]); }}>
            Cancelar / Cerrar
          </button>
        )}
      </div>

      <div className="row">
        {/* FORMULARIO */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white">
              <h5 className="card-title mb-0">{editandoId ? 'Editar Usuario' : 'Nuevo Usuario'}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Correo electrónico</label>
                  <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contraseña {editandoId && '(Opcional)'}</label>
                  <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required={!editandoId} placeholder="******" />
                </div>
                
                <div className="row mb-3">
                  <div className="col">
                    <label className="form-label">Región</label>
                    <select className="form-select" name="region" value={formData.region} onChange={handleRegionChange} required>
                      <option value="">Seleccione...</option>
                      {Object.keys(datosUbicacion).map(reg => (
                        <option key={reg} value={reg}>{reg}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col">
                    <label className="form-label">Comuna</label>
                    <select className="form-select" name="comuna" value={formData.comuna} onChange={handleChange} required disabled={!formData.region}>
                      <option value="">Seleccione...</option>
                      {comunasDisponibles.map(com => (
                        <option key={com} value={com}>{com}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Rol del Usuario</label>
                  <select className="form-select" name="esadmin" value={formData.esadmin} onChange={handleChange}>
                    <option value="0">Cliente Normal</option>
                    <option value="1">Administrador</option>
                  </select>
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className={`btn ${editandoId ? 'btn-warning' : 'btn-success'}`}>
                    {editandoId ? 'Actualizar Usuario' : 'Crear Usuario'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* TABLA */}
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body p-0 p-md-3">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Comuna</th>
                      <th>Rol</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.length === 0 ? (
                      <tr><td colSpan="6" className="text-center py-4">No hay usuarios registrados.</td></tr>
                    ) : (
                      usuarios.map(usuario => (
                        <tr key={usuario.id}>
                          <td><span className="badge bg-secondary">{usuario.id}</span></td>
                          <td className="fw-bold">{usuario.nombre}</td>
                          <td>{usuario.email}</td>
                          <td>{usuario.comuna || 'N/A'}</td>
                          <td>
                            <span className={`badge ${usuario.esadmin ? 'bg-primary' : 'bg-info text-dark'}`}>
                              {usuario.esadmin ? 'Administración' : 'Cliente'}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button onClick={() => handleEdit(usuario)} className="btn btn-outline-primary">Editar</button>
                              <button onClick={() => handleDelete(usuario.id, usuario.nombre)} className="btn btn-outline-danger">Eliminar</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}