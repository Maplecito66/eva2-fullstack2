import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        iniciarSesion(data.usuario);

        const esAdmin = Boolean(
          data.usuario.esadmin === 1 || 
          data.usuario.esadmin === true || 
          data.usuario.esAdmin === 1 ||
          data.usuario.esAdmin === true
        );

        if (esAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(data.error || 'Correo o contraseña incorrectos.');
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError('No se pudo conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card-split">
        <div className="login-image-side">
          <img 
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80" 
            alt="Gastronomía Sabor & Aroma" 
          />
          <div className="login-image-overlay">
            <h3>¡Bienvenido a Sabor & Aroma!</h3>
            <p>Accede para disfrutar de promociones exclusivas y gestionar tus pedidos.</p>
          </div>
        </div>

        <div className="login-form-side">
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
            Iniciar Sesión
          </h2>

          {error && <div className="alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>

            <div className="form-group mb-3">
              <FloatingLabel controlId="email" label="Correo Electrónico">
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  required
                />
              </FloatingLabel>
            </div>

            {/* CONTRASEÑA */}
            <div className="form-group mb-3">
              <FloatingLabel controlId="password" label="Contraseña">
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </FloatingLabel>
            </div>

            <button type="submit" className="btn-primary form-btn" disabled={cargando}>
              {cargando ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <p className="form-footer-text">
            ¿No tienes una cuenta? <Link to="/registro" className="link-bold-primary">Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
}