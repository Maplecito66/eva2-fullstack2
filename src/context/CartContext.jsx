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
  const [itemsCarrito, setItemsCarrito] = useState([]);
  const [cargandoCarrito, setCargandoCarrito] = useState(false);
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(0);

  const obtenerIdUsuario = useCallback((u) => {
    return u?.id || u?.id_usuario || u?.usuario_id || null;
  }, []);

  const calcularPrecioFinal = (prod) => {
    const precioBase = Number(prod.precioOriginal || prod.precio || 0);
    const porcentajeDesc = Number(prod.porcentaje_descuento || prod.descuento || 0);

    if (porcentajeDesc > 0 && porcentajeDesc < 100) {
      return Math.round(precioBase * (1 - porcentajeDesc / 100));
    }
    return precioBase;
  };

  // Cargar productos exclusivamente desde MySQL si hay usuario activo
  const cargarCarrito = useCallback(async () => {
    const userId = obtenerIdUsuario(usuario);

    if (!userId) {
      setItemsCarrito([]);
      setCargandoCarrito(false);
      return;
    }

    setCargandoCarrito(true);
    try {
      const res = await fetch(`http://localhost:5000/api/carrito?usuario_id=${userId}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
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
              precio: precioFinal,
              porcentaje_descuento: porcentajeDesc,
              imagen: item.imagen,
              cantidad: Number(item.cantidad)
            };
          });
          setItemsCarrito(itemsFormateados);
        }
      }
    } catch (err) {
      console.error('Error cargando carrito de MySQL:', err);
      setItemsCarrito([]);
    } finally {
      setCargandoCarrito(false);
    }
  }, [usuario, obtenerIdUsuario]);

  useEffect(() => {
    cargarCarrito();
  }, [cargarCarrito]);

  // Agregar producto (Verifica autenticación previa)
  const agregarAlCarrito = async (producto) => {
    const userId = obtenerIdUsuario(usuario);
    if (!userId) {
      return { exito: false, requiereLogin: true };
    }

    const precioBase = Number(producto.precioOriginal || producto.precio || 0);
    const porcentajeDesc = Number(producto.porcentaje_descuento || producto.descuento || 0);
    const precioFinal = calcularPrecioFinal({ precio: precioBase, porcentaje_descuento: porcentajeDesc });

    const productoConOferta = {
      ...producto,
      precioOriginal: precioBase,
      precio: precioFinal,
      porcentaje_descuento: porcentajeDesc
    };

    setItemsCarrito(prevItems => {
      const existe = prevItems.find(item => item.id === producto.id);
      if (existe) {
        return prevItems.map(item =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prevItems, { ...productoConOferta, cantidad: 1 }];
    });

    try {
      await fetch('http://localhost:5000/api/carrito', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: userId,
          producto_id: producto.id,
          cantidad: 1,
          precio_unitario: precioFinal
        })
      });
      return { exito: true };
    } catch (err) {
      console.error('Error al guardar en BD:', err);
      return { exito: true };
    }
  };

  const actualizarCantidad = async (productoId, nuevaCantidad) => {
    const userId = obtenerIdUsuario(usuario);
    if (!userId) return;

    if (nuevaCantidad <= 0) {
      await eliminarDelCarrito(productoId);
      return;
    }

    setItemsCarrito(prevItems =>
      prevItems.map(item =>
        item.id === productoId ? { ...item, cantidad: nuevaCantidad } : item
      )
    );

    try {
      await fetch(`http://localhost:5000/api/carrito/${productoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: userId,
          cantidad: nuevaCantidad
        })
      });
    } catch (err) {
      console.error('Error actualizando cantidad en BD:', err);
    }
  };

  const eliminarDelCarrito = async (productoId) => {
    const userId = obtenerIdUsuario(usuario);
    if (!userId) return;

    setItemsCarrito(prevItems => prevItems.filter(item => item.id !== productoId));

    try {
      await fetch(`http://localhost:5000/api/carrito/${productoId}?usuario_id=${userId}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Error eliminando producto de BD:', err);
    }
  };

  const limpiarCarrito = async () => {
    const userId = obtenerIdUsuario(usuario);
    setItemsCarrito([]);
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

  const obtenerTotalItems = () => {
    if (!usuario) return 0;
    return itemsCarrito.reduce((total, item) => total + (Number(item.cantidad) || 1), 0);
  };

  const obtenerSubtotal = () => {
    return itemsCarrito.reduce(
      (total, item) => total + Number(item.precio || 0) * (Number(item.cantidad) || 1),
      0
    );
  };

  const obtenerPrecioTotal = () => {
    const subtotal = obtenerSubtotal();
    return Math.round(subtotal * (1 - descuentoPorcentaje));
  };

  const aplicarCupon = (codigo) => {
    const cuponLimpio = codigo.trim().toUpperCase();
    if (cuponLimpio === 'SABOR10') {
      setDescuentoPorcentaje(0.10);
      return { exito: true, mensaje: '¡Cupón del 10% aplicado correctamente!' };
    }
    return { exito: false, mensaje: 'Cupón no válido.' };
  };

  return (
    <CartContext.Provider
      value={{
        itemsCarrito,
        cargandoCarrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        actualizarCantidad,
        limpiarCarrito,
        obtenerTotalItems,
        obtenerSubtotal,
        obtenerPrecioTotal,
        aplicarCupon,
        descuentoPorcentaje
      }}
    >
      {children}
    </CartContext.Provider>
  );
};