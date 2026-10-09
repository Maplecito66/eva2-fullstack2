import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Carrito() {
  const {
    cartItems,
    cargandoCarrito,
    updateQuantity,
    removeFromCart,
    clearCart,
    getSubtotal,
    getTotalPrice,
    aplicarCupon,
    descuentoPorcentaje
  } = useCart();

  const { usuario } = useAuth();
  const [codigoCupon, setCodigoCupon] = useState('');
  const [mensaje, setMensaje] = useState('');

  const formatearPrecio = (valor) => {
    return Number(valor || 0).toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP'
    });
  };

  const handleAplicarCupon = () => {
    if (!codigoCupon) return;
    const res = aplicarCupon(codigoCupon);
    setMensaje(res.mensaje);
  };

  const handlePagar = () => {
    if (cartItems.length === 0) {
      alert('El carrito está vacío.');
      return;
    }
    alert(`¡Gracias por tu compra${usuario ? ', ' + usuario.nombre : ''}!`);
    clearCart();
  };

  if (cargandoCarrito) {
    return (
      <div className="container">
        <main className="main-content" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h2>Cargando tu pedido...</h2>
        </main>
      </div>
    );
  }

  return (
    <div className="container">
      <main className="main-content" style={{ width: '100%' }}>
        <h2>Mi carrito de compras</h2>

        <div className="cart-layout">
          <div className="cart-items" id="cart-items-container">
            {cartItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <p>Tu carrito está vacío.</p>
                <Link to="/categorias" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
                  Ir al Menú
                </Link>
              </div>
            ) : (
              cartItems.map((prod) => (
                <div key={prod.id} className="cart-item">
                  <img
                    src={prod.imagen}
                    alt={prod.nombre}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Sin+Imagen'; }}
                  />
                  <div className="cart-item-info">
                    <h3>
                      {prod.nombre}
                      {prod.porcentaje_descuento > 0 && (
                        <span style={{ fontSize: '0.75rem', background: '#d32f2f', color: '#fff', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px' }}>
                          -{prod.porcentaje_descuento}% OFF
                        </span>
                      )}
                    </h3>
                    <p>{prod.descripcion}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {/* Precio con descuento o precio normal */}
                    {prod.porcentaje_descuento > 0 && prod.precioOriginal && (
                      <span style={{ textDecoration: 'line-through', color: '#888', fontSize: '0.85rem', display: 'block' }}>
                        {formatearPrecio(prod.precioOriginal * prod.cantidad)}
                      </span>
                    )}
                    <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: prod.porcentaje_descuento > 0 ? '#d32f2f' : 'inherit' }}>
                      {formatearPrecio(prod.precio * prod.cantidad)}
                    </span>

                    <div className="cart-item-controls" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      <button type="button" onClick={() => updateQuantity(prod.id, prod.cantidad - 1)}>-</button>
                      <input type="text" className="qty-input" value={prod.cantidad} readOnly style={{ width: '35px', textAlign: 'center' }} />
                      <button type="button" onClick={() => updateQuantity(prod.id, prod.cantidad + 1)}>+</button>
                      <button 
                        type="button" 
                        onClick={() => removeFromCart(prod.id)}
                        style={{ marginLeft: '0.5rem', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.2rem 0.5rem', cursor: 'pointer' }}
                        title="Eliminar producto"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="cart-summary">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span>SUBTOTAL:</span>
              <span>{formatearPrecio(getSubtotal())}</span>
            </div>

            {descuentoPorcentaje > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#2e7d32', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                <span>CUPÓN (10%):</span>
                <span>-{formatearPrecio(getSubtotal() * descuentoPorcentaje)}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.2rem', fontWeight: 'bold', borderTop: '1px solid #ccc', paddingTop: '0.8rem' }}>
              <span>TOTAL:</span>
              <span className="total-price" id="cart-total">
                {formatearPrecio(getTotalPrice())}
              </span>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <label htmlFor="coupon-code" style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '0.4rem' }}>
                Ingrese el cupón de descuento
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  id="coupon-code"
                  value={codigoCupon}
                  onChange={(e) => setCodigoCupon(e.target.value)}
                  placeholder="SABOR10"
                />
                <button type="button" className="btn-aplicar" onClick={handleAplicarCupon}>
                  APLICAR
                </button>
              </div>
              {mensaje && (
                <p style={{ fontSize: '0.85rem', marginTop: '0.4rem', color: descuentoPorcentaje > 0 ? '#2e7d32' : '#d32f2f' }}>
                  {mensaje}
                </p>
              )}
            </div>

            <button type="button" className="btn-pay" onClick={handlePagar} style={{ width: '100%', marginTop: '1.5rem' }}>
              PAGAR
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}