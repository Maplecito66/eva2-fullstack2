const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor Backend Sabor & Aroma funcionando correctamente');
});

// =============================================================
// 1. ENDPOINTS DE REGIONES Y COMUNAS
// =============================================================

// Obtener todas las regiones desde MySQL
app.get('/api/regiones', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM regiones ORDER BY nombre_region ASC');
    res.json(results);
  } catch (error) {
    console.error('Error al consultar regiones:', error);
    res.status(500).json({ error: 'Error al obtener las regiones de la base de datos.' });
  }
});

// Obtener comunas filtradas por nombre o ID de región
app.get('/api/comunas', async (req, res) => {
  const { region } = req.query;
  try {
    let query = 'SELECT c.id_comuna, c.nombre_comuna FROM comunas c';
    let params = [];

    if (region) {
      query += ' JOIN regiones r ON c.id_region = r.id_region WHERE r.nombre_region = ? OR r.id_region = ?';
      params.push(region, region);
    }

    query += ' ORDER BY c.nombre_comuna ASC';

    const [results] = await db.query(query, params);
    res.json(results);
  } catch (error) {
    console.error('Error al consultar comunas:', error);
    res.status(500).json({ error: 'Error al obtener las comunas de la base de datos.' });
  }
});

// =============================================================
// 2. ENDPOINTS DE CATEGORÍAS
// =============================================================

// Leer categorías
app.get('/api/categorias', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM categorias ORDER BY id_categoria ASC');
    res.json(results);
  } catch (error) {
    console.error('Error al consultar categorías:', error);
    res.status(500).json({ error: 'Error al consultar las categorías.' });
  }
});

// Crear nueva categoría
app.post('/api/categorias', async (req, res) => {
  const { nombre_categoria } = req.body;
  try {
    const [result] = await db.query('INSERT INTO categorias (nombre_categoria) VALUES (?)', [nombre_categoria]);
    
    // --- MAGIA DEL HISTORIAL ---
    await db.query(
      'INSERT INTO reportes (tipo_reporte, especialidad, descripcion) VALUES (?, ?, ?)',
      ['Categoría', 'Nuevo', `Se creó la categoría: ${nombre_categoria}`]
    );
    // ---------------------------

    res.status(201).json({ mensaje: 'Categoría creada con éxito', id: result.insertId });
  } catch (error) {
    console.error('Error POST categoría:', error);
    res.status(500).json({ error: 'Error al guardar la categoría.' });
  }
});

// Editar categoría
app.put('/api/categorias/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre_categoria } = req.body;
  try {
    await db.query('UPDATE categorias SET nombre_categoria = ? WHERE id_categoria = ?', [nombre_categoria, id]);
    
    // --- MAGIA DEL HISTORIAL ---
    await db.query(
      'INSERT INTO reportes (tipo_reporte, especialidad, descripcion) VALUES (?, ?, ?)',
      ['Categoría', 'Editar', `Se editó la categoría ID ${id} a: ${nombre_categoria}`]
    );
    // ---------------------------

    res.json({ mensaje: 'Categoría actualizada correctamente' });
  } catch (error) {
    console.error('Error PUT categoría:', error);
    res.status(500).json({ error: 'Error al actualizar la categoría.' });
  }
});

// Eliminar categoría
app.delete('/api/categorias/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM categorias WHERE id_categoria = ?', [req.params.id]);

    // --- MAGIA DEL HISTORIAL ---
    await db.query(
      'INSERT INTO reportes (tipo_reporte, especialidad, descripcion) VALUES (?, ?, ?)',
      ['Categoría', 'Eliminar', `Se eliminó la categoría con ID: ${req.params.id}`]
    );
    // ---------------------------

    res.json({ mensaje: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error('Error DELETE categoría:', error);
    res.status(500).json({ error: 'Error al eliminar la categoría.' });
  }
});

// =============================================================
// 3. ENDPOINTS DE PRODUCTOS
// =============================================================

