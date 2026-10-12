import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ReportesAdmin from '../../pages/admin/ReportesAdmin.jsx';

describe('Vista de Administración de Reportes', () => {
  it('Debe renderizar el contenedor principal y el título de Reporte General', () => {
    render(
      <MemoryRouter>
        <ReportesAdmin />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /Reporte General de Registros/i })).toBeInTheDocument();
  });

  it('Debe contener las columnas de ID, Tipo de Reporte, Especialidad y Descripción', () => {
    render(
      <MemoryRouter>
        <ReportesAdmin />
      </MemoryRouter>
    );
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Tipo de Reporte')).toBeInTheDocument();
    expect(screen.getByText('Especialidad')).toBeInTheDocument();
    expect(screen.getByText('Descripción')).toBeInTheDocument();
  });
});