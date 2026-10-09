const mysql = require('mysql2/promise');

// Creamos un Pool de conexiones con Promesas
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',      // Configuración por defecto de Laragon
  password: '',      // Contraseña vacía por defecto
  database: 'sabor_aroma',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Verificación rápida de conexión al iniciar
db.getConnection()
  .then((connection) => {
    console.log('✅ Conectado exitosamente a MySQL (Laragon con Promesas)');
    connection.release(); // Liberar la conexión de prueba de vuelta al pool
  })
  .catch((err) => {
    console.error('❌ Error de conexión a Laragon MySQL:', err);
  });

module.exports = db;