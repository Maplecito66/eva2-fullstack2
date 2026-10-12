import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext.jsx';
import AdminSidebar from '../../components/admin/AdminSidebar.jsx';

describe('Menú Lateral del Administrador (Sidebar)', () => {
  it('Debe renderizar los enlaces principales del panel', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <AdminSidebar />
        </MemoryRouter>
      </AuthProvider>
    );

    // CORRECCIÓN 1: Buscamos "Panel Admin" tal como está en tu menú
    expect(screen.getByText(/Panel Admin/i)).toBeInTheDocument();
    expect(screen.getByText(/Productos/i)).toBeInTheDocument();
    expect(screen.getByText(/Usuarios/i)).toBeInTheDocument();
    expect(screen.getByText(/Órdenes/i)).toBeInTheDocument();
  });

  it('Debe renderizar el botón para volver a la Tienda', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <AdminSidebar />
        </MemoryRouter>
      </AuthProvider>
    );
    // CORRECCIÓN 2: Buscamos un 'link' (etiqueta <a>) en lugar de un 'button'
    expect(screen.getByRole('link', { name: /Ver Tienda/i })).toBeInTheDocument();
  });

  it('Debe renderizar el botón de Cerrar Sesión en rojo', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <AdminSidebar />
        </MemoryRouter>
      </AuthProvider>
    );
    // Este sí es un <button> real, así que queda igual
    expect(screen.getByRole('button', { name: /Cerrar Sesión/i })).toBeInTheDocument();
  });

  it('Debe renderizar el enlace principal al Dashboard', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <AdminSidebar />
        </MemoryRouter>
      </AuthProvider>
    );
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });
});


