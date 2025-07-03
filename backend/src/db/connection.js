// src/db/connection.js
const sqlite3 = require('sqlite3').verbose();
const config = require('../config/config'); // Importa la configuración para la ruta de la DB

// La ruta a tu DB ahora viene de la configuración
const db = new sqlite3.Database(config.dbPath, (err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
  } else {
    console.log(`Conexión exitosa a la base de datos SQLite: ${config.dbPath}`);
  }
});

module.exports = db;