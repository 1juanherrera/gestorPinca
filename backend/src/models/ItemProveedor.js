const db = require('../db/connection');

class ItemProveedor {
    // Obtener todos los productos de proveedores
    static getAll(callback) {
    const query = `
        SELECT 
            ip.id,
            ip.nombre AS nombre_item,
            ip.codigo AS codigo_item,
            ip.descripcion,
            ip.tipo,
            ip.unidad_empaque,
            ip.precio_unitario,
            ip.precio_con_iva,
            ip.disponible,
            ip.proveedor_id,
            p.nombre_empresa AS nombre_proveedor,
            p.nombre_encargado AS nombre_encargado
        FROM item_proveedor ip
        INNER JOIN proveedores p ON ip.proveedor_id = p.id
        WHERE ip.disponible = 1
        ORDER BY p.nombre_empresa ASC, ip.nombre ASC
    `;
    db.all(query, (error, rows) => {
        console.log('getAll error:', error);
        console.log('getAll rows:', rows);
        callback(error, rows);
    });
}

    // Obtener producto por ID
    static getById(id, callback) {
        const query = `
            SELECT 
                ip.id,
                ip.nombre AS nombre_item,
                ip.codigo AS codigo_item,
                ip.descripcion,
                ip.tipo,
                ip.unidad_empaque,
                ip.precio_unitario,
                ip.precio_con_iva,
                ip.disponible,
                ip.proveedor_id,
                p.nombre_empresa AS nombre_proveedor,
                p.nombre_encargado AS nombre_encargado
            FROM item_proveedor ip
            INNER JOIN proveedores p ON ip.proveedor_id = p.id
            WHERE ip.id = ?
        `;
        db.get(query, [id], callback);
    }

    // Crear nuevo producto de proveedor
    static create(producto, callback) {
        const precioConIva = producto.precio_unitario * 1.19; // IVA 19%
        const query = `
            INSERT INTO item_proveedor 
            (proveedor_id, nombre, codigo, tipo, unidad_empaque, precio_unitario, precio_con_iva, descripcion)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.run(query, [
            producto.proveedor_id,
            producto.nombre_item, // Usar nombre_item para mantener consistencia
            producto.codigo_item, // Usar codigo_item para mantener consistencia
            producto.tipo || 'MATERIA_PRIMA',
            producto.unidad_empaque,
            producto.precio_unitario,
            precioConIva,
            producto.descripcion
        ], function(error) {
            if (error) {
                return callback(error);
            }
            // Devuelve el objeto normalizado
            callback(null, {
                id: this.lastID,
                nombre_item: producto.nombre_item,
                codigo_item: producto.codigo_item,
                descripcion: producto.descripcion,
                tipo: producto.tipo || 'MATERIA_PRIMA',
                unidad_empaque: producto.unidad_empaque,
                precio_unitario: producto.precio_unitario,
                precio_con_iva: precioConIva,
                disponible: 1,
                proveedor_id: producto.proveedor_id
            });
        });
    }

    // Actualizar producto
    static update(id, producto, callback) {
        const precioConIva = producto.precio_unitario * 1.19;
        const query = `
            UPDATE item_proveedor 
            SET proveedor_id = ?, nombre = ?, codigo = ?, tipo = ?, 
                unidad_empaque = ?, precio_unitario = ?, precio_con_iva = ?, 
                descripcion = ?, disponible = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        db.run(query, [
            producto.proveedor_id,
            producto.nombre_item,
            producto.codigo_item,
            producto.tipo,
            producto.unidad_empaque,
            producto.precio_unitario,
            precioConIva,
            producto.descripcion,
            producto.disponible !== undefined ? producto.disponible : 1,
            id
        ], function(error) {
            if (error) {
                return callback(error);
            }
            callback(null, {
                id,
                nombre_item: producto.nombre_item,
                codigo_item: producto.codigo_item,
                descripcion: producto.descripcion,
                tipo: producto.tipo,
                unidad_empaque: producto.unidad_empaque,
                precio_unitario: producto.precio_unitario,
                precio_con_iva: precioConIva,
                disponible: producto.disponible !== undefined ? producto.disponible : 1,
                proveedor_id: producto.proveedor_id
            });
        });
    }

    // Eliminar producto
    static delete(id, callback) {
        const query = `DELETE FROM item_proveedor WHERE id = ?`;
        db.run(query, [id], function(error) {
            if (error) {
                return callback(error);
            }
            callback(null, { success: true, deletedId: id });
        });
    }

