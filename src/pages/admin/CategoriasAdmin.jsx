import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function CategoriasAdmin() {
  // Estados principales para guardar los datos
  const [categorias, setCategorias] = useState([]); // Guarda la lista de categorías de la BD
  const [formData, setFormData] = useState({ nombre_categoria: '' }); // Controla el texto del formulario
  const [editandoId, setEditandoId] = useState(null); // Si tiene un ID, estamos editando; si es null, estamos creando
  
  // Estado para la alerta visual (notificación)
  const [toast, setToast] = useState({ mostrar: false, mensaje: '', tipo: 'success' });
  const location = useLocation();

  // Activa la alerta en pantalla y la apaga automáticamente a los 3 segundos
  const mostrarMensaje = (mensaje, tipo = 'success') => {
    setToast({ mostrar: true, mensaje, tipo });
    setTimeout(() => setToast({ mostrar: false, mensaje: '', tipo: 'success' }), 3000);
  };

  // Trae las categorías desde el backend haciendo un GET y las guarda en el estado 'categorias'
  const obtenerCategorias = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categorias', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        setCategorias(data);
      }
    } catch (error) {
      mostrarMensaje('Error de conexión al cargar categorías.', 'danger');
    }
  };

  // Se ejecuta automáticamente al abrir la página para cargar la tabla
  useEffect(() => {
    obtenerCategorias();
  }, [location.key]);

  // Actualiza el estado 'formData' en tiempo real mientras el usuario escribe en el input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Envía el formulario al backend (POST para crear, PUT para actualizar si hay un ID)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    try {
      const url = editandoId 
        ? `http://localhost:5000/api/categorias/${editandoId}` 
        : 'http://localhost:5000/api/categorias';
      const method = editandoId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData) // Convierte los datos a JSON para enviarlos
      });

      if (response.ok) {
        obtenerCategorias(); // Recarga la tabla para ver el cambio
        setFormData({ nombre_categoria: '' }); // Limpia el input
        setEditandoId(null); // Sale del modo edición
        mostrarMensaje(editandoId ? '✅ Categoría actualizada' : '✅ Categoría creada');
      } else {
        const data = await response.json();
        mostrarMensaje('❌ Error: ' + (data.error || 'No se pudo guardar'), 'danger');
      }
    } catch (error) {
      mostrarMensaje('⚠️ Error de conexión con el backend.', 'danger');
    }
  };

  // Carga los datos de la fila seleccionada en el formulario para poder editarlos
  const handleEdit = (categoria) => {
    setFormData({ nombre_categoria: categoria.nombre_categoria });
    setEditandoId(categoria.id_categoria);
  };

  // Pide confirmación y hace un DELETE al backend con el ID de la categoría a borrar
  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Estás seguro de eliminar la categoría "${nombre}"?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/categorias/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          obtenerCategorias(); // Recarga la tabla para que desaparezca visualmente
          mostrarMensaje(`🗑️ "${nombre}" eliminada correctamente.`, 'warning');
        } else {
          const data = await response.json();
          mostrarMensaje(`❌ ${data.error || 'No se pudo eliminar'}`, 'danger');
        }
      } catch (error) {
        mostrarMensaje('Error de red al eliminar.', 'danger');
      }
    }
  };

  return (
    <div className="container-fluid py-4 position-relative">
      
      {/* Muestra la alerta temporal si 'toast.mostrar' es verdadero */}
      {toast.mostrar && (
        <div className={`alert alert-${toast.tipo} position-fixed top-0 end-0 m-3 shadow-lg z-3`} style={{ zIndex: 1050 }}>
          {toast.mensaje}
        </div>
      )}

      <h2 className="mb-4 fw-bold">Gestión de Categorías</h2>

      <div className="row">
        {/* COLUMNA FORMULARIO */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white">
              <h5 className="card-title mb-0">{editandoId ? 'Editar Categoría' : 'Nueva Categoría'}</h5>
            </div>
            <div className="card-body">
              {/* Al enviar ejecuta handleSubmit */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre de la Categoría</label>
                  <input type="text" className="form-control" name="nombre_categoria" value={formData.nombre_categoria} onChange={handleChange} required placeholder="Ej: Comida Vegana" />
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className={`btn ${editandoId ? 'btn-warning' : 'btn-success'}`}>
                    {editandoId ? 'Actualizar Categoría' : 'Guardar Categoría'}
                  </button>
                  {editandoId && (
                    <button type="button" className="btn btn-secondary" onClick={() => { setEditandoId(null); setFormData({ nombre_categoria: '' }); }}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* COLUMNA TABLA */}
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Categorías Activas en el Sistema</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Nombre de la Categoría</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Recorre el array de categorías y dibuja una fila por cada una */}
                    {categorias.map(cat => (
                      <tr key={cat.id_categoria}>
                        <td><span className="badge bg-secondary">{cat.id_categoria}</span></td>
                        <td className="fw-bold">{cat.nombre_categoria}</td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button onClick={() => handleEdit(cat)} className="btn btn-outline-primary">Editar</button>
                            <button onClick={() => handleDelete(cat.id_categoria, cat.nombre_categoria)} className="btn btn-outline-danger">Eliminar</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {categorias.length === 0 && (
                      <tr><td colSpan="3" className="text-center text-muted py-3">No hay categorías cargadas.</td></tr>
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