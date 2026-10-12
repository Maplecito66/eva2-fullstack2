import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contacto from '../../pages/client/Contacto.jsx';

describe('Vista de Contacto', () => {
  it('Debe permitir llenar el formulario de contacto y mostrar mensaje de éxito al enviar', async () => {
    const user = userEvent.setup();

    render(<Contacto />);

    // 1. Capturar los campos del formulario
    const nombreInput = screen.getByLabelText(/nombre completo/i);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const comentarioInput = screen.getByLabelText(/comentario/i);
    const botonSubmit = screen.getByRole('button', { name: /enviar mensaje/i });

    // 2. Simular la interacción escribiendo datos válidos
    await user.type(nombreInput, 'Juan Pérez');
    await user.type(emailInput, 'juan.perez@gmail.com');
    await user.type(comentarioInput, 'Excelente servicio y muy buena comida.');

    // 3. Enviar el formulario
    await user.click(botonSubmit);

    // 4. Verificar que se despliegue la alerta de éxito
    expect(screen.getByText(/¡mensaje enviado con éxito!/i)).toBeInTheDocument();
  });
});