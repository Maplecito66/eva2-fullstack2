import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Nosotros from '../../pages/client/Nosotros.jsx';

describe('Vista de Nosotros', () => {
  it('Debe renderizar la sección de historia, misión, visión y valores', () => {
    render(<Nosotros />);

    // 1. Verificar el título de la historia principal
    expect(screen.getByRole('heading', { name: /nuestra historia/i })).toBeInTheDocument();

    // 2. Verificar la presencia de Misión y Visión
    expect(screen.getByText(/nuestra misión/i)).toBeInTheDocument();
    expect(screen.getByText(/nuestra visión/i)).toBeInTheDocument();

    // 3. Verificar la sección de valores
    expect(screen.getByRole('heading', { name: /nuestros valores/i })).toBeInTheDocument();
  });
});