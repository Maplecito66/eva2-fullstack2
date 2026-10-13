import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Ordenes() {
  // Estados para manejar los datos y la interfaz
  const [ordenes, setOrdenes] = useState([]); // Guarda la lista de todas las órdenes
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null); // Guarda la orden a la que le hicimos click para ver detalles
  const [detalles, setDetalles] = useState([]); // Guarda los productos comprados en esa orden
  const [cargandoDetalles, setCargandoDetalles] = useState(false); // Controla el spinner mientras carga el modal
  const [toast, setToast] = useState({ mostrar: false, mensaje: '', tipo: 'success' }); // Controla las notificaciones flotantes
  
  const location = useLocation();

  // Función para mostrar una alerta temporal (toast) y apagarla a los 3 seg
  const mostrarMensaje = (mensaje, tipo = 'success') => {
    setToast({ mostrar: true, mensaje, tipo });
    setTimeout(() => setToast({ mostrar: false, mensaje: '', tipo: 'success' }), 3000);
  };

  // Trae la lista maestra de órdenes desde el backend
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

  // Se ejecuta automáticamente al cargar la página para rellenar la tabla
  useEffect(() => {
    obtenerOrdenes();
  }, [location.key]);

  // Al hacer clic en "Ver detalles", abre el modal y pide al backend los productos de esa orden específica
  const verDetalles = async (orden) => {
    setOrdenSeleccionada(orden); // Abre el modal
    setCargandoDetalles(true); // Prende el spinner
    try {
      const response = await fetch(`http://localhost:5000/api/ordenes/${orden.id}/detalle`);
      if (response.ok) {
        const data = await response.json();
        setDetalles(data); // Guarda los productos comprados
      } else {
        setDetalles([]);
      }
    } catch (error) {
      mostrarMensaje('Error al cargar los detalles de la orden.', 'danger');
    } finally {
      setCargandoDetalles(false); // Apaga el spinner
    }
  };

  // Cambia el estado del envío (Pendiente, En camino, Entregado) enviando un PUT al servidor
  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/ordenes/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      if (response.ok) {
        obtenerOrdenes(); // Recarga la tabla completa para actualizar colores
        mostrarMensaje(`Estado actualizado a "${nuevoEstado}"`);
      }
    } catch (error) {
      mostrarMensaje('Error al actualizar el estado.', 'danger');
    }
  };

  // Formatea la fecha de MySQL (ISO) a formato chileno (DD/MM/YYYY)
  const formatearFecha = (fechaISO) => {
    return new Date(fechaISO).toLocaleDateString('es-CL');
  };

  // Asigna un color al selector (select) de estado dependiendo de su valor
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
      
      {/* Zona de Notificación (Toast) */}
      {toast.mostrar && (
        <div className={`alert alert-${toast.tipo} position-fixed top-0 end-0 m-3 shadow-lg z-3`} style={{ zIndex: 1050 }}>
          {toast.mensaje}
        </div>
      )}

      {/* Zona del Modal: Solo se renderiza si hay una ordenSeleccionada */}
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
                
                {/* Cuerpo del Modal: Muestra datos del cliente y la tabla de sus productos */}
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
                  
                  {/* Si está cargando detalles muestra spinner, si no, dibuja la tabla */}
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

      {/* Tabla Principal: Lista de todas las órdenes en sistema */}
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
                        {/* Dropdown integrado para cambiar el estado. Llama a 'cambiarEstado' en tiempo real */}
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