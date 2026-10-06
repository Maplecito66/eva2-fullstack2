const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // Configuración por defecto de Laragon
  password: 'root',      // Contraseña vacía por defecto
  database: 'sabor_aroma',
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error de conexión a Laragon MySQL:', err);
    return;
  }
  console.log('✅ Conectado exitosamente a MySQL (Laragon)');
});

module.exports = db;