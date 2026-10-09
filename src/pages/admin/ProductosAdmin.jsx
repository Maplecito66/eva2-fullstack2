import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

export default function ProductosAdmin() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // Estados del Formulario
  const [formData, setFormData] = useState({ codigo: '', nombre: '', id_categoria: '', precio: '', stock: '', descripcion: '' });
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Estados del Modal de Eliminación de tu compañero
  const [mostrarModal, setMostrarModal] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch('http://localhost:5000/api/productos');
      if (respuesta.ok) setProductos(await respuesta.json());
    } catch (error) { console.error(error); } 
    finally { setCargando(false); }
  };

  useEffect(() => { obtenerProductos(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editandoId ? `http://localhost:5000/api/productos/${editandoId}` : 'http://localhost:5000/api/productos';
    const method = editandoId ? 'PUT' : 'POST';
    
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      if (res.ok) {
        obtenerProductos();
        setFormData({ codigo: '', nombre: '', id_categoria: '', precio: '', stock: '', descripcion: '' });
        setEditandoId(null);
        setMostrarFormulario(false);
      }
    } catch (error) { alert("Error de conexión"); }
  };

  const handleEdit = (prod) => {
    setFormData({ codigo: prod.codigo, nombre: prod.nombre, id_categoria: prod.id_categoria, precio: prod.precio, stock: prod.stock, descripcion: prod.descripcion || '' });
    setEditandoId(prod.id);
    setMostrarFormulario(true);
  };

  const prepararEliminacion = (id) => {
    setProductoAEliminar(id);
    setMostrarModal(true);
  };

  const ejecutarEliminacion = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/productos/${productoAEliminar}`, { method: 'DELETE' });
      if (res.ok) {
        obtenerProductos();
        setMostrarModal(false);
      }
    } catch (error) { console.error(error); }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Productos</h2>
        <button 
          className={`btn ${mostrarFormulario ? 'btn-secondary' : 'btn-success'}`}
          onClick={() => {
            setMostrarFormulario(!mostrarFormulario);
            setEditandoId(null);
            setFormData({ codigo: '', nombre: '', id_categoria: '', precio: '', stock: '', descripcion: '' });
          }}
        >
          {mostrarFormulario ? 'Cancelar' : '+ Nuevo Producto'}
        </button>
      </div>

      <div className="row">
        {/* FORMULARIO */}
        {mostrarFormulario && (
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-dark text-white"><h5 className="mb-0">{editandoId ? 'Editar' : 'Nuevo'}</h5></div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3"><label>Código</label><input type="text" className="form-control" name="codigo" value={formData.codigo} onChange={handleChange} required /></div>
                  <div className="mb-3"><label>Nombre</label><input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required /></div>
                  <div className="mb-3">
                    <label>Categoría</label>
                    <select className="form-select" name="id_categoria" value={formData.id_categoria} onChange={handleChange} required>
                      <option value="">Seleccione...</option>
                      <option value="1">Comida Rápida</option>
                      <option value="2">Saludable</option>
                      <option value="3">Postres</option>
                      <option value="4">Bebidas</option>
                    </select>
                  </div>
                  <div className="row mb-3">
                    <div className="col"><label>Precio</label><input type="number" className="form-control" name="precio" value={formData.precio} onChange={handleChange} required /></div>
                    <div className="col"><label>Stock</label><input type="number" className="form-control" name="stock" value={formData.stock} onChange={handleChange} required /></div>
                  </div>
                  <button type="submit" className="btn btn-success w-100">Guardar</button>
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
                      <tr><th>Código</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr>
                    </thead>
                    <tbody>
                      {productos.map(p => (
                        <tr key={p.id}>
                          <td><span className="badge bg-secondary">{p.codigo}</span></td>
                          <td className="fw-bold">{p.nombre}</td>
                          <td>{p.categoria}</td>
                          <td>${p.precio}</td>
                          <td><span className={`badge ${p.stock < 20 ? 'bg-danger' : 'bg-success'}`}>{p.stock}</span></td>
                          <td>
                            <button onClick={() => handleEdit(p)} className="btn btn-sm btn-outline-primary me-2">Editar</button>
                            <button onClick={() => prepararEliminacion(p.id)} className="btn btn-sm btn-outline-danger">Eliminar</button>
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

      {/* MODAL DE TU COMPAÑERO */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
        <Modal.Header closeButton><Modal.Title className="text-danger">Confirmar</Modal.Title></Modal.Header>
        <Modal.Body>¿Seguro que deseas eliminar este producto?</Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setMostrarModal(false)}>Cancelar</Button>
          <Button variant="danger" onClick={ejecutarEliminacion}>Eliminar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}