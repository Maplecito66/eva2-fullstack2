import React, { useState, useEffect } from 'react';

export default function Ordenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerOrdenes = async () => {
      try {
        const respuesta = await fetch('http://localhost:5000/api/ordenes');
        if (respuesta.ok) {
          const datos = await respuesta.json();
          setOrdenes(datos);
        } else {
          console.error("Error al cargar las órdenes");
        }
      } catch (error) {
        console.error("Error de conexión con el backend:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerOrdenes();
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Historial de Órdenes</h2>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          {cargando ? (
            <p className="text-center">Cargando ventas...</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>N° Orden</th>
                    <th>ID Cliente</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ordenes.length > 0 ? ordenes.map((orden) => (
                    <tr key={orden.id}>
                      <td><span className="badge bg-dark">#{orden.id}</span></td>
                      <td>{orden.usuario_id}</td>
                      <td>{new Date(orden.fecha).toLocaleDateString('es-CL')}</td>
                      <td className="fw-bold">${orden.total ? orden.total.toLocaleString('es-CL') : '0'}</td>
                      <td>
                        <span className={`badge ${orden.estado === 'Pendiente' ? 'bg-warning text-dark' : 'bg-success'}`}>
                          {orden.estado}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-info">Ver Detalles</button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4">No hay órdenes registradas aún. El historial está vacío.</td>
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