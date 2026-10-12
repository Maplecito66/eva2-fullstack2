import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from '../../pages/client/Blogs.jsx';

// Simular scrollTo para evitar errores de JSDOM al cambiar de artículo
window.scrollTo = vi.fn();

describe('Vista de Blog', () => {

  // TEST 1: Estado inicial (null)
  it('Debe renderizar la lista principal de noticias y eventos por defecto', () => {
    render(<Blog />);

    // Verificar título principal del blog y tarjetas de noticias
    expect(screen.getByRole('heading', { name: /noticias y próximos eventos/i })).toBeInTheDocument();
    expect(screen.getByText(/evento: la noche del queso infinito/i)).toBeInTheDocument();
    expect(screen.getByText(/evento: frappé fest de temporada/i)).toBeInTheDocument();
  });

  // TEST 2: Detalle del Artículo 1 (Pizza)
  it('Debe mostrar el detalle de "La Noche del Queso Infinito" al hacer clic en su botón', async () => {
    const user = userEvent.setup();
    render(<Blog />);

    // Obtener los botones de "MÁS INFORMACIÓN Y DETALLES" y hacer clic en el primero
    const botones = screen.getAllByRole('button', { name: /más información y detalles/i });
    await user.click(botones[0]);

    // Verificar encabezado del artículo 1 y el botón para volver
    expect(screen.getByRole('heading', { name: /la noche del queso infinito/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /volver a noticias y eventos/i })).toBeInTheDocument();
  });

  // TEST 3: Detalle del Artículo 2 (Frappé)
  it('Debe mostrar el detalle de "Frappé Fest" al hacer clic en su botón', async () => {
    const user = userEvent.setup();
    render(<Blog />);

    // Hacer clic en el segundo botón de "MÁS INFORMACIÓN Y DETALLES"
    const botones = screen.getAllByRole('button', { name: /más información y detalles/i });
    await user.click(botones[1]);

    // Verificar encabezado del artículo 2 y el botón para volver
    expect(screen.getByRole('heading', { name: /frappé fest/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /volver a noticias y eventos/i })).toBeInTheDocument();
  });

});