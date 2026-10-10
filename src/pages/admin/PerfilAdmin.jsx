import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function PerfilAdmin() {
  const { usuario } = useAuth();

  if (!usuario) return <p>Cargando perfil...</p>;

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4">Mi Perfil de Administrador</h2>
      <div className="card shadow-sm col-md-6">
        <div className="card-body">
          <div className="text-center mb-4">
            <div className="display-1">👨‍💻</div>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item"><strong>Nombre:</strong> {usuario.nombre}</li>
            <li className="list-group-item"><strong>Correo:</strong> {usuario.email}</li>
            <li className="list-group-item"><strong>Región:</strong> {usuario.region || 'No especificada'}</li>
            <li className="list-group-item"><strong>Comuna:</strong> {usuario.comuna || 'No especificada'}</li>
            <li className="list-group-item"><strong>Rol:</strong> <span className="badge bg-primary">Administrador</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}