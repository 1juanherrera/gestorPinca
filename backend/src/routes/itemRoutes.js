// src/routes/itemRoutes.js
const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController'); // Importa el controlador

// Rutas para la API de items
router.get('/', itemController.getAllItems);         // GET /api/items (obtener todos)
router.get('/:id', itemController.getItemById);      // GET /api/items/:id (obtener uno por ID)
router.post('/', itemController.createItem);         // POST /api/items (crear uno nuevo)
router.put('/:id', itemController.updateItem);       // PUT /api/items/:id (actualizar uno)
router.delete('/:id', itemController.deleteItem);    // DELETE /api/items/:id (eliminar uno)

module.exports = router;