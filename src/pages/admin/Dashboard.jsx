import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Panel de Control - Sabor Aroma</h2>
      <p className="lead">Bienvenido al sistema de administración.</p>
      
      <div className="row mt-4">
        {/* Tarjeta de Productos */}
        <div className="col-md-4">
          <div className="card text-white bg-primary mb-3 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">🍔 Productos</h5>
              <p className="card-text">Revisa y actualiza el inventario, precios y categorías.</p>
              <Link to="/admin/productos" className="btn btn-light btn-sm">Gestionar Productos</Link>
            </div>
          </div>
        </div>

        {/* Tarjeta de Usuarios */}
        <div className="col-md-4">
          <div className="card text-white bg-success mb-3 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">👥 Usuarios</h5>
              <p className="card-text">Administra los clientes y los permisos del sistema.</p>
              <Link to="/admin/usuarios" className="btn btn-light btn-sm">Gestionar Usuarios</Link>
            </div>
          </div>
        </div>

        {/* Tarjeta de Órdenes */}
        <div className="col-md-4">
          <div className="card text-dark bg-warning mb-3 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">🛒 Órdenes</h5>
              <p className="card-text">Revisa el historial de ventas y compras de los usuarios.</p>
              <Link to="/admin/ordenes" className="btn btn-dark btn-sm">Ver Órdenes</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}