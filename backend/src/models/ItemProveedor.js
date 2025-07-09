const db = require('../db/connection');

class ItemProveedor {
    
    // Obtener todos los productos de proveedores
    static getAll(callback) {
        const query = `
            SELECT 
                ip.*,
                p.nombre_empresa as proveedor_nombre,
                p.nombre_encargado as proveedor_encargado
            FROM item_proveedor ip
            INNER JOIN proveedores p ON ip.proveedor_id = p.id
            WHERE ip.disponible = 1
            ORDER BY p.nombre_empresa ASC, ip.nombre ASC
        `;
        
        db.all(query, callback);
    }

    // Obtener producto por ID
    static getById(id, callback) {
        const query = `
            SELECT 
                ip.*,
                p.nombre_empresa as proveedor_nombre
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
            producto.nombre,
            producto.codigo,
            producto.tipo || 'MATERIA_PRIMA',
            producto.unidad_empaque,
            producto.precio_unitario,
            precioConIva,
            producto.descripcion
        ], function(error) {
            if (error) {
                return callback(error);
            }
            callback(null, { id: this.lastID, ...producto, precio_con_iva: precioConIva });
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
            producto.nombre,
            producto.codigo,
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
            callback(null, { id, ...producto, precio_con_iva: precioConIva });
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
                ip.*,
                p.nombre_empresa as proveedor_nombre
            FROM item_proveedor ip
            INNER JOIN proveedores p ON ip.proveedor_id = p.id
            WHERE (ip.nombre LIKE ? OR ip.codigo LIKE ? OR p.nombre_empresa LIKE ?)
              AND ip.disponible = 1
            ORDER BY p.nombre_empresa ASC, ip.nombre ASC
        `;
        
        db.all(query, [term, term, term], callback);
    }

    // Agregar producto a inventario general (siempre suma cantidad)
    static agregarAInventarioGeneral(itemProveedorId, cantidad, callback) {
        // Primero obtener el producto del proveedor
        this.getById(itemProveedorId, (error, producto) => {
            if (error) {
                return callback(error);
            }
            
            if (!producto) {
                return callback(new Error('Producto de proveedor no encontrado'));
            }
            
            // Verificar si ya existe en item_general
            const checkQuery = `
                SELECT 
                    ig.id,
                    i.cantidad as cantidad_actual
                FROM item_general ig
                LEFT JOIN inventario i ON ig.id = i.item_id
                WHERE ig.nombre = ? AND ig.codigo = ? AND ig.tipo = 'MATERIA_PRIMA'
            `;
            
            db.get(checkQuery, [producto.nombre, producto.codigo], (checkError, existingItem) => {
                if (checkError) {
                    return callback(checkError);
                }
                
                if (existingItem) {
                    // Ya existe - SIEMPRE sumar la cantidad nueva
                    const cantidadAnterior = existingItem.cantidad_actual || 0;
                    const nuevaCantidad = cantidadAnterior + cantidad;
                    
                    const updateInventarioQuery = `
                        UPDATE inventario 
                        SET cantidad = ?, updated_at = CURRENT_TIMESTAMP
                        WHERE item_id = ?
                    `;
                    
                    db.run(updateInventarioQuery, [nuevaCantidad, existingItem.id], function(updateError) {
                        if (updateError) {
                            return callback(updateError);
                        }
                        
                        callback(null, { 
                            action: 'updated', 
                            item_id: existingItem.id, 
                            nombre: producto.nombre,
                            cantidad_anterior: cantidadAnterior,
                            cantidad_agregada: cantidad,
                            cantidad_total: nuevaCantidad,
                            mensaje: `Se agregaron ${cantidad} unidades. Total: ${nuevaCantidad} unidades (anterior: ${cantidadAnterior})`
                        });
                    });
                } else {
                    // No existe - Crear todo el flujo completo
                    const createItemQuery = `
                        INSERT INTO item_general (nombre, codigo, tipo) 
                        VALUES (?, ?, 'MATERIA_PRIMA')
                    `;
                    
                    db.run(createItemQuery, [producto.nombre, producto.codigo], function(createError) {
                        if (createError) {
                            return callback(createError);
                        }
                        
                        const itemId = this.lastID;
                        
                        // Crear item_especifico básico
                        const createEspecificoQuery = `
                            INSERT INTO item_especifico (item_general_id, categoria_id) 
                            VALUES (?, 1)
                        `;
                        
                        db.run(createEspecificoQuery, [itemId], (especificoError) => {
                            if (especificoError) {
                                return callback(especificoError);
                            }
                            
                            // Crear inventario con la cantidad especificada
                            const createInventarioQuery = `
                                INSERT INTO inventario (item_id, cantidad) 
                                VALUES (?, ?)
                            `;
                            
                            db.run(createInventarioQuery, [itemId, cantidad], (inventarioError) => {
                                if (inventarioError) {
                                    return callback(inventarioError);
                                }
                                
                                // Crear costo
                                const createCostoQuery = `
                                    INSERT INTO costos_produccion (item_id, costo_unitario) 
                                    VALUES (?, ?)
                                `;
                                
                                db.run(createCostoQuery, [itemId, producto.precio_con_iva], (costoError) => {
                                    if (costoError) {
                                        return callback(costoError);
                                    }
                                    
                                    callback(null, { 
                                        action: 'created', 
                                        item_id: itemId, 
                                        nombre: producto.nombre,
                                        cantidad_anterior: 0,
                                        cantidad_agregada: cantidad,
                                        cantidad_total: cantidad,
                                        mensaje: `Producto creado exitosamente en inventario con ${cantidad} unidades`
                                    });
                                });
                            });
                        });
                    });
                }
            });
        });
    }

