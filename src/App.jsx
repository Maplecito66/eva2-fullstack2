import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Componentes
import Layout from './components/Layout';

//paginas
import Inicio from './pages/inicio';
import Productos from './pages/productos';
import Blogs from './pages/blogs';
import Carrito from './pages/carrito';
import Login from './pages/login';
import Registro from './pages/registro';
import DetalleProducto from './pages/detalleproducto';
import DatoCurioso1 from './pages/datocurioso1';
import DatoCurioso2 from './pages/datocurioso2';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';

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
          <Route path="blog/dato-curioso-1" element={<DatoCurioso1 />} />
          <Route path="blog/dato-curioso-2" element={<DatoCurioso2 />} />
        </Route>
      </Routes>
    </Router>
  );
}