const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Ruta de prueba inicial
app.get('/', (req, res) => {
  res.send('Servidor Backend Sabor & Aroma funcionando correctamente');
});

// Endpoint para obtener todos los productos de Laragon
app.get('/api/productos', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM productos');
    res.json(results);
  } catch (error) {
    console.error('Error al consultar productos:', error);
    res.status(500).json({ error: 'Error al consultar productos.' });
  }
});

// Endpoint para registro de usuarios
app.post('/api/registro', async (req, res) => {
  const { nombre, email, password, region, comuna } = req.body;
  const sql = 'INSERT INTO usuarios (nombre, email, password, region, comuna) VALUES (?, ?, ?, ?, ?)';

  try {
    const [result] = await db.query(sql, [nombre, email, password, region, comuna]);
    res.status(201).json({ mensaje: 'Usuario registrado con éxito', id: result.insertId });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }
    res.status(500).json({ error: 'Error al registrar en la base de datos.' });
  }
});

// Endpoint para inicio de sesión (Login)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  // Incluimos esAdmin (o es_admin AS esAdmin según la columna de tu BD)
  const sql = 'SELECT id, nombre, email, region, comuna, esAdmin FROM usuarios WHERE email = ? AND password = ?';

  try {
    const [results] = await db.query(sql, [email, password]);

    if (results.length > 0) {
      res.json({ mensaje: 'Inicio de sesión exitoso', usuario: results[0] });
    } else {
      res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    }
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al consultar usuario.' });
  }
});

// -------------------------------------------------------------
// ENDPOINTS DEL CARRITO EN BASE DE DATOS
// -------------------------------------------------------------

// 1. OBTENER EL CARRITO DE UN USUARIO
app.get('/api/carrito/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;

  try {
    const query = `
      SELECT c.id AS carrito_id, c.cantidad, p.id AS producto_id, p.nombre, p.precio, p.imagen, p.descripcion
      FROM carrito c
      JOIN productos p ON c.producto_id = p.id
      WHERE c.usuario_id = ?
    `;
    const [items] = await db.query(query, [usuario_id]);
    res.json(items);
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(500).json({ error: 'Error al obtener el carrito.' });
  }
});

// 2. AGREGAR PRODUCTO AL CARRITO (Si ya existe, incrementa la cantidad)
app.post('/api/carrito', async (req, res) => {
  const { usuario_id, producto_id, cantidad = 1 } = req.body;

  if (!usuario_id || !producto_id) {
    return res.status(400).json({ error: 'Faltan datos requeridos (usuario_id o producto_id).' });
  }

  try {
    const query = `
      INSERT INTO carrito (usuario_id, producto_id, cantidad)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE cantidad = cantidad + VALUES(cantidad)
    `;
    await db.query(query, [usuario_id, producto_id, cantidad]);
    res.status(200).json({ mensaje: 'Producto agregado al carrito.' });
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    res.status(500).json({ error: 'Error al guardar en el carrito.' });
  }
});

// 3. ACTUALIZAR CANTIDAD DE UN ITEM EN EL CARRITO
app.put('/api/carrito/:carrito_id', async (req, res) => {
  const { carrito_id } = req.params;
  const { cantidad } = req.body;

  if (cantidad <= 0) {
    return res.status(400).json({ error: 'La cantidad debe ser mayor a 0.' });
  }

  try {
    await db.query('UPDATE carrito SET cantidad = ? WHERE id = ?', [cantidad, carrito_id]);
    res.json({ mensaje: 'Cantidad actualizada correctamente.' });
  } catch (error) {
    console.error('Error al actualizar item:', error);
    res.status(500).json({ error: 'Error al actualizar el item.' });
  }
});

// 4. ELIMINAR UN UNICO ITEM DEL CARRITO
app.delete('/api/carrito/:carrito_id', async (req, res) => {
  const { carrito_id } = req.params;

  try {
    await db.query('DELETE FROM carrito WHERE id = ?', [carrito_id]);
    res.json({ mensaje: 'Producto eliminado del carrito.' });
  } catch (error) {
    console.error('Error al eliminar item:', error);
    res.status(500).json({ error: 'Error al eliminar el item.' });
  }
});

// 5. PROCESAR COMPRA (PAGAR) -> Convierte el carrito en Orden y vacía el carrito
app.post('/api/ordenes', async (req, res) => {
  const { usuario_id, total } = req.body;

  if (!usuario_id || total == null) {
    return res.status(400).json({ error: 'Datos de la orden incompletos.' });
  }

  try {
    // A. Obtener los productos actuales del carrito del usuario
    const [itemsCarrito] = await db.query(
      'SELECT producto_id, cantidad, p.precio FROM carrito c JOIN productos p ON c.producto_id = p.id WHERE c.usuario_id = ?',
      [usuario_id]
    );

    if (itemsCarrito.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío.' });
    }

    // B. Crear la orden principal
    const [resultOrden] = await db.query(
      'INSERT INTO ordenes (usuario_id, total) VALUES (?, ?)',
      [usuario_id, total]
    );
    const ordenId = resultOrden.insertId;

    // C. Guardar cada ítem en detalle_ordenes
    for (const item of itemsCarrito) {
      await db.query(
        'INSERT INTO detalle_ordenes (orden_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
        [ordenId, item.producto_id, item.cantidad, item.precio]
      );
    }

    // D. Limpiar el carrito del usuario en MySQL
    await db.query('DELETE FROM carrito WHERE usuario_id = ?', [usuario_id]);

    res.status(201).json({ mensaje: 'Compra procesada exitosamente', ordenId });
  } catch (error) {
    console.error('Error al procesar la compra:', error);
    res.status(500).json({ error: 'Error al procesar la compra.' });
  }
});

// Levantar el servidor al final
app.listen(5000, () => {
  console.log('🚀 Servidor Backend corriendo en http://localhost:5000');
});