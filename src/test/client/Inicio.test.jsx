import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Inicio from '../../pages/client/Inicio.jsx';

describe('Vista de Inicio', () => {
  it('Debe renderizar los elementos principales de la página', () => {
    render(
      <MemoryRouter>
        <Inicio />
      </MemoryRouter>
    );

    // 1. Verificar el título principal
    expect(screen.getByText('¡Comida deliciosa directo a tu puerta!')).toBeInTheDocument();

    // 2. Verificar el botón de ver menú completo
    expect(screen.getByRole('link', { name: /ver menú completo/i })).toBeInTheDocument();

    // 3. Verificar las imágenes destacadas del carrusel
    expect(screen.getByAltText('Sushi destacado')).toBeInTheDocument();
  });
});