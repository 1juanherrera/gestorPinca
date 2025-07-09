const ItemProveedor = require('../models/ItemProveedor');

class ItemProveedorController {
    
    // Obtener todos los productos de proveedores
    static getAll = (req, res) => {
        ItemProveedor.getAll((error, productos) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al obtener productos de proveedores',
                    error: error.message
                });
            }
            
            res.json({
                success: true,
                data: productos
            });
        });
    };

    // Obtener producto por ID
    static getById = (req, res) => {
        const { id } = req.params;
        
        ItemProveedor.getById(id, (error, producto) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al obtener producto',
                    error: error.message
                });
            }
            
            if (!producto) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }
            
            res.json({
                success: true,
                data: producto
            });
        });
    };

    // Crear nuevo producto de proveedor
    static create = (req, res) => {
        const { proveedor_id, nombre, codigo, tipo, unidad_empaque, precio_unitario, descripcion } = req.body;
        
        // Validaciones básicas
        if (!proveedor_id || !nombre || !precio_unitario) {
            return res.status(400).json({
                success: false,
                message: 'Proveedor, nombre y precio son requeridos'
            });
        }
        
        if (precio_unitario <= 0) {
            return res.status(400).json({
                success: false,
                message: 'El precio debe ser mayor a 0'
            });
        }
        
        const nuevoProducto = {
            proveedor_id,
            nombre,
            codigo,
            tipo: tipo || 'MATERIA_PRIMA',
            unidad_empaque,
            precio_unitario: parseFloat(precio_unitario),
            descripcion
        };
        
        ItemProveedor.create(nuevoProducto, (error, producto) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al crear producto',
                    error: error.message
                });
            }
            
            res.status(201).json({
                success: true,
                message: 'Producto creado exitosamente',
                data: producto
            });
        });
    };

    // Actualizar producto
    static update = (req, res) => {
        const { id } = req.params;
        const { proveedor_id, nombre, codigo, tipo, unidad_empaque, precio_unitario, descripcion, disponible } = req.body;
        
        if (!proveedor_id || !nombre || !precio_unitario) {
            return res.status(400).json({
                success: false,
                message: 'Proveedor, nombre y precio son requeridos'
            });
        }
        
        if (precio_unitario <= 0) {
            return res.status(400).json({
                success: false,
                message: 'El precio debe ser mayor a 0'
            });
        }
        
        const productoActualizado = {
            proveedor_id,
            nombre,
            codigo,
            tipo: tipo || 'MATERIA_PRIMA',
            unidad_empaque,
            precio_unitario: parseFloat(precio_unitario),
            descripcion,
            disponible: disponible !== undefined ? disponible : 1
        };
        
        ItemProveedor.update(id, productoActualizado, (error, producto) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al actualizar producto',
                    error: error.message
                });
            }
            
            res.json({
                success: true,
                message: 'Producto actualizado exitosamente',
                data: producto
            });
        });
    };

    // Eliminar producto
    static delete = (req, res) => {
        const { id } = req.params;
        
        ItemProveedor.delete(id, (error, resultado) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al eliminar producto',
                    error: error.message
                });
            }
            
            res.json({
                success: true,
                message: 'Producto eliminado exitosamente',
                data: resultado
            });
        });
    };

    // Buscar productos
    static search = (req, res) => {
        const { term } = req.params;
        
        if (!term || term.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: 'El término de búsqueda debe tener al menos 2 caracteres'
            });
        }
        
        ItemProveedor.search(term, (error, productos) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error en la búsqueda',
                    error: error.message
                });
            }
            
            res.json({
                success: true,
                data: productos
            });
        });
    };

    // Obtener productos por proveedor
    static getByProveedor = (req, res) => {
        const { proveedorId } = req.params;
        
        ItemProveedor.getByProveedor(proveedorId, (error, productos) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al obtener productos del proveedor',
                    error: error.message
                });
            }
            
            res.json({
                success: true,
                data: productos
            });
        });
    };

    // Verificar si producto existe en inventario
    static verificarEnInventario = (req, res) => {
        const { id } = req.params;
        
        ItemProveedor.verificarEnInventario(id, (error, resultado) => {
            if (error) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error al verificar producto en inventario',
                    error: error.message 
                });
            }
            
            res.json({
                success: true,
                data: resultado
            });
        });
    };

    // Agregar a inventario general
    static agregarAInventario = (req, res) => {
        const { id } = req.params;
        const { cantidad } = req.body;
        
        if (!cantidad || cantidad <= 0) {
            return res.status(400).json({
                success: false,
                message: 'La cantidad debe ser mayor a 0'
            });
        }
        
        ItemProveedor.agregarAInventarioGeneral(id, cantidad, (error, resultado) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al agregar producto al inventario',
                    error: error.message
                });
            }
            
            res.json({
                success: true,
                message: resultado.mensaje,
                data: resultado
            });
        });
    };

    // Cambiar proveedor de un producto
    static cambiarProveedor = (req, res) => {
        const { id } = req.params;
        const { nuevo_proveedor_id } = req.body;
        
        if (!nuevo_proveedor_id) {
            return res.status(400).json({
                success: false,
                message: 'Debe especificar el nuevo proveedor'
            });
        }
        
        ItemProveedor.cambiarProveedor(id, nuevo_proveedor_id, (error, resultado) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al cambiar proveedor',
                    error: error.message
                });
            }
            
            res.json({
                success: true,
                message: resultado.message,
                data: resultado.producto
            });
        });
    };

    // Obtener lista de proveedores disponibles
    static getProveedoresDisponibles = (req, res) => {
        ItemProveedor.obtenerProveedoresDisponibles((error, proveedores) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al obtener proveedores',
                    error: error.message
                });
            }
            
            res.json({
                success: true,
                data: proveedores
            });
        });
    };

    // Transferir múltiples productos a otro proveedor
    static transferirProductos = (req, res) => {
        const { productos_ids, nuevo_proveedor_id } = req.body;
        
        if (!productos_ids || !Array.isArray(productos_ids) || productos_ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Debe especificar al menos un producto'
            });
        }
        
        if (!nuevo_proveedor_id) {
            return res.status(400).json({
                success: false,
                message: 'Debe especificar el nuevo proveedor'
            });
        }
        
        ItemProveedor.transferirProductos(productos_ids, nuevo_proveedor_id, (error, resultado) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al transferir productos',
                    error: error.message
                });
            }
            
            res.json({
                success: true,
                message: resultado.message,
                data: resultado
            });
        });
    };

    // Obtener estadísticas de productos por tipo
    static getEstadisticas = (req, res) => {
        ItemProveedor.getAll((error, productos) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al obtener estadísticas',
                    error: error.message
                });
            }
            
            // Calcular estadísticas
            const estadisticas = {
                total_productos: productos.length,
                productos_disponibles: productos.filter(p => p.disponible).length,
                productos_no_disponibles: productos.filter(p => !p.disponible).length,
                precio_promedio: productos.length > 0 ? 
                    productos.reduce((sum, p) => sum + p.precio_unitario, 0) / productos.length : 0,
                precio_maximo: productos.length > 0 ? 
                    Math.max(...productos.map(p => p.precio_unitario)) : 0,
                precio_minimo: productos.length > 0 ? 
                    Math.min(...productos.map(p => p.precio_unitario)) : 0,
                por_tipo: productos.reduce((acc, p) => {
                    acc[p.tipo] = (acc[p.tipo] || 0) + 1;
                    return acc;
                }, {}),
                por_proveedor: productos.reduce((acc, p) => {
                    const key = p.proveedor_nombre || 'Sin proveedor';
                    acc[key] = (acc[key] || 0) + 1;
                    return acc;
                }, {})
            };
            
            res.json({
                success: true,
                data: estadisticas
            });
        });
    };
}

module.exports = ItemProveedorController;