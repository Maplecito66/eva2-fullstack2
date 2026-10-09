import React, { useState, useEffect } from 'react';

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '', email: '', password: '', region: '', comuna: '', esadmin: 0
  });
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  // Estado para el Toast (Notificaciones)
  const [toast, setToast] = useState({ mostrar: false, mensaje: '', tipo: 'success' });
  
  // NUEVO: Estado para controlar el Modal de confirmación de eliminación
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  const mostrarMensaje = (mensaje, tipo = 'success') => {
    setToast({ mostrar: true, mensaje, tipo });
    setTimeout(() => setToast({ mostrar: false, mensaje: '', tipo: 'success' }), 3000);
  };

  const obtenerUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/usuarios');
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      }
    } catch (error) {
      mostrarMensaje('Error de conexión al cargar usuarios.', 'danger');
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editandoId 
        ? `http://localhost:5000/api/usuarios/${editandoId}` 
        : 'http://localhost:5000/api/usuarios';
      const method = editandoId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        obtenerUsuarios();
        setFormData({ nombre: '', email: '', password: '', region: '', comuna: '', esadmin: 0 }); 
        setEditandoId(null);
        setMostrarFormulario(false);
        mostrarMensaje('✅ ¡Usuario guardado con éxito!');
      } else {
        const data = await response.json();
        mostrarMensaje('❌ No se pudo guardar: ' + (data.error || 'Revisa la terminal'), 'danger');
      }
    } catch (error) {
      mostrarMensaje('⚠️ Error de conexión. Asegúrate de que el backend esté encendido.', 'danger');
    }
  };

  const handleEdit = (usuario) => {
    setFormData({
      nombre: usuario.nombre,
      email: usuario.email,
      password: '', 
      region: usuario.region || '',
      comuna: usuario.comuna || '',
      esadmin: usuario.esadmin
    });
    setEditandoId(usuario.id);
    setMostrarFormulario(true);
  };

  // NUEVO: Función que se ejecuta desde el Modal
  const confirmarEliminacion = async () => {
    if (!usuarioAEliminar) return;

    try {
      const response = await fetch(`http://localhost:5000/api/usuarios/${usuarioAEliminar.id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        obtenerUsuarios();
        mostrarMensaje(`🗑️ Usuario "${usuarioAEliminar.nombre}" eliminado correctamente.`, 'warning');
      } else {
        mostrarMensaje('❌ No se pudo eliminar el usuario.', 'danger');
      }
    } catch (error) {
      mostrarMensaje('Error de red al eliminar.', 'danger');
    }
    
    // Cierra el modal limpiando el estado
    setUsuarioAEliminar(null);
  };

  return (
    <div className="container-fluid py-4 position-relative">
      
      {/* Sistema de Notificaciones Toast (Flotante arriba a la derecha) */}
      {toast.mostrar && (
        <div className={`alert alert-${toast.tipo} position-fixed top-0 end-0 m-3 shadow-lg z-3`} style={{ zIndex: 1050 }}>
          {toast.mensaje}
        </div>
      )}

      {/* NUEVO: Modal de Confirmación de Eliminación Personalizado */}
      {usuarioAEliminar && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
          <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title">Confirmar Eliminación</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setUsuarioAEliminar(null)}></button>
                </div>
                <div className="modal-body">
                  <p>¿Estás seguro de que deseas eliminar al usuario <strong>{usuarioAEliminar.nombre}</strong>?</p>
                  <p className="text-muted small mb-0">Esta acción eliminará su acceso al sistema y no se puede deshacer.</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setUsuarioAEliminar(null)}>Cancelar</button>
                  <button type="button" className="btn btn-danger" onClick={confirmarEliminacion}>Sí, Eliminar</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Usuarios</h2>
        <button 
          className={`btn ${mostrarFormulario ? 'btn-secondary' : 'btn-success'}`}
          onClick={() => {
            setMostrarFormulario(!mostrarFormulario);
            setEditandoId(null);
            setFormData({ nombre: '', email: '', password: '', region: '', comuna: '', esadmin: 0 });
          }}
        >
          {mostrarFormulario ? 'Cancelar / Cerrar' : '+ Nuevo Usuario'}
        </button>
      </div>

      <div className="row">
        {mostrarFormulario && (
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
                    <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required={!editandoId} placeholder={editandoId ? "Dejar en blanco para no cambiar" : ""} />
                  </div>
                  <div className="row mb-3">
                    <div className="col">
                      <label className="form-label">Región</label>
                      <input type="text" className="form-control" name="region" value={formData.region} onChange={handleChange} />
                    </div>
                    <div className="col">
                      <label className="form-label">Comuna</label>
                      <input type="text" className="form-control" name="comuna" value={formData.comuna} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Rol del Usuario</label>
                    <select className="form-select" name="esadmin" value={formData.esadmin} onChange={handleChange}>
                      <option value={0}>Cliente Normal</option>
                      <option value={1}>Administrador</option>
                    </select>
                  </div>
                  <button type="submit" className={`btn w-100 ${editandoId ? 'btn-warning' : 'btn-success'}`}>
                    {editandoId ? 'Actualizar Usuario' : 'Guardar Usuario'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className={mostrarFormulario ? "col-md-8" : "col-md-12"}>
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover table-bordered align-middle">
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
                    {usuarios.map((usuario) => (
                      <tr key={usuario.id}>
                        <td><span className="badge bg-secondary">{usuario.id}</span></td>
                        <td className="fw-bold">{usuario.nombre}</td>
                        <td>{usuario.email}</td>
                        <td>{usuario.comuna || '-'}</td>
                        <td>
                          <span className={`badge ${usuario.esadmin ? 'bg-primary' : 'bg-info text-dark'}`}>
                            {usuario.esadmin ? 'Admin' : 'Cliente'}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button onClick={() => handleEdit(usuario)} className="btn btn-outline-primary">Editar</button>
                            
                            {/* NUEVO: En lugar de eliminar, esto abre el Modal */}
                            <button onClick={() => setUsuarioAEliminar(usuario)} className="btn btn-outline-danger">Eliminar</button>
                            
                          </div>
                        </td>
                      </tr>
                    ))}
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