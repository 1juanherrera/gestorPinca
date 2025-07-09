const Proveedores = require('../models/Proveedores');

class ProveedorController {
    
    // Obtener todos los proveedores
    static getAll = (req, res) => {
        Proveedores.getAll((error, proveedores) => {
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

    // Obtener proveedor por ID
    static getById = (req, res) => {
        const { id } = req.params;
        
        Proveedores.getById(id, (error, proveedor) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al obtener proveedor',
                    error: error.message
                });
            }
            
            if (!proveedor) {
                return res.status(404).json({
                    success: false,
                    message: 'Proveedor no encontrado'
                });
            }
            
            res.json({
                success: true,
                data: proveedor
            });
        });
    };

    // Crear nuevo proveedor
    static create = (req, res) => {
        const { nombre_encargado, nombre_empresa, numero_documento, direccion, telefono, email } = req.body;
        
        // Validaciones básicas
        if (!nombre_empresa) {
            return res.status(400).json({
                success: false,
                message: 'El nombre de la empresa es requerido'
            });
        }
        
        const nuevoProveedor = {
            nombre_encargado,
            nombre_empresa,
            numero_documento,
            direccion,
            telefono,
            email
        };
        
        Proveedores.create(nuevoProveedor, (error, proveedor) => {
            if (error) {
                if (error.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({
                        success: false,
                        message: 'El número de documento ya está registrado'
                    });
                }
                
                return res.status(500).json({
                    success: false,
                    message: 'Error al crear proveedor',
                    error: error.message
                });
            }
            
            res.status(201).json({
                success: true,
                message: 'Proveedor creado exitosamente',
                data: proveedor
            });
        });
    };

    // Actualizar proveedor
    static update = (req, res) => {
        const { id } = req.params;
        const { nombre_encargado, nombre_empresa, numero_documento, direccion, telefono, email } = req.body;
        
        if (!nombre_empresa) {
            return res.status(400).json({
                success: false,
                message: 'El nombre de la empresa es requerido'
            });
        }
        
        const proveedorActualizado = {
            nombre_encargado,
            nombre_empresa,
            numero_documento,
            direccion,
            telefono,
            email
        };
        
        Proveedores.update(id, proveedorActualizado, (error, proveedor) => {
            if (error) {
                if (error.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({
                        success: false,
                        message: 'El número de documento ya está registrado por otro proveedor'
                    });
                }
                
                return res.status(500).json({
                    success: false,
                    message: 'Error al actualizar proveedor',
                    error: error.message
                });
            }
            
            res.json({
                success: true,
                message: 'Proveedor actualizado exitosamente',
                data: proveedor
            });
        });
    };

    // Eliminar proveedor
    static delete = (req, res) => {
        const { id } = req.params;
        
        Proveedores.delete(id, (error, resultado) => {
            if (error) {
                if (error.message.includes('productos asociados')) {
                    return res.status(400).json({
                        success: false,
                        message: 'No se puede eliminar el proveedor porque tiene productos asociados. Elimine primero los productos o transfiera los productos a otro proveedor.'
                    });
                }
                
                return res.status(500).json({
                    success: false,
                    message: 'Error al eliminar proveedor',
                    error: error.message
                });
            }
            
            res.json({
                success: true,
                message: 'Proveedor eliminado exitosamente',
                data: resultado
            });
        });
    };

    // Buscar proveedores
    static search = (req, res) => {
        const { term } = req.params;
        
        if (!term || term.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: 'El término de búsqueda debe tener al menos 2 caracteres'
            });
        }
        
        Proveedores.search(term, (error, proveedores) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error en la búsqueda',
                    error: error.message
                });
            }
            
            res.json({
                success: true,
                data: proveedores
            });
        });
    };

    // Obtener productos de un proveedor
    static getProductosByProveedor = (req, res) => {
        const { id } = req.params;
        
        Proveedores.getProductosByProveedor(id, (error, productos) => {
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

    // Obtener estadísticas del proveedor
    static getEstadisticas = (req, res) => {
        const { id } = req.params;
        
        // Obtener proveedor con estadísticas
        Proveedores.getById(id, (error, proveedor) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al obtener estadísticas',
                    error: error.message
                });
            }
            
            if (!proveedor) {
                return res.status(404).json({
                    success: false,
                    message: 'Proveedor no encontrado'
                });
            }
            
            // Obtener productos del proveedor
            Proveedores.getProductosByProveedor(id, (prodError, productos) => {
                if (prodError) {
                    return res.status(500).json({
                        success: false,
                        message: 'Error al obtener productos',
                        error: prodError.message
                    });
                }
                
                // Calcular estadísticas adicionales
                const estadisticas = {
                    proveedor: proveedor,
                    total_productos: productos.length,
                    productos_disponibles: productos.filter(p => p.disponible).length,
                    precio_promedio: productos.length > 0 ? 
                        productos.reduce((sum, p) => sum + p.precio_unitario, 0) / productos.length : 0,
                    precio_maximo: productos.length > 0 ? 
                        Math.max(...productos.map(p => p.precio_unitario)) : 0,
                    precio_minimo: productos.length > 0 ? 
                        Math.min(...productos.map(p => p.precio_unitario)) : 0,
                    productos: productos
                };
                
                res.json({
                    success: true,
                    data: estadisticas
                });
            });
        });
    };
}

module.exports = ProveedorController;