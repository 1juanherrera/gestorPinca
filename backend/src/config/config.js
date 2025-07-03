require('dotenv').config(); // Para cargar variables de .env
const path = require('path');

module.exports = {
  port: process.env.PORT || 3000, // Usa el puerto de .env o 3000 por defecto
  dbPath: path.resolve(__dirname, '..', 'db', 'pinca.db') // Ruta a tu base de datos SQLite
};