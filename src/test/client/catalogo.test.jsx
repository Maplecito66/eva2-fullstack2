import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext.jsx';
import { CartProvider } from '../../context/CartContext.jsx';
import Catalogo from '../../pages/client/catalogo.jsx';

// Datos de prueba simulados
const productosFalsos = [
  { id: 1, nombre: 'Sushi Roll', precio: 8900, categoria: 'saludable', imagen: '/sushi.jpg' },
  { id: 2, nombre: 'Hamburguesa', precio: 6500, categoria: 'pizzas-hamburguesas', imagen: '/burger.jpg' }
];

const categoriasFalsas = [
  { id_categoria: 1, nombre_categoria: 'saludable' },
  { id_categoria: 2, nombre_categoria: 'pizzas-hamburguesas' }
];

describe('Vista de Catálogo', () => {
  beforeEach(() => {
    // Simular las peticiones a la API para que no fallen por red
    vi.stubGlobal('fetch', vi.fn((url) => {
      if (url.includes('/api/categorias')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(categoriasFalsas)
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(productosFalsos)
      });
    }));
  });

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

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /nuestro menú gastronómico/i })).toBeInTheDocument();
    });
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

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /volver al menú/i })).toBeInTheDocument();
    });
  });

  // TEST 3: Filtrar por categoría al hacer clic en el menú lateral
  it('Debe filtrar los productos al hacer clic en una categoría del menú lateral', async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <CartProvider>
          <MemoryRouter initialEntries={['/categorias']}>
            <Catalogo />
          </MemoryRouter>
        </CartProvider>
      </AuthProvider>
    );

    // 1. Esperar a que se muestren ambos productos inicialmente
    await waitFor(() => {
      expect(screen.getByText('Sushi Roll')).toBeInTheDocument();
      expect(screen.getByText('Hamburguesa')).toBeInTheDocument();
    });

    // 2. Hacer clic en la categoría "Opción Saludable"
    const opcionSaludable = screen.getByText(/opción saludable/i);
    await user.click(opcionSaludable);

    // 3. Comprobar que solo muestra el producto de esa categoría
    expect(screen.getByText('Sushi Roll')).toBeInTheDocument();
    expect(screen.queryByText('Hamburguesa')).not.toBeInTheDocument();
  });

});