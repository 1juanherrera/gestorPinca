const express = require('express');
const router = express.Router();
const ItemProveedorController = require('../controllers/itemProveedorController');

// CRUD básico de productos de proveedor
router.get('/', ItemProveedorController.getAll);
router.get('/:id', ItemProveedorController.getById);
router.post('/', ItemProveedorController.create);
router.put('/:id', ItemProveedorController.update);
router.delete('/:id', ItemProveedorController.delete);

// Búsqueda de productos
router.get('/search/:term', ItemProveedorController.search);

// Gestión por proveedor
router.get('/proveedor/:proveedorId', ItemProveedorController.getByProveedor);
router.get('/proveedores-disponibles', ItemProveedorController.getProveedoresDisponibles);

// Gestión de inventario
router.get('/:id/verificar-inventario', ItemProveedorController.verificarEnInventario);
router.post('/:id/agregar-inventario', ItemProveedorController.agregarAInventario);

// Gestión de proveedores de productos
router.put('/:id/cambiar-proveedor', ItemProveedorController.cambiarProveedor);
router.put('/transferir-productos', ItemProveedorController.transferirProductos);

// Estadísticas
router.get('/estadisticas/general', ItemProveedorController.getEstadisticas);

module.exports = router;