import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext.jsx';
import { CartProvider } from '../../context/CartContext.jsx';
import Ofertas from '../../pages/client/Ofertas.jsx';

// Producto de prueba simulado con descuento activo
const productosMock = [
  {
    id: 1,
    nombre: 'Pizza en Oferta',
    precio: 10000,
    porcentaje_descuento: 20,
    descripcion: 'Deliciosa pizza artesanal con descuento',
    imagen: '/pizza.jpg'
  }
];

describe('Vista de Ofertas', () => {
  beforeEach(() => {
    // Simular la respuesta de la API de productos
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(productosMock)
      })
    ));
  });

  it('Debe renderizar el título principal y la lista de productos en oferta', async () => {
    render(
      <AuthProvider>
        <CartProvider>
          <MemoryRouter>
            <Ofertas />
          </MemoryRouter>
        </CartProvider>
      </AuthProvider>
    );

    // Espera a que termine la carga de datos de la API
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /ofertas & descuentos especiales/i })).toBeInTheDocument();
      expect(screen.getByText('Pizza en Oferta')).toBeInTheDocument();
      expect(screen.getByText('-20% OFF')).toBeInTheDocument();
    });
  });
});