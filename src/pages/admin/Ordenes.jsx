import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Ordenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [cargandoDetalles, setCargandoDetalles] = useState(false);
  const [toast, setToast] = useState({ mostrar: false, mensaje: '', tipo: 'success' });
  
  const location = useLocation();

  const mostrarMensaje = (mensaje, tipo = 'success') => {
    setToast({ mostrar: true, mensaje, tipo });
    setTimeout(() => setToast({ mostrar: false, mensaje: '', tipo: 'success' }), 3000);
  };

  // 1. Cargar todas las órdenes
  const obtenerOrdenes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/ordenes', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        setOrdenes(data);
      }
    } catch (error) {
      mostrarMensaje('Error al cargar las órdenes.', 'danger');
    }
  };

  useEffect(() => {
    obtenerOrdenes();
  }, [location.key]);

  // 2. Cargar los detalles de una orden específica al hacer clic
  const verDetalles = async (orden) => {
    setOrdenSeleccionada(orden);
    setCargandoDetalles(true);
    try {
      const response = await fetch(`http://localhost:5000/api/ordenes/${orden.id}/detalle`);
      if (response.ok) {
        const data = await response.json();
        setDetalles(data);
      } else {
        setDetalles([]);
      }
    } catch (error) {
      mostrarMensaje('Error al cargar los detalles de la orden.', 'danger');
    } finally {
      setCargandoDetalles(false);
    }
  };

  // 3. (Opcional pero recomendado) Cambiar el estado de la orden
  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/ordenes/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      if (response.ok) {
        obtenerOrdenes(); // Recarga la tabla
        mostrarMensaje(`Estado actualizado a "${nuevoEstado}"`);
      }
    } catch (error) {
      mostrarMensaje('Error al actualizar el estado.', 'danger');
    }
  };

  const formatearFecha = (fechaISO) => {
    return new Date(fechaISO).toLocaleDateString('es-CL');
  };

  const badgeColor = (estado) => {
    switch (estado) {
      case 'Pendiente': return 'bg-warning text-dark';
      case 'En Camino': return 'bg-info text-dark';
      case 'Entregado': return 'bg-success';
      case 'Completado': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="container-fluid py-4 position-relative">
      
      {/* Toast de Notificaciones */}
      {toast.mostrar && (
        <div className={`alert alert-${toast.tipo} position-fixed top-0 end-0 m-3 shadow-lg z-3`} style={{ zIndex: 1050 }}>
          {toast.mensaje}
        </div>
      )}

      {/* Modal de Detalles de la Orden */}
      {ordenSeleccionada && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
          <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header bg-dark text-white">
                  <h5 className="modal-title">Detalles de la Orden #{ordenSeleccionada.id}</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setOrdenSeleccionada(null)}></button>
                </div>
                <div className="modal-body">
                  <div className="row mb-3">
                    <div className="col-sm-6">
                      <p className="mb-1"><strong>Cliente:</strong> {ordenSeleccionada.nombre_cliente || 'Anónimo'}</p>
                      <p className="mb-1"><strong>Email:</strong> {ordenSeleccionada.email_cliente || 'Sin registro'}</p>
                    </div>
                    <div className="col-sm-6 text-sm-end">
                      <p className="mb-1"><strong>Fecha:</strong> {formatearFecha(ordenSeleccionada.fecha)}</p>
                      <p className="mb-1"><strong>Total Pagado:</strong> ${Number(ordenSeleccionada.total).toLocaleString('es-CL')}</p>
                    </div>
                  </div>
                  
                  <h6 className="fw-bold border-bottom pb-2">Productos comprados</h6>
                  {cargandoDetalles ? (
                    <div className="text-center py-4"><div className="spinner-border text-primary" role="status"></div></div>
                  ) : detalles.length === 0 ? (
                    <p className="text-muted">No se encontraron productos para esta orden.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-sm align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Producto</th>
                            <th className="text-center">Cant.</th>
                            <th className="text-end">Precio Unit.</th>
                            <th className="text-end">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detalles.map(item => (
                            <tr key={item.id}>
                              <td>{item.producto_nombre}</td>
                              <td className="text-center">{item.cantidad}</td>
                              <td className="text-end">${Number(item.precio_unitario).toLocaleString('es-CL')}</td>
                              <td className="text-end fw-bold">${(item.cantidad * item.precio_unitario).toLocaleString('es-CL')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setOrdenSeleccionada(null)}>Cerrar</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <h2 className="mb-4 fw-bold">Gestión de Órdenes</h2>

      {/* Contenedor Responsivo de la Tabla */}
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h5 className="mb-0">Historial de Compras</h5>
        </div>
        <div className="card-body p-0 p-md-3">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>N° Orden</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ordenes.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-4 text-muted">No hay órdenes registradas.</td></tr>
                ) : (
                  ordenes.map(orden => (
                    <tr key={orden.id}>
                      <td><span className="badge bg-secondary">#{orden.id}</span></td>
                      <td>{orden.nombre_cliente || `ID: ${orden.usuario_id}`}</td>
                      <td>{formatearFecha(orden.fecha)}</td>
                      <td className="fw-bold">${Number(orden.total).toLocaleString('es-CL')}</td>
                      <td>
                        {/* Dropdown integrado para cambiar el estado rápido */}
                        <select 
                          className={`form-select form-select-sm fw-bold ${badgeColor(orden.estado)}`} 
                          value={orden.estado} 
                          onChange={(e) => cambiarEstado(orden.id, e.target.value)}
                          style={{ width: '130px', border: 'none' }}
                        >
                          <option value="Pendiente" className="bg-white text-dark">Pendiente</option>
                          <option value="En Camino" className="bg-white text-dark">En Camino</option>
                          <option value="Entregado" className="bg-white text-dark">Entregado</option>
                        </select>
                      </td>
                      <td>
                        <button onClick={() => verDetalles(orden)} className="btn btn-sm btn-outline-primary">
                          Ver detalles
                        </button>
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
  );
}