    // Método mejorado para verificar inventario con más detalles
    static verificarEnInventario(itemProveedorId, callback) {
        this.getById(itemProveedorId, (error, producto) => {
            if (error) {
                return callback(error);
            }
            
            if (!producto) {
                return callback(new Error('Producto de proveedor no encontrado'));
            }
            
            const checkQuery = `
                SELECT 
                    ig.id,
                    ig.nombre,
                    ig.codigo,
                    ig.tipo,
                    COALESCE(i.cantidad, 0) as cantidad_actual,
                    COALESCE(cp.costo_unitario, 0) as costo_actual,
                    i.updated_at as ultima_actualizacion
                FROM item_general ig
                LEFT JOIN inventario i ON ig.id = i.item_id
                LEFT JOIN costos_produccion cp ON ig.id = cp.item_id
                WHERE ig.nombre = ? AND ig.codigo = ? AND ig.tipo = 'MATERIA_PRIMA'
            `;
            
            db.get(checkQuery, [producto.nombre, producto.codigo], (checkError, existingItem) => {
                if (checkError) {
                    return callback(checkError);
                }
                
                callback(null, {
                    existe_en_inventario: !!existingItem,
                    producto_proveedor: {
                        id: producto.id,
                        nombre: producto.nombre,
                        codigo: producto.codigo,
                        precio_unitario: producto.precio_unitario,
                        precio_con_iva: producto.precio_con_iva,
                        unidad_empaque: producto.unidad_empaque,
                        proveedor_nombre: producto.proveedor_nombre
                    },
                    item_inventario: existingItem ? {
                        id: existingItem.id,
                        nombre: existingItem.nombre,
                        codigo: existingItem.codigo,
                        cantidad_actual: existingItem.cantidad_actual,
                        costo_actual: existingItem.costo_actual,
                        ultima_actualizacion: existingItem.ultima_actualizacion
                    } : null,
                    diferencia_precio: existingItem && existingItem.costo_actual !== producto.precio_con_iva ? {
                        precio_proveedor: producto.precio_con_iva,
                        precio_inventario: existingItem.costo_actual,
                        diferencia: producto.precio_con_iva - existingItem.costo_actual
                    } : null
                });
            });
        });
    }

    // Obtener productos por proveedor específico
    static getByProveedor(proveedorId, callback) {
        const query = `
            SELECT 
                ip.*,
                p.nombre_empresa as proveedor_nombre,
                p.nombre_encargado as proveedor_encargado
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