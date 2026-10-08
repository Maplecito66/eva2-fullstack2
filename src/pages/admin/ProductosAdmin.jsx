import React, { useState, useEffect } from 'react';
// 1. Importamos las herramientas oficiales de React Bootstrap
import { Modal, Button } from 'react-bootstrap';

export default function ProductosAdmin() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  const [mostrarModal, setMostrarModal] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const respuesta = await fetch('http://localhost:5000/api/productos');
        if (respuesta.ok) {
          const datos = await respuesta.json();
          setProductos(datos);
        } else {
          console.error("Error al cargar los productos");
        }
      } catch (error) {
        console.error("Error de conexión con el backend:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerProductos();
  }, []);

  const prepararEliminacion = (id) => {
    setProductoAEliminar(id);
    setMostrarModal(true);
  };

  const ejecutarEliminacion = async () => {
    try {
      const respuesta = await fetch(`http://localhost:5000/api/productos/${productoAEliminar}`, {
        method: 'DELETE',
      });
      
      if (respuesta.ok) {
        setProductos(productos.filter((producto) => producto.id !== productoAEliminar));
        setMostrarModal(false);
      } else {
        alert("Hubo un error al intentar eliminar.");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Productos</h2>
        <button className="btn btn-success">
          + Nuevo Producto
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          {cargando ? (
            <p className="text-center">Cargando inventario desde la base de datos...</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((producto) => (
                    <tr key={producto.id}>
                      <td><span className="badge bg-secondary">{producto.codigo}</span></td>
                      <td className="fw-bold">{producto.nombre}</td>
                      <td className="text-capitalize">{producto.categoria.replace('-', ' ')}</td>
                      <td>${producto.precio.toLocaleString('es-CL')}</td>
                      <td>
                        <span className={`badge ${producto.stock < 20 ? 'bg-danger' : 'bg-success'}`}>
                          {producto.stock} un.
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2">Editar</button>
                        <button 
                          className="btn btn-sm btn-outline-danger" 
                          onClick={() => prepararEliminacion(producto.id)}
                        > 
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 2. VENTANA MODAL USANDO REACT BOOTSTRAP */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold text-danger">Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="py-4">
          <p className="mb-0 fs-5">¿Estás seguro de que deseas eliminar este producto?</p>
          <p className="text-muted small mt-1 mb-0">Esta acción no se puede deshacer.</p>
        </Modal.Body>
        
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={() => setMostrarModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" className="px-4" onClick={ejecutarEliminacion}>
            Sí, eliminar
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}