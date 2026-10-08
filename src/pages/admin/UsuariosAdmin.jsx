import React, { useState, useEffect } from 'react';

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const respuesta = await fetch('http://localhost:5000/api/usuarios');
        if (respuesta.ok) {
          const datos = await respuesta.json();
          setUsuarios(datos);
        } else {
          console.error("Error al cargar los usuarios");
        }
      } catch (error) {
        console.error("Error de conexión con el backend:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerUsuarios();
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Usuarios</h2>
        <button className="btn btn-success">
          <i className="bi bi-person-plus"></i> + Nuevo Usuario
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          {cargando ? (
            <p className="text-center">Cargando base de datos de usuarios...</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Comuna</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.length > 0 ? usuarios.map((usuario) => (
                    <tr key={usuario.id}>
                      <td><span className="badge bg-secondary">{usuario.id}</span></td>
                      <td className="fw-bold">{usuario.nombre}</td>
                      <td>{usuario.email}</td>
                      <td>{usuario.comuna || 'No registrada'}</td>
                      <td>
                        <span className={`badge ${usuario.esadmin ? 'bg-primary' : 'bg-info text-dark'}`}>
                          {usuario.esadmin ? 'Administrador' : 'Cliente'}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2">Editar</button>
                        <button className="btn btn-sm btn-outline-danger">Eliminar</button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="text-center">No hay usuarios para mostrar.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}