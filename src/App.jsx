import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Importar el hook del Contexto para usarlo en el Guardián
import { useAuth } from './context/AuthContext';

// Componentes
import Layout from './components/Client/Layout';

// Páginas Públicas 
import Inicio from './pages/client/Inicio';
import Categorias from './pages/client/catalogo';
import Blogs from './pages/client/Blogs';
import Carrito from './pages/client/Carrito';
import Login from './pages/client/Login';
import Registro from './pages/client/Registro';
import Nosotros from './pages/client/Nosotros';
import Contacto from './pages/client/Contacto';

// Páginas y Layout de Administrador
import Dashboard from './pages/admin/Dashboard';
import ProductosAdmin from './pages/admin/ProductosAdmin';
import UsuariosAdmin from './pages/admin/UsuariosAdmin';
import Ordenes from './pages/admin/Ordenes';
import AdminLayout from './components/admin/AdminLayout';
import CategoriasAdmin from './pages/admin/CategoriasAdmin';
import ReportesAdmin from './pages/admin/ReportesAdmin';
import PerfilAdmin from './pages/admin/PerfilAdmin';


// MINI GUARDIÁN PROFESIONAL
const RutaAdministrador = ({ children }) => {
  const { usuario, isAdmin } = useAuth(); // Ahora usa el Contexto global

  // Si no hay usuario o la función isAdmin() da falso, patada al inicio
  if (!usuario || !isAdmin()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Inicio />} />
          
          {/* Rutas unificadas a Categorias.jsx */}
          <Route path="categorias" element={<Categorias />} />
          <Route path="menu" element={<Categorias />} />
          
          <Route path="nosotros" element={<Nosotros />} />
          <Route path="blog" element={<Blogs />} />
          <Route path="contacto" element={<Contacto />} />
          <Route path="carrito" element={<Carrito />} />
          <Route path="login" element={<Login />} />
          <Route path="registro" element={<Registro />} />
        </Route>

        {/* RUTAS PROTEGIDAS DEL ADMINISTRADOR */}
        <Route path="/admin" element={<RutaAdministrador><AdminLayout /></RutaAdministrador>}>
          <Route index element={<Dashboard />} />
          <Route path="productos" element={<ProductosAdmin />} />
          <Route path="usuarios" element={<UsuariosAdmin />} />
          <Route path="ordenes" element={<Ordenes />} />
          <Route path="categorias" element={<CategoriasAdmin />} />
          <Route path="reportes" element={<ReportesAdmin />} />
          <Route path="perfil" element={<PerfilAdmin />} />
        </Route>
      </Routes>
    </Router>
  );
}