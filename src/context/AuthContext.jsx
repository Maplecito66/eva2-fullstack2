import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuarioActivo');
    if (usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch (error) {
        console.error('Error al cargar el usuario:', error);
        localStorage.removeItem('usuarioActivo');
      }
    }
    setCargando(false);
  }, []);

  const login = (userData) => {
    setUsuario(userData);
    localStorage.setItem('usuarioActivo', JSON.stringify(userData));
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuarioActivo');
  };

  const isAdmin = () => Boolean(usuario?.esAdmin);

  return (
    <AuthContext.Provider value={{ usuario, login, logout, isAdmin, cargando }}>
      {!cargando && children}
    </AuthContext.Provider>
  );
};