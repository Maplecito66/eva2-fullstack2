import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductosAdmin from '../../pages/admin/ProductosAdmin.jsx';

describe('Vista de Administración de Productos', () => {

  it('Debe renderizar el título y el formulario para un Nuevo Producto', () => {
    render(
      <MemoryRouter>
        <ProductosAdmin />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Gestión de Productos e Inventario/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Nuevo Producto/i })).toBeInTheDocument();

    // Usamos getAllByText porque las palabras se repiten en el formulario y la tabla
    expect(screen.getAllByText('Código').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Nombre').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Precio ($)').length).toBeGreaterThan(0);

    expect(screen.getByRole('button', { name: /Guardar Producto/i })).toBeInTheDocument();
  });

  it('Debe renderizar la tabla de Lista de Inventario', () => {
    render(
      <MemoryRouter>
        <ProductosAdmin />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Lista de Inventario/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Todos los Productos/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Stock Crítico/i })).toBeInTheDocument();
  });

});