    // Buscar productos
    static search(searchTerm, callback) {
        const term = `%${searchTerm}%`;
        const query = `
            SELECT 
                ip.id,
                ip.nombre AS nombre_item,
                ip.codigo AS codigo_item,
                ip.descripcion,
                ip.tipo,
                ip.unidad_empaque,
                ip.precio_unitario,
                ip.precio_con_iva,
                ip.disponible,
                ip.proveedor_id,
                p.nombre_empresa AS nombre_proveedor,
                p.nombre_encargado AS nombre_encargado
            FROM item_proveedor ip
            INNER JOIN proveedores p ON ip.proveedor_id = p.id
            WHERE (ip.nombre LIKE ? OR ip.codigo LIKE ? OR p.nombre_empresa LIKE ?)
              AND ip.disponible = 1
            ORDER BY p.nombre_empresa ASC, ip.nombre ASC
        `;
        db.all(query, [term, term, term], callback);
    }

    // Obtener productos por proveedor específico
    static getByProveedor(proveedorId, callback) {
        const query = `
            SELECT 
                ip.id,
                ip.nombre AS nombre_item,
                ip.codigo AS codigo_item,
                ip.descripcion,
                ip.tipo,
                ip.unidad_empaque,
                ip.precio_unitario,
                ip.precio_con_iva,
                ip.disponible,
                ip.proveedor_id,
                p.nombre_empresa AS nombre_proveedor,
                p.nombre_encargado AS nombre_encargado
            FROM item_proveedor ip
            INNER JOIN proveedores p ON ip.proveedor_id = p.id
            WHERE ip.proveedor_id = ? AND ip.disponible = 1
            ORDER BY ip.nombre ASC
        `;
        db.all(query, [proveedorId], callback);
    }

    // Cambiar proveedor de un producto específico
    static cambiarProveedor(itemId, nuevoProveedorId, callback) {
        // Verificar que el nuevo proveedor existe
        const checkProveedorQuery = `SELECT id FROM proveedores WHERE id = ?`;
        
        db.get(checkProveedorQuery, [nuevoProveedorId], (error, proveedor) => {
            if (error) {
                return callback(error);
            }
            
            if (!proveedor) {
                return callback(new Error('El proveedor especificado no existe'));
            }
            
            // Actualizar el proveedor del producto
            const updateQuery = `
                UPDATE item_proveedor 
                SET proveedor_id = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `;
            
            db.run(updateQuery, [nuevoProveedorId, itemId], function(updateError) {
                if (updateError) {
                    return callback(updateError);
                }
                
                // Obtener el producto actualizado con info del nuevo proveedor
                ItemProveedor.getById(itemId, (getError, productoActualizado) => {
                    if (getError) {
                        return callback(getError);
                    }
                    
                    callback(null, {
                        success: true,
                        message: `Proveedor cambiado exitosamente`,
                        producto: productoActualizado
                    });
                });
            });
        });
    }

    // Obtener historial de cambios de proveedor (opcional)
    static obtenerProveedoresDisponibles(callback) {
        const query = `
            SELECT 
                id, 
                nombre_empresa, 
                nombre_encargado,
                telefono,
                email
            FROM proveedores 
            ORDER BY nombre_empresa ASC
        `;
        
        db.all(query, callback);
    }

    // Transferir múltiples productos a otro proveedor
    static transferirProductos(productosIds, nuevoProveedorId, callback) {
        if (!Array.isArray(productosIds) || productosIds.length === 0) {
            return callback(new Error('Debe especificar al menos un producto'));
        }
        
        // Verificar que el nuevo proveedor existe
        const checkProveedorQuery = `SELECT id FROM proveedores WHERE id = ?`;
        
        db.get(checkProveedorQuery, [nuevoProveedorId], (error, proveedor) => {
            if (error) {
                return callback(error);
            }
            
            if (!proveedor) {
                return callback(new Error('El proveedor especificado no existe'));
            }
            
            // Crear placeholders para la query
            const placeholders = productosIds.map(() => '?').join(',');
            const updateQuery = `
                UPDATE item_proveedor 
                SET proveedor_id = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id IN (${placeholders})
            `;
            
            const params = [nuevoProveedorId, ...productosIds];
            
            db.run(updateQuery, params, function(updateError) {
                if (updateError) {
                    return callback(updateError);
                }
                
                callback(null, {
                    success: true,
                    message: `${this.changes} productos transferidos exitosamente`,
                    productos_actualizados: this.changes,
                    nuevo_proveedor_id: nuevoProveedorId
                });
            });
        });
    }
}

module.exports = ItemProveedor;