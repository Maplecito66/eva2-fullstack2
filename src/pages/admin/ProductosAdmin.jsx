import React, { useState, useEffect } from 'react';

export default function ProductosAdmin() {
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    codigo: '', nombre: '', id_categoria: '', precio: '', stock: '', descripcion: ''
  });
  const [editandoId, setEditandoId] = useState(null);
  const [filtroActivo, setFiltroActivo] = useState('todos');

  // Estado para el Toast de notificaciones
  const [toast, setToast] = useState({ mostrar: false, mensaje: '', tipo: 'success' });
  
  // NUEVO: Estado para controlar el Modal de confirmación de eliminación
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const mostrarMensaje = (mensaje, tipo = 'success') => {
    setToast({ mostrar: true, mensaje, tipo });
    setTimeout(() => setToast({ mostrar: false, mensaje: '', tipo: 'success' }), 3000);
  };

  const obtenerProductos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/productos');
      if (response.ok) {
        const data = await response.json();
        setProductos(data);
      }
    } catch (error) {
      mostrarMensaje('Error de conexión al cargar productos.', 'danger');
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editandoId 
        ? `http://localhost:5000/api/productos/${editandoId}` 
        : 'http://localhost:5000/api/productos';
      const method = editandoId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        obtenerProductos();
        setFormData({ codigo: '', nombre: '', id_categoria: '', precio: '', stock: '', descripcion: '' }); 
        setEditandoId(null);
        mostrarMensaje(`✅ ¡"${formData.nombre}" guardado con éxito!`);
      } else {
        const data = await response.json();
        mostrarMensaje('❌ No se pudo guardar: ' + (data.error || 'Verifica los datos'), 'danger');
      }
    } catch (error) {
      mostrarMensaje('⚠️ Error de conexión. Asegúrate de que el backend esté encendido.', 'danger');
    }
  };

  const handleEdit = (producto) => {
    setFormData({
      codigo: producto.codigo,
      nombre: producto.nombre,
      id_categoria: producto.id_categoria,
      precio: producto.precio,
      stock: producto.stock,
      descripcion: producto.descripcion
    });
    setEditandoId(producto.id);
  };

  // NUEVO: Esta función ahora ejecuta la eliminación real al confirmar en el Modal
  const confirmarEliminacion = async () => {
    if (!productoAEliminar) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/productos/${productoAEliminar.id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        obtenerProductos();
        mostrarMensaje(`🗑️ "${productoAEliminar.nombre}" eliminado correctamente.`, 'warning');
      } else {
        mostrarMensaje('❌ No se pudo eliminar. Verifica que no existan órdenes atadas.', 'danger');
      }
    } catch (error) {
      mostrarMensaje('Error de red al eliminar.', 'danger');
    }
    
    // Cierra el modal limpiando el estado
    setProductoAEliminar(null);
  };

  const productosFiltrados = filtroActivo === 'criticos' 
    ? productos.filter(producto => producto.stock <= 10)
    : productos;

  return (
    <div className="container-fluid py-4 position-relative">
      
      {/* Sistema de Notificaciones Toast */}
      {toast.mostrar && (
        <div className={`alert alert-${toast.tipo} position-fixed top-0 end-0 m-3 shadow-lg z-3`} style={{ zIndex: 1050 }}>
          {toast.mensaje}
        </div>
      )}

      {/* NUEVO: Modal de Confirmación de Eliminación Personalizado */}
      {productoAEliminar && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
          <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title">Confirmar Eliminación</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setProductoAEliminar(null)}></button>
                </div>
                <div className="modal-body">
                  <p>¿Estás seguro de que deseas eliminar el producto <strong>{productoAEliminar.nombre}</strong>?</p>
                  <p className="text-muted small mb-0">Esta acción no se puede deshacer y podría afectar el historial si el producto ya fue vendido.</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setProductoAEliminar(null)}>Cancelar</button>
                  <button type="button" className="btn btn-danger" onClick={confirmarEliminacion}>Sí, Eliminar</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <h2 className="mb-4">Gestión de Productos e Inventario</h2>

      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white">
              <h5 className="card-title mb-0">{editandoId ? 'Editar Producto' : 'Nuevo Producto'}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Código</label>
                  <input type="text" className="form-control" name="codigo" value={formData.codigo} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Categoría</label>
                  <select className="form-select" name="id_categoria" value={formData.id_categoria} onChange={handleChange} required>
                    <option value="">Seleccione...</option>
                    <option value="1">Pizzas y Hamburguesas</option>
                    <option value="2">Saludable</option>
                    <option value="3">Postres</option>
                    <option value="4">Bebidas</option>
                    <option value="5">Ofertas</option>
                  </select>
                </div>
                <div className="row mb-3">
                  <div className="col">
                    <label className="form-label">Precio ($)</label>
                    <input type="number" className="form-control" name="precio" value={formData.precio} onChange={handleChange} required />
                  </div>
                  <div className="col">
                    <label className="form-label">Existencias</label>
                    <input type="number" className="form-control" name="stock" value={formData.stock} onChange={handleChange} required />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea className="form-control" name="descripcion" value={formData.descripcion} onChange={handleChange} rows="2"></textarea>
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className={`btn ${editandoId ? 'btn-warning' : 'btn-success'}`}>
                    {editandoId ? 'Actualizar Producto' : 'Guardar Producto'}
                  </button>
                  {editandoId && (
                    <button type="button" className="btn btn-secondary" onClick={() => { setEditandoId(null); setFormData({ codigo: '', nombre: '', id_categoria: '', precio: '', stock: '', descripcion: '' }); }}>
                      Cancelar Edición
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Lista de Inventario</h5>
              <div className="btn-group" role="group">
                <button type="button" className={`btn ${filtroActivo === 'todos' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFiltroActivo('todos')}>
                  Todos los Productos
                </button>
                <button type="button" className={`btn ${filtroActivo === 'criticos' ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => setFiltroActivo('criticos')}>
                  Stock Crítico (≤ 10)
                </button>
              </div>
            </div>
            
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Código</th>
                      <th>Nombre</th>
                      <th>Categoría (ID)</th>
                      <th>Precio</th>
                      <th>Existencias</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-4">
                          {filtroActivo === 'criticos' ? 'No hay productos con stock crítico.' : 'No hay productos registrados.'}
                        </td>
                      </tr>
                    ) : (
                      productosFiltrados.map((producto) => (
                        <tr key={producto.id}>
                          <td><span className="badge bg-secondary">{producto.codigo}</span></td>
                          <td className="fw-bold">{producto.nombre}</td>
                          <td>{producto.id_categoria}</td>
                          <td>${producto.precio}</td>
                          <td>
                            <span className={`badge ${producto.stock <= 10 ? 'bg-danger' : 'bg-success'}`}>
                              {producto.stock}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button onClick={() => handleEdit(producto)} className="btn btn-outline-primary">Editar</button>
                              
                              {/* NUEVO: En lugar de eliminar de inmediato, esto abre el Modal */}
                              <button onClick={() => setProductoAEliminar(producto)} className="btn btn-outline-danger">Eliminar</button>
                              
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