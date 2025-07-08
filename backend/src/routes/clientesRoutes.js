const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');

// Rutas para clientes
router.get('/', clientesController.getAllClientes);
router.get('/search', clientesController.searchClientes);
router.get('/:id', clientesController.getClienteById);
router.get('/:id/facturas', clientesController.getClienteWithFacturas);
router.get('/:id/pagos', clientesController.getClienteWithPagos);
router.get('/:id/estadisticas', clientesController.getClienteEstadisticas);
router.post('/', clientesController.createCliente);
router.put('/:id', clientesController.updateCliente);
router.delete('/:id', clientesController.deleteCliente);

module.exports = router;