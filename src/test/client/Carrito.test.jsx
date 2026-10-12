import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import * as CartContext from '../../context/CartContext.jsx';
import * as AuthContext from '../../context/AuthContext.jsx';
import Carrito from '../../pages/client/Carrito.jsx';

describe('Vista de Carrito', () => {
  const mockActualizarCantidad = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Simular contexto de usuario autenticado
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      usuario: { id: 1, nombre: 'Juan Pérez', email: 'juan@duoc.cl' }
    });

    // Simular contexto del carrito con 1 producto
    vi.spyOn(CartContext, 'useCart').mockReturnValue({
      itemsCarrito: [
        { id: 1, nombre: 'Pizza Mozzarella', precio: 8900, cantidad: 1, imagen: '/pizza.jpg' }
      ],
      cargandoCarrito: false,
      actualizarCantidad: mockActualizarCantidad,
      eliminarDelCarrito: vi.fn(),
      limpiarCarrito: vi.fn(),
      obtenerSubtotal: () => 8900,
      obtenerPrecioTotal: () => 8900,
      aplicarCupon: vi.fn(),
      descuentoPorcentaje: 0
    });
  });

  // TEST 1: Aumentar y disminuir cantidad
  it('Debe permitir hacer clic en los botones de aumentar (+) y disminuir (-) cantidad', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/carrito']}>
        <Carrito />
      </MemoryRouter>
    );

    const botonMas = screen.getByRole('button', { name: '+' });
    const botonMenos = screen.getByRole('button', { name: '-' });

    await user.click(botonMas);
    expect(mockActualizarCantidad).toHaveBeenCalledWith(1, 2);

    await user.click(botonMenos);
    expect(mockActualizarCantidad).toHaveBeenCalledWith(1, 0);
  });

  // TEST 2: Redirección al presionar Pagar
  it('Debe redirigir a la vista de /comprar al hacer clic en el botón Pagar', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/carrito']}>
        <Routes>
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/comprar" element={<h1>Página de Checkout</h1>} />
        </Routes>
      </MemoryRouter>
    );

    const botonPagar = screen.getByRole('button', { name: /pagar/i });
    await user.click(botonPagar);

    expect(screen.getByRole('heading', { name: /página de checkout/i })).toBeInTheDocument();
  });
});