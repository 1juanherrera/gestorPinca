const express = require('express');
const router = express.Router();
const ProveedorController = require('../controllers/proveedorController');

// CRUD básico de proveedores
router.get('/', ProveedorController.getAll);
router.get('/:id', ProveedorController.getById);
router.post('/', ProveedorController.create);
router.put('/:id', ProveedorController.update);
router.delete('/:id', ProveedorController.delete);

// Búsqueda de proveedores
router.get('/search/:term', ProveedorController.search);

// Gestión de productos del proveedor
router.get('/:id/productos', ProveedorController.getProductosByProveedor);

// Estadísticas del proveedor
router.get('/:id/estadisticas', ProveedorController.getEstadisticas);

module.exports = router;