import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext.jsx';
import Login from '../../pages/client/Login.jsx';

describe('Vista de Login', () => {
  it('Debe renderizar el formulario de inicio de sesión y permitir ingresar datos', async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthProvider>
    );

    // 1. Verificar el título principal
    expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();

    // 2. Capturar los campos del formulario y el botón
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const botonSubmit = screen.getByRole('button', { name: /iniciar sesión/i });

    // 3. Simular la interacción escribiendo datos de prueba
    await user.type(emailInput, 'profesor@duoc.cl');
    await user.type(passwordInput, '123456');

    // 4. Comprobar que los campos recibieron el texto correctamente
    expect(emailInput).toHaveValue('profesor@duoc.cl');
    expect(passwordInput).toHaveValue('123456');
    expect(botonSubmit).toBeInTheDocument();
  });
});