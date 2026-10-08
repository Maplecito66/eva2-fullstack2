import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Componentes
import Layout from './components/Layout';

// Páginas Públicas
import Inicio from './pages/inicio';
import Productos from './pages/productos';
import Blogs from './pages/blogs';
import Carrito from './pages/carrito';
import Login from './pages/login';
import Registro from './pages/registro';
import DetalleProducto from './pages/detalleproducto';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';

// Páginas de Administrador
import Dashboard from './pages/admin/Dashboard';
import ProductosAdmin from './pages/admin/ProductosAdmin';
import UsuariosAdmin from './pages/admin/UsuariosAdmin';
import Ordenes from './pages/admin/Ordenes';
import AdminLayout from './components/admin/AdminLayout';

// MINI GUARDIÁN
const RutaAdministrador = ({ children }) => {
  const usuarioGuardado = localStorage.getItem('usuarioActivo');
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

  if (!usuario || !usuario.esAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Inicio />} />
          <Route path="menu" element={<Productos />} />
          <Route path="nosotros" element={<Nosotros />} />
          <Route path="blog" element={<Blogs />} />
          <Route path="contacto" element={<Contacto />} />
          <Route path="carrito" element={<Carrito />} />
          <Route path="login" element={<Login />} />
          <Route path="registro" element={<Registro />} />
          <Route path="producto/:id" element={<DetalleProducto />} />
        </Route>

          {/* TUS RUTAS AHORA ESTÁN PROTEGIDAS POR EL GUARDIÁN */}
          <Route path="/admin" element={<RutaAdministrador><AdminLayout /></RutaAdministrador>}>
            <Route index element={<Dashboard />} />
            <Route path="productos" element={<ProductosAdmin />} />
            <Route path="usuarios" element={<UsuariosAdmin />} />
            <Route path="ordenes" element={<Ordenes />} />
          </Route>
      </Routes>
    </Router>
  );
}           