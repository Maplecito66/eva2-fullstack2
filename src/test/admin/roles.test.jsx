import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// Simulamos un componente básico de tu panel de usuarios para testear la lógica (CPU)
const EtiquetaRol = ({ esadmin }) => {
  return (
    <span className={`badge ${esadmin ? 'bg-primary' : 'bg-info text-dark'}`}>
      {esadmin ? 'Administración' : 'Cliente'}
    </span>
  );
};

describe('Lógica del Panel de Administración (Roles)', () => {
  
  it('Debe renderizar la etiqueta correcta para un Administrador (esadmin = 1)', () => {
    render(<EtiquetaRol esadmin={1} />);
    
    // Verifica que el texto "Administración" aparezca en pantalla
    const etiqueta = screen.getByText('Administración');
    expect(etiqueta).toBeInTheDocument();
    
    // Verifica que tenga la clase correcta (bg-primary)
    expect(etiqueta.className).toContain('bg-primary');
  });

  it('Debe renderizar la etiqueta correcta para un Cliente (esadmin = 0)', () => {
    render(<EtiquetaRol esadmin={0} />);
    
    // Verifica que el texto "Cliente" aparezca en pantalla
    const etiqueta = screen.getByText('Cliente');
    expect(etiqueta).toBeInTheDocument();
    
    // Verifica que tenga la clase correcta (bg-info)
    expect(etiqueta.className).toContain('bg-info');
  });

});