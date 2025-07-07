const express = require('express');
const cors = require('cors');
const app = express();
const config = require('./config/config'); // Importa la configuración
const itemRoutes = require('./routes/itemRoutes'); // Importa tus rutas de items
const formulacionesRoutes = require('./routes/formulacionesRoutes');

// Middleware para parsear JSON en el cuerpo de las solicitudes
app.use(cors());
app.use(express.json());

// Conectar las rutas de la API
app.use('/api/items', itemRoutes); // Todas las rutas de items bajo /api/items
app.use('/api/formulaciones', formulacionesRoutes);

// Ruta de prueba (opcional)
app.get('/', (req, res) => {
  res.send('API de GestorPinca funcionando!');
});

// Iniciar el servidor
app.listen(config.port, () => {
  console.log(`Servidor Express escuchando en http://localhost:${config.port}`);
});