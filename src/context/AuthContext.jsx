import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Inicialización síncrona desde localStorage para evitar pérdida de sesión al navegar
  const [usuario, setUsuario] = useState(() => {
    try {
      const usuarioGuardado = localStorage.getItem('usuarioActivo');
      return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
    } catch (error) {
      console.error('Error al recuperar la sesión guardada:', error);
      localStorage.removeItem('usuarioActivo');
      return null;
    }
  });

  // Iniciar sesión (guarda el usuario en el estado y en localStorage)
  const iniciarSesion = (datosUsuario) => {
    setUsuario(datosUsuario);
    localStorage.setItem('usuarioActivo', JSON.stringify(datosUsuario));
  };

  // Cerrar sesión (limpia el usuario y el estado local)
  const cerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem('usuarioActivo');
    localStorage.removeItem('carritoCompras');
  };

  // Verificar si el usuario actual tiene rol de Administrador
  const esAdministrador = () => {
    if (!usuario) return false;
    return Boolean(
      usuario.esadmin === 1 || 
      usuario.esadmin === true || 
      usuario.esAdmin === 1 || 
      usuario.esAdmin === true
    );
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        iniciarSesion,
        cerrarSesion,
        esAdministrador,

        // Alias de compatibilidad hacia atrás
        login: iniciarSesion,
        logout: cerrarSesion,
        isAdmin: esAdministrador
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};