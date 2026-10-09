import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { usuario } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cargandoCarrito, setCargandoCarrito] = useState(false);
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(0);

  const getUserId = useCallback((u) => {
    return u?.id || u?.id_usuario || u?.usuario_id || null;
  }, []);

  // Función helper para calcular el precio final con oferta
  const calcularPrecioFinal = (prod) => {
    const precioBase = Number(prod.precioOriginal || prod.precio || 0);
    const porcentajeDesc = Number(prod.porcentaje_descuento || prod.descuento || 0);

    if (porcentajeDesc > 0 && porcentajeDesc < 100) {
      return Math.round(precioBase * (1 - porcentajeDesc / 100));
    }
    return precioBase;
  };

  // Cargar productos desde MySQL o LocalStorage
  const cargarCarrito = useCallback(async () => {
    setCargandoCarrito(true);
    const userId = getUserId(usuario);

    if (userId) {
      try {
        const res = await fetch(`http://localhost:5000/api/carrito?usuario_id=${userId}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const itemsFormateados = data.map(item => {
              const precioBase = Number(item.precio_original || item.precio || 0);
              const porcentajeDesc = Number(item.porcentaje_descuento || item.descuento || 0);
              const precioFinal = calcularPrecioFinal({ precio: precioBase, porcentaje_descuento: porcentajeDesc });

              return {
                id: item.producto_id || item.id,
                id_carrito: item.id_carrito || item.id,
                nombre: item.nombre,
                descripcion: item.descripcion,
                precioOriginal: precioBase,
                precio: precioFinal, // Precio con descuento ya aplicado
                porcentaje_descuento: porcentajeDesc,
                imagen: item.imagen,
                cantidad: Number(item.cantidad)
              };
            });
            setCartItems(itemsFormateados);
            setCargandoCarrito(false);
            return;
          }
        }
      } catch (err) {
        console.warn('No se pudo conectar con la BD del carrito, usando respaldo local:', err);
      }
    }

    const savedCart = localStorage.getItem('carritoCompras');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (err) {
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
    setCargandoCarrito(false);
  }, [usuario, getUserId]);

  useEffect(() => {
    cargarCarrito();
  }, [cargarCarrito]);

  useEffect(() => {
    localStorage.setItem('carritoCompras', JSON.stringify(cartItems));
  }, [cartItems]);

  // Agregar producto procesando la oferta antes de guardarlo
  const addToCart = async (product) => {
    const userId = getUserId(usuario);

    const precioBase = Number(product.precioOriginal || product.precio || 0);
    const porcentajeDesc = Number(product.porcentaje_descuento || product.descuento || 0);
    const precioFinal = calcularPrecioFinal({ precio: precioBase, porcentaje_descuento: porcentajeDesc });

    const productoConOferta = {
      ...product,
      precioOriginal: precioBase,
      precio: precioFinal, // Este es el precio efectivamente cobrado
      porcentaje_descuento: porcentajeDesc
    };

    setCartItems(prevItems => {
      const existing = prevItems.find(item => item.id === product.id);
      if (existing) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prevItems, { ...productoConOferta, cantidad: 1 }];
    });

    if (userId) {
      try {
        await fetch('http://localhost:5000/api/carrito', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usuario_id: userId,
            producto_id: product.id,
            cantidad: 1,
            precio_unitario: precioFinal
          })
        });
      } catch (err) {
        console.error('Error al guardar en BD:', err);
      }
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    const userId = getUserId(usuario);

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, cantidad: newQuantity } : item
      )
    );

    if (userId) {
      try {
        await fetch(`http://localhost:5000/api/carrito/${productId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usuario_id: userId,
            cantidad: newQuantity
          })
        });
      } catch (err) {
        console.error('Error actualizando cantidad en BD:', err);
      }
    }
  };

  const removeFromCart = async (productId) => {
    const userId = getUserId(usuario);

    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));

    if (userId) {
      try {
        await fetch(`http://localhost:5000/api/carrito/${productId}?usuario_id=${userId}`, {
          method: 'DELETE'
        });
      } catch (err) {
        console.error('Error eliminando producto en BD:', err);
      }
    }
  };

  const clearCart = async () => {
    const userId = getUserId(usuario);

    setCartItems([]);
    localStorage.removeItem('carritoCompras');
    setDescuentoPorcentaje(0);

    if (userId) {
      try {
        await fetch(`http://localhost:5000/api/carrito/vaciar?usuario_id=${userId}`, {
          method: 'DELETE'
        });
      } catch (err) {
        console.error('Error vaciando carrito en BD:', err);
      }
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + (Number(item.cantidad) || 1), 0);
  };

  const getSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + Number(item.precio || 0) * (Number(item.cantidad) || 1),
      0
    );
  };

  const getTotalPrice = () => {
    const subtotal = getSubtotal();
    return Math.round(subtotal * (1 - descuentoPorcentaje));
  };

  const aplicarCupon = (codigo) => {
    const cuponLimpio = codigo.trim().toUpperCase();
    if (cuponLimpio === 'SABOR10') {
      setDescuentoPorcentaje(0.10);
      return { exito: true, mensaje: '¡Cupón global del 10% aplicado correctamente!' };
    }
    return { exito: false, mensaje: 'Cupón no válido.' };
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cargandoCarrito,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getSubtotal,
        getTotalPrice,
        aplicarCupon,
        descuentoPorcentaje
      }}
    >
      {children}
    </CartContext.Provider>
  );
};