// Obtener catálogo público con categorías y ofertas
app.get('/api/productos', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.id,
        p.codigo,
        p.nombre,
        p.descripcion,
        p.precio,
        p.stock,
        p.imagen,
        p.id_categoria,
        c.nombre_categoria AS categoria,
        p.id_oferta,
        o.porcentaje_descuento
      FROM productos p
      INNER JOIN categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN ofertas o ON p.id_oferta = o.id_oferta
    `;
    const [results] = await db.query(query);
    res.json(results);
  } catch (error) {
    console.error('Error al consultar productos:', error);
    res.status(500).json({ error: 'Error al consultar productos.' });
  }
});

// Detalle de producto por ID
app.get('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT 
        p.id,
        p.codigo,
        p.nombre,
        p.descripcion,
        p.precio,
        p.stock,
        p.imagen,
        p.id_categoria,
        c.nombre_categoria AS categoria,
        p.id_oferta,
        o.porcentaje_descuento
      FROM productos p
      INNER JOIN categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN ofertas o ON p.id_oferta = o.id_oferta
      WHERE p.id = ?
    `;
    const [results] = await db.query(query, [id]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    res.json(results[0]);
  } catch (error) {
    console.error('Error al consultar detalle del producto:', error);
    res.status(500).json({ error: 'Error al consultar el producto.' });
  }
});

// Filtrar productos por categoría
app.get('/api/productos/categoria/:categoria', async (req, res) => {
  const { categoria } = req.params;
  try {
    const query = `
      SELECT 
        p.id,
        p.codigo,
        p.nombre,
        p.descripcion,
        p.precio,
        p.stock,
        p.imagen,
        p.id_categoria,
        c.nombre_categoria AS categoria,
        p.id_oferta,
        o.porcentaje_descuento
      FROM productos p
      INNER JOIN categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN ofertas o ON p.id_oferta = o.id_oferta
      WHERE c.nombre_categoria = ? OR c.id_categoria = ?
    `;
    const [results] = await db.query(query, [categoria, categoria]);
    res.json(results);
  } catch (error) {
    console.error('Error al consultar productos por categoría:', error);
    res.status(500).json({ error: 'Error al filtrar productos.' });
  }
});

// =============================================================
// 4. ENDPOINTS DE AUTENTICACIÓN Y USUARIOS
// =============================================================

// Registro de usuarios con validación de rol admin según el correo
app.post('/api/registro', async (req, res) => {
  const { nombre, email, password, region, comuna, telefono, esadmin } = req.body;

  // Detección automática: si termina en @profesor.duoc.cl es Administrador (1)
  const esAdminRol = (email && email.toLowerCase().endsWith('@profesor.duoc.cl')) ? 1 : (esadmin || 0);

  const sql = 'INSERT INTO usuarios (nombre, email, password, region, comuna, telefono, esadmin) VALUES (?, ?, ?, ?, ?, ?, ?)';

  try {
    const [result] = await db.query(sql, [nombre, email, password, region, comuna, telefono || null, esAdminRol]);
    res.status(201).json({ 
      mensaje: 'Usuario registrado con éxito', 
      id: result.insertId,
      esadmin: esAdminRol 
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }
    res.status(500).json({ error: 'Error al registrar usuario en la base de datos.' });
  }
});

// Login de usuarios
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT id, nombre, email, region, comuna, telefono, esadmin FROM usuarios WHERE email = ? AND password = ?';

  try {
    const [results] = await db.query(sql, [email, password]);

    if (results.length > 0) {
      res.json({ mensaje: 'Inicio de sesión exitoso', usuario: results[0] });
    } else {
      res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    }
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al verificar credenciales.' });
  }
});

// CRUD de Usuarios para el Panel Administrador
app.get('/api/usuarios', async (req, res) => {
  try {
    const [results] = await db.query('SELECT id, nombre, email, region, comuna, telefono, esadmin FROM usuarios ORDER BY id DESC');
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar usuarios.' });
  }
});

app.post('/api/usuarios', async (req, res) => {
  const { nombre, email, password, region, comuna, telefono, esadmin } = req.body;
  const sql = 'INSERT INTO usuarios (nombre, email, password, region, comuna, telefono, esadmin) VALUES (?, ?, ?, ?, ?, ?, ?)';
  try {
    const [result] = await db.query(sql, [nombre, email, password, region, comuna, telefono || null, esadmin || 0]);
    res.status(201).json({ mensaje: 'Usuario creado con éxito', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el usuario.' });
  }
});

app.put('/api/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, email, password, region, comuna, telefono, esadmin } = req.body;
  try {
    if (password) {
      await db.query('UPDATE usuarios SET nombre=?, email=?, password=?, region=?, comuna=?, telefono=?, esadmin=? WHERE id=?', [nombre, email, password, region, comuna, telefono, esadmin, id]);
    } else {
      await db.query('UPDATE usuarios SET nombre=?, email=?, region=?, comuna=?, telefono=?, esadmin=? WHERE id=?', [nombre, email, region, comuna, telefono, esadmin, id]);
    }
    res.json({ mensaje: 'Usuario actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el usuario.' });
  }
});

app.delete('/api/usuarios/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM usuarios WHERE id = ?', [req.params.id]);
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario.' });
  }
});

// =============================================================
// 5. ENDPOINTS DEL CARRITO DE COMPRAS
// =============================================================

const obtenerCarrito = async (req, res) => {
  const usuario_id = req.params.usuario_id || req.query.usuario_id;

  if (!usuario_id) {
    return res.status(400).json({ error: 'Falta usuario_id.' });
  }

  try {
    const query = `
      SELECT 
        c.id AS id_carrito, 
        c.id AS id,
        c.usuario_id,
        c.producto_id, 
        c.cantidad, 
        p.nombre, 
        p.precio, 
        p.imagen, 
        p.descripcion,
        o.porcentaje_descuento
      FROM carrito c
      JOIN productos p ON c.producto_id = p.id
      LEFT JOIN ofertas o ON p.id_oferta = o.id_oferta
      WHERE c.usuario_id = ?
    `;
    const [items] = await db.query(query, [usuario_id]);
    res.json(items);
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).json({ error: 'Error al obtener el carrito.' });
  }
};

app.get('/api/carrito', obtenerCarrito);
app.get('/api/carrito/:usuario_id', obtenerCarrito);

// Agregar Producto al Carrito
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

// Actualizar Cantidad en el Carrito
app.put('/api/carrito/:id', async (req, res) => {
  const { id } = req.params;
  const { cantidad, usuario_id } = req.body;

  if (cantidad <= 0) {
    return res.status(400).json({ error: 'La cantidad debe ser mayor a 0.' });
  }

  try {
    if (usuario_id) {
      await db.query(
        'UPDATE carrito SET cantidad = ? WHERE (id = ? AND usuario_id = ?) OR (producto_id = ? AND usuario_id = ?)',
        [cantidad, id, usuario_id, id, usuario_id]
      );
    } else {
      await db.query('UPDATE carrito SET cantidad = ? WHERE id = ?', [cantidad, id]);
    }
    res.json({ mensaje: 'Cantidad actualizada correctamente.' });
  } catch (error) {
    console.error('Error al actualizar item del carrito:', error);
    res.status(500).json({ error: 'Error al actualizar el item.' });
  }
});

// Eliminar un producto del carrito
app.delete('/api/carrito/:id', async (req, res) => {
  const { id } = req.params;
  const usuario_id = req.query.usuario_id || req.body?.usuario_id;

  try {
    if (usuario_id) {
      await db.query(
        'DELETE FROM carrito WHERE (id = ? AND usuario_id = ?) OR (producto_id = ? AND usuario_id = ?)',
        [id, usuario_id, id, usuario_id]
      );
    } else {
      await db.query('DELETE FROM carrito WHERE id = ?', [id]);
    }
    res.json({ mensaje: 'Producto eliminado del carrito.' });
  } catch (error) {
    console.error('Error al eliminar ítem:', error);
    res.status(500).json({ error: 'Error al eliminar el ítem.' });
  }
});

// Vaciar el carrito completo de un usuario
const vaciarCarrito = async (req, res) => {
  const usuario_id = req.params.usuario_id || req.query.usuario_id || req.body?.usuario_id;

  if (!usuario_id) {
    return res.status(400).json({ error: 'Falta usuario_id.' });
  }

  try {
    await db.query('DELETE FROM carrito WHERE usuario_id = ?', [usuario_id]);
    res.json({ mensaje: 'Carrito vaciado exitosamente.' });
  } catch (error) {
    console.error('Error al vaciar el carrito:', error);
    res.status(500).json({ error: 'Error al vaciar el carrito.' });
  }
};

app.delete('/api/carrito/vaciar', vaciarCarrito);
app.delete('/api/carrito/vaciar/:usuario_id', vaciarCarrito);

// =============================================================
// 6. PROCESAR COMPRAS Y REGISTRO DE ÓRDENES
// =============================================================

app.post('/api/ordenes', async (req, res) => {
  const { usuario_id, total, items } = req.body;

  if (!usuario_id) {
    return res.status(400).json({ error: 'Se requiere el id del usuario para asociar la compra.' });
  }

  try {
    let productosAComprar = items;

    if (!productosAComprar || productosAComprar.length === 0) {
      const [cartDb] = await db.query(
        `SELECT c.producto_id, c.cantidad, p.precio 
         FROM carrito c 
         JOIN productos p ON c.producto_id = p.id 
         WHERE c.usuario_id = ?`,
        [usuario_id]
      );

      productosAComprar = cartDb.map(item => ({
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: item.precio
      }));
    }

    if (!productosAComprar || productosAComprar.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío, no se puede procesar el pago.' });
    }

    const montoTotal = total || productosAComprar.reduce((acc, p) => acc + (Number(p.precio_unitario || p.precio) * Number(p.cantidad)), 0);

    const [resultOrden] = await db.query(
      'INSERT INTO ordenes (usuario_id, total, fecha, estado) VALUES (?, ?, NOW(), "Pendiente")',
      [usuario_id, montoTotal]
    );
    const ordenId = resultOrden.insertId;

    for (const prod of productosAComprar) {
      const productoId = prod.producto_id || prod.id;
      const cantidad = prod.cantidad || 1;
      const precioUnitario = prod.precio_unitario || prod.precio || 0;

      await db.query(
        'INSERT INTO detalle_ordenes (orden_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
        [ordenId, productoId, cantidad, precioUnitario]
      );
    }

    await db.query('DELETE FROM carrito WHERE usuario_id = ?', [usuario_id]);

    res.status(201).json({
      mensaje: '¡Compra realizada con éxito y registrada en tu historial!',
      orden_id: ordenId
    });
  } catch (error) {
    console.error('Error al procesar la compra:', error);
    res.status(500).json({ error: 'Ocurrió un error al procesar el pago y registrar la orden.' });
  }
});

// =============================================================
// 7. PANEL DE ADMINISTRACIÓN - GESTIÓN DE ÓRDENES
// =============================================================

app.get('/api/admin/ordenes', async (req, res) => {
  try {
    const query = `
      SELECT 
        o.id, 
        o.usuario_id, 
        o.total, 
        o.fecha, 
        o.estado, 
        u.nombre AS nombre_cliente,
        u.email AS email_cliente,
        u.region,
        u.comuna
      FROM ordenes o
      LEFT JOIN usuarios u ON o.usuario_id = u.id
      ORDER BY o.fecha DESC
    `;
    const [results] = await db.query(query);
    res.json(results);
  } catch (error) {
    console.error('Error al consultar órdenes de la tienda:', error);
    res.status(500).json({ error: 'Error al obtener las órdenes.' });
  }
});

app.get('/api/ordenes/:orden_id/detalle', async (req, res) => {
  const { orden_id } = req.params;
  try {
    const query = `
      SELECT 
        d.id,
        d.orden_id,
        d.producto_id,
        d.cantidad,
        d.precio_unitario,
        p.nombre AS producto_nombre,
        p.imagen AS producto_imagen
      FROM detalle_ordenes d
      JOIN productos p ON d.producto_id = p.id
      WHERE d.orden_id = ?
    `;
    const [results] = await db.query(query, [orden_id]);
    res.json(results);
  } catch (error) {
    console.error('Error al consultar el detalle de la orden:', error);
    res.status(500).json({ error: 'Error al consultar los detalles de la compra.' });
  }
});

app.put('/api/admin/ordenes/:id/estado', async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (!estado) {
    return res.status(400).json({ error: 'El estado es requerido.' });
  }

  try {
    await db.query('UPDATE ordenes SET estado = ? WHERE id = ?', [estado, id]);
    res.json({ mensaje: 'Estado de la orden actualizado correctamente.' });
  } catch (error) {
    console.error('Error al actualizar el estado:', error);
    res.status(500).json({ error: 'Error al cambiar el estado.' });
  }
});

// =============================================================
//  8. GESTIÓN DE USUARIOS (Con historial automático)
// =============================================================
app.post('/api/usuarios', async (req, res) => {
  const { nombre, email, password, region, comuna, telefono, esadmin } = req.body;
  const sql = 'INSERT INTO usuarios (nombre, email, password, region, comuna, telefono, esadmin) VALUES (?, ?, ?, ?, ?, ?, ?)';
  try {
    const [result] = await db.query(sql, [nombre, email, password, region, comuna, telefono || null, esadmin || 0]);
    
    // --- MAGIA DEL HISTORIAL ---
    await db.query(
      'INSERT INTO reportes (tipo_reporte, especialidad, descripcion) VALUES (?, ?, ?)',
      ['Usuario', 'Nuevo', `Se creó el usuario/admin: ${email}`]
    );
    // ---------------------------

    res.status(201).json({ mensaje: 'Usuario creado con éxito', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el usuario.' });
  }
});

app.delete('/api/usuarios/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM usuarios WHERE id = ?', [req.params.id]);

    // --- MAGIA DEL HISTORIAL ---
    await db.query(
      'INSERT INTO reportes (tipo_reporte, especialidad, descripcion) VALUES (?, ?, ?)',
      ['Usuario', 'Eliminar', `Se eliminó al usuario ID: ${req.params.id}`]
    );
    // ---------------------------

    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario.' });
  }
});


// =============================================================
// 9. PANEL DE ADMINISTRACIÓN - CRUD DE PRODUCTOS (Con historial automático)
// =============================================================

app.get('/api/admin/productos', async (req, res) => {
  try {
    const query = `
      SELECT p.*, c.nombre_categoria AS categoria 
      FROM productos p 
      INNER JOIN categorias c ON p.id_categoria = c.id_categoria
      ORDER BY p.id DESC
    `;
    const [results] = await db.query(query);
    res.json(results);
  } catch (error) {
    console.error('Error GET productos admin:', error);
    res.status(500).json({ error: 'Error al consultar productos para admin.' });
  }
});

app.post('/api/productos', async (req, res) => {
  const { codigo, nombre, id_categoria, precio, stock, descripcion, imagen } = req.body;
  const sql = 'INSERT INTO productos (codigo, nombre, id_categoria, precio, stock, descripcion, imagen) VALUES (?, ?, ?, ?, ?, ?, ?)';
  try {
    const imgFinal = imagen || 'img/hamburguesa-index.webp';
    const [result] = await db.query(sql, [codigo, nombre, id_categoria, precio, stock, descripcion, imgFinal]);
    
    // --- MAGIA DEL HISTORIAL ---
    await db.query(
      'INSERT INTO reportes (tipo_reporte, especialidad, descripcion) VALUES (?, ?, ?)',
      ['Producto', 'Nuevo', `Se creó el producto ${nombre} (${codigo})`]
    );
    // ---------------------------

    res.status(201).json({ mensaje: 'Producto creado con éxito', id: result.insertId });
  } catch (error) {
    console.error('Error POST producto:', error); 
    res.status(500).json({ error: 'Error al guardar el producto.', detalle: error.message });
  }
});

app.put('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  const { codigo, nombre, id_categoria, precio, stock, descripcion, imagen } = req.body;
  const sql = 'UPDATE productos SET codigo=?, nombre=?, id_categoria=?, precio=?, stock=?, descripcion=?, imagen=? WHERE id=?';
  try {
    const imgFinal = imagen || '';
    await db.query(sql, [codigo, nombre, id_categoria, precio, stock, descripcion, imgFinal, id]);
    
    // --- MAGIA DEL HISTORIAL ---
    await db.query(
      'INSERT INTO reportes (tipo_reporte, especialidad, descripcion) VALUES (?, ?, ?)',
      ['Producto', 'Editar', `Se actualizó stock o info de ${nombre} (${codigo})`]
    );
    // ---------------------------

    res.json({ mensaje: 'Producto actualizado correctamente' });
  } catch (error) {
    console.error('Error PUT producto:', error); 
    res.status(500).json({ error: 'Error al actualizar el producto.', detalle: error.message });
  }
});

app.delete('/api/productos/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM productos WHERE id = ?', [req.params.id]);

    // --- MAGIA DEL HISTORIAL ---
    await db.query(
      'INSERT INTO reportes (tipo_reporte, especialidad, descripcion) VALUES (?, ?, ?)',
      ['Producto', 'Eliminar', `Se eliminó el producto con ID: ${req.params.id} del catálogo`]
    );
    // ---------------------------

    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error DELETE producto:', error);
    res.status(500).json({ error: 'Error al eliminar el producto.' });
  }
});

// (Tu ruta de app.get('/api/reportes', ...) sigue quedando igual abajo)
// RUTA PARA OBTENER LOS REPORTES (VERSIÓN CON PROMESAS)
app.get('/api/reportes', async (req, res) => {
    try {
        const sql = 'SELECT * FROM reportes ORDER BY fecha DESC';
        // En promesas usamos await en lugar de (err, results) => {}
        const [results] = await db.query(sql);
        res.json(results);
    } catch (err) {
        console.error('Error al obtener reportes:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Iniciar Servidor en Puerto 4000
app.listen(5000, () => {
  console.log('🚀 Servidor Backend corriendo en http://localhost:5000');
});