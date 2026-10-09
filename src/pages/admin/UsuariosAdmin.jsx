import React, { useState, useEffect } from 'react';

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '', email: '', password: '', region: '', comuna: '', esadmin: 0
  });
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const obtenerUsuarios = async () => {
    try {
      const respuesta = await fetch('http://localhost:5000/api/usuarios');
      if (respuesta.ok) {
        const datos = await respuesta.json();
        setUsuarios(datos);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setCargando(false);
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
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        obtenerUsuarios();
        setFormData({ nombre: '', email: '', password: '', region: '', comuna: '', esadmin: 0 }); 
        setEditandoId(null);
        setMostrarFormulario(false);
        alert('✅ Usuario guardado con éxito');
      } else {
        alert('❌ Error al guardar. Verifica los datos.');
      }
    } catch (error) {
      alert('⚠️ Error de conexión con el servidor.');
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

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/usuarios/${id}`, { method: 'DELETE' });
        if (response.ok) obtenerUsuarios();
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  return (
    <div className="container mt-4">
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
        {/* FORMULARIO */}
        {mostrarFormulario && (
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-dark text-white">
                <h5 className="mb-0">{editandoId ? 'Editar Usuario' : 'Nuevo Usuario'}</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label>Nombre</label>
                    <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label>Email</label>
                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label>Contraseña {editandoId && '(Opcional)'}</label>
                    <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required={!editandoId} />
                  </div>
                  <div className="row mb-3">
                    <div className="col"><label>Región</label><input type="text" className="form-control" name="region" value={formData.region} onChange={handleChange} /></div>
                    <div className="col"><label>Comuna</label><input type="text" className="form-control" name="comuna" value={formData.comuna} onChange={handleChange} /></div>
                  </div>
                  <div className="mb-3">
                    <label>Rol</label>
                    <select className="form-select" name="esadmin" value={formData.esadmin} onChange={handleChange}>
                      <option value={0}>Cliente Normal</option>
                      <option value={1}>Administrador</option>
                    </select>
                  </div>
                  <button type="submit" className={`btn w-100 ${editandoId ? 'btn-warning' : 'btn-success'}`}>Guardar</button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* TABLA */}
        <div className={mostrarFormulario ? "col-md-8" : "col-md-12"}>
          <div className="card shadow-sm">
            <div className="card-body">
              {cargando ? <p>Cargando...</p> : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr><th>ID</th><th>Nombre</th><th>Email</th><th>Comuna</th><th>Rol</th><th>Acciones</th></tr>
                    </thead>
                    <tbody>
                      {usuarios.map(u => (
                        <tr key={u.id}>
                          <td><span className="badge bg-secondary">{u.id}</span></td>
                          <td className="fw-bold">{u.nombre}</td>
                          <td>{u.email}</td>
                          <td>{u.comuna || '-'}</td>
                          <td><span className={`badge ${u.esadmin ? 'bg-primary' : 'bg-info text-dark'}`}>{u.esadmin ? 'Admin' : 'Cliente'}</span></td>
                          <td>
                            <button onClick={() => handleEdit(u)} className="btn btn-sm btn-outline-primary me-2">Editar</button>
                            <button onClick={() => handleDelete(u.id)} className="btn btn-sm btn-outline-danger">Eliminar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}