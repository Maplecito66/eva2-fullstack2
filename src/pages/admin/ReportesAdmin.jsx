import React, { useState, useEffect } from 'react';

export default function ReportesAdmin() {
  const [historial, setHistorial] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('Todos');

  useEffect(() => {
    // Llamamos a tu backend real
    // (Ajusta el http://localhost:3000 si tu backend usa otro puerto)
    fetch('http://localhost:5000/api/reportes')
      .then(respuesta => respuesta.json())
      .then(datos => setHistorial(datos))
      .catch(error => console.error("Error cargando la base de datos:", error));
  }, []);

  const getColorEspecialidad = (especialidad) => {
    switch (especialidad) {
      case 'Nuevo': return 'success';
      case 'Editar': return 'warning';
      case 'Eliminar': return 'danger';
      default: return 'secondary';
    }
  };

  const reportesFiltrados = filtroTipo === 'Todos' 
    ? historial 
    : historial.filter(item => item.tipo_reporte === filtroTipo);

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0">Reporte General de Registros.</h2>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Historial de Cambios</h5>
          
          <div className="btn-group btn-group-sm" role="group">
             <button type="button" className={`btn ${filtroTipo === 'Todos' ? 'btn-primary' : 'btn-outline-light'}`} onClick={() => setFiltroTipo('Todos')}>Todos</button>
             <button type="button" className={`btn ${filtroTipo === 'Producto' ? 'btn-primary' : 'btn-outline-light'}`} onClick={() => setFiltroTipo('Producto')}>Productos</button>
             <button type="button" className={`btn ${filtroTipo === 'Usuario' ? 'btn-primary' : 'btn-outline-light'}`} onClick={() => setFiltroTipo('Usuario')}>Usuarios</button>
             <button type="button" className={`btn ${filtroTipo === 'Categoría' ? 'btn-primary' : 'btn-outline-light'}`} onClick={() => setFiltroTipo('Categoría')}>Categorías</button>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Tipo de Reporte</th>
                  <th>Especialidad</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {reportesFiltrados.length > 0 ? (
                  reportesFiltrados.map((item) => (
                    <tr key={item.id}>
                      <td><span className="badge bg-secondary">#{item.id}</span></td>
                      {/* MySQL devuelve la fecha en formato ISO, la mostramos bonita */}
                      <td className="text-muted small">{new Date(item.fecha).toLocaleString()}</td>
                      <td className="fw-bold">{item.tipo_reporte}</td>
                      <td>
                        <span className={`badge bg-${getColorEspecialidad(item.especialidad)}`}>
                          {item.especialidad}
                        </span>
                      </td>
                      <td>{item.descripcion}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">No hay reportes en la base de datos.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}