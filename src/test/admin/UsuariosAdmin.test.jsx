import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UsuariosAdmin from '../../pages/admin/UsuariosAdmin.jsx';

describe('Vista de Administración de Usuarios', () => {
  it('Debe renderizar la interfaz de gestión de usuarios', () => {
    render(
      <MemoryRouter>
        <UsuariosAdmin />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Gestión de Usuarios/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Nombre/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Correo/i).length).toBeGreaterThan(0);
  });

  it('Debe renderizar el contenedor principal sin fallar', () => {
    const { container } = render(
      <MemoryRouter>
        <UsuariosAdmin />
      </MemoryRouter>
    );
    expect(container).not.toBeEmptyDOMElement();
  });

  it('Debe renderizar los encabezados de la tabla de usuarios', () => {
    render(
      <MemoryRouter>
        <UsuariosAdmin />
      </MemoryRouter>
    );
    expect(screen.getAllByText(/Región/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Comuna/i).length).toBeGreaterThan(0);
  });

  it('Debe renderizar el formulario para agregar un Nuevo Usuario', () => {
    render(
      <MemoryRouter>
        <UsuariosAdmin />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /Nuevo Usuario/i })).toBeInTheDocument();
  });
});