const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint para obtener todos los productos de Laragon
app.get('/api/productos', (req, res) => {
  const sql = 'SELECT * FROM productos';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al consultar productos.' });
    res.json(results);
  });
});

// Endpoint para registro de usuarios
app.post('/api/registro', (req, res) => {
  const { nombre, email, password, region, comuna } = req.body;
  const sql = 'INSERT INTO usuarios (nombre, email, password, region, comuna) VALUES (?, ?, ?, ?, ?)';

  db.query(sql, [nombre, email, password, region, comuna], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
      }
      return res.status(500).json({ error: 'Error al registrar en la base de datos.' });
    }
    res.status(201).json({ mensaje: 'Usuario registrado con éxito', id: result.insertId });
  });
});

// Endpoint para inicio de sesión (Login)
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT id, nombre, email, region, comuna FROM usuarios WHERE email = ? AND password = ?';

  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al consultar usuario.' });

    if (results.length > 0) {
      res.json({ mensaje: 'Inicio de sesión exitoso', usuario: results[0] });
    } else {
      res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    }
  });
});

app.listen(5000, () => {
  console.log('🚀 Servidor Backend corriendo en http://localhost:5000');
});