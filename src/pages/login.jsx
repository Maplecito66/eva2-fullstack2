import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMsg('');
    setIsError(false);

    const emailIngresado = email.trim().toLowerCase();

    if (!emailIngresado || !password) {
      setIsError(true);
      setErrorMsg('Por favor ingrese su correo y contraseña.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: emailIngresado,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // 1. Guardar usuario activo en localStorage
        localStorage.setItem('usuarioActivo', JSON.stringify(data.usuario));

        // 2. Notificar al Navbar/Header que la sesión cambió
        window.dispatchEvent(new Event('authChange'));

        // 3. Redirección según rol
        if (data.usuario.esAdmin) {
          navigate('/admin/dashboard'); // Redirige a pages/admin/Dashboard.jsx
        } else {
          navigate('/'); // Redirige a inicio.jsx
        }
      } else {
        setIsError(true);
        setErrorMsg(data.error || 'Correo o contraseña incorrectos.');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      setIsError(true);
      setErrorMsg('No se pudo conectar con el servidor backend.');
    }
  };

  return (
    <div className="container">
      <main className="main-content">
        <div className="form-card">
          <h2>Iniciar Sesión</h2>

          {errorMsg && (
            <div className="alert-error">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="email-login">Correo Electrónico</label>
              <input
                type="email"
                id="email-login"
                className={isError ? 'input-error' : ''}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (isError) setIsError(false);
                }}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="pass-login">Contraseña</label>
              <input
                type="password"
                id="pass-login"
                className={isError ? 'input-error' : ''}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (isError) setIsError(false);
                }}
                required
              />
            </div>

            <button type="submit" className="btn-primary form-btn">
              Entrar
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}