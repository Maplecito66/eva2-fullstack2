import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext.jsx';
import { CartProvider } from '../../context/CartContext.jsx';
import Catalogo from '../../pages/client/catalogo.jsx';

describe('Vista de Catálogo', () => {
  
  // TEST 1: Para la lista general de productos
  it('Debe renderizar el catálogo general y la lista de productos', async () => {
    render(
      <AuthProvider>
        <CartProvider>
          <MemoryRouter initialEntries={['/categorias']}>
            <Catalogo />
          </MemoryRouter>
        </CartProvider>
      </AuthProvider>
    );

    // Espera a que la carga finalice y se muestre el título principal del menú
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /nuestro menú gastronómico/i })).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  // TEST 2: Para el detalle de un producto específico
  it('Debe renderizar la vista de detalle cuando se pasa un ID de producto en la URL', async () => {
    render(
      <AuthProvider>
        <CartProvider>
          <MemoryRouter initialEntries={['/categorias?id=1']}>
            <Catalogo />
          </MemoryRouter>
        </CartProvider>
      </AuthProvider>
    );

    // Espera a que cargue el producto y se muestre el botón para volver al menú
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /volver al menú/i })).toBeInTheDocument();
    }, { timeout: 3000 });
  });

});