import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Registro from '../../pages/client/Registro.jsx';

describe('Vista de Registro', () => {
  it('Debe permitir completar los campos del formulario de registro correctamente', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>
    );

    // 1. Capturar los inputs del formulario
    const nombreInput = screen.getByLabelText(/nombre completo/i);
    const emailInput = screen.getByLabelText(/^correo$/i);
    const confirmarEmailInput = screen.getByLabelText(/correo \(confirmación\)/i);
    const passwordInput = screen.getByLabelText(/^contraseña$/i);
    const confirmarPasswordInput = screen.getByLabelText(/confirmar contraseña/i);

    // 2. Simular el llenado de los datos por parte del usuario
    await user.type(nombreInput, 'Juan Pérez');
    await user.type(emailInput, 'juan.perez@duoc.cl');
    await user.type(confirmarEmailInput, 'juan.perez@duoc.cl');
    await user.type(passwordInput, '123456');
    await user.type(confirmarPasswordInput, '123456');

    // 3. Comprobar que los campos recibieron los valores esperados
    expect(nombreInput).toHaveValue('Juan Pérez');
    expect(emailInput).toHaveValue('juan.perez@duoc.cl');
    expect(confirmarEmailInput).toHaveValue('juan.perez@duoc.cl');
    expect(passwordInput).toHaveValue('123456');
    expect(confirmarPasswordInput).toHaveValue('123456');

    // 4. Verificar presencia del botón para registrarse
    const botonSubmit = screen.getByRole('button', { name: /registrarse/i });
    expect(botonSubmit).toBeInTheDocument();
  });
});