const db = require('../db/connection');

class Proveedores {
    
    // Obtener todos los proveedores con estadísticas
    static getAll(callback) {
        const query = `
            SELECT 
                p.id, 
                p.nombre_encargado,
                p.nombre_empresa,
                p.numero_documento,
                p.direccion,
                p.telefono,
                p.email,
                COUNT(ip.id) as total_productos,
                COUNT(CASE WHEN ip.disponible = 1 THEN 1 END) as productos_disponibles,
                COALESCE(AVG(ip.precio_unitario), 0) as precio_promedio
            FROM proveedores p
            LEFT JOIN item_proveedor ip ON p.id = ip.proveedor_id
            GROUP BY p.id, p.nombre_encargado, p.nombre_empresa, p.numero_documento, p.direccion, p.telefono, p.email
            ORDER BY p.nombre_empresa ASC
        `;
        
        db.all(query, (error, results) => {
            if (error) {
                return callback(error);
            }
            
            const proveedoresConEstadisticas = results.map(proveedor => ({
                id: proveedor.id,
                nombre_encargado: proveedor.nombre_encargado,
                nombre_empresa: proveedor.nombre_empresa,
                numero_documento: proveedor.numero_documento,
                direccion: proveedor.direccion,
                telefono: proveedor.telefono,
                email: proveedor.email,
                total_productos: proveedor.total_productos,
                productos_disponibles: proveedor.productos_disponibles,
                precio_promedio: parseFloat(proveedor.precio_promedio)
            }));
            
            callback(null, proveedoresConEstadisticas);
        });
    }

    // Obtener proveedor por ID
    static getById(id, callback) {
        const query = `
            SELECT * FROM proveedores WHERE id = ?
        `;
        db.get(query, [id], callback);
    }

    // Crear nuevo proveedor
    static create(proveedor, callback) {
        const query = `
            INSERT INTO proveedores (nombre_encargado, nombre_empresa, numero_documento, direccion, telefono, email)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        db.run(query, [
            proveedor.nombre_encargado,
            proveedor.nombre_empresa,
            proveedor.numero_documento,
            proveedor.direccion,
            proveedor.telefono,
            proveedor.email
        ], function(error) {
            if (error) {
                return callback(error);
            }
            callback(null, { id: this.lastID, ...proveedor });
        });
    }

    // Actualizar proveedor
    static update(id, proveedor, callback) {
        const query = `
            UPDATE proveedores 
            SET nombre_encargado = ?, nombre_empresa = ?, numero_documento = ?, 
                direccion = ?, telefono = ?, email = ?
            WHERE id = ?
        `;
        
        db.run(query, [
            proveedor.nombre_encargado,
            proveedor.nombre_empresa,
            proveedor.numero_documento,
            proveedor.direccion,
            proveedor.telefono,
            proveedor.email,
            id
        ], function(error) {
            if (error) {
                return callback(error);
            }
            callback(null, { id, ...proveedor });
        });
    }

    // Eliminar proveedor
    static delete(id, callback) {
        // Verificar si tiene productos asociados
        const checkQuery = `SELECT COUNT(*) as count FROM item_proveedor WHERE proveedor_id = ?`;
        
        db.get(checkQuery, [id], (error, result) => {
            if (error) {
                return callback(error);
            }
            
            if (result.count > 0) {
                return callback(new Error('No se puede eliminar el proveedor porque tiene productos asociados'));
            }
            
            const deleteQuery = `DELETE FROM proveedores WHERE id = ?`;
            db.run(deleteQuery, [id], function(error) {
                if (error) {
                    return callback(error);
                }
                callback(null, { success: true, deletedId: id });
            });
        });
    }

    // Buscar proveedores
    static search(searchTerm, callback) {
        const term = `%${searchTerm}%`;
        const query = `
            SELECT * FROM proveedores 
            WHERE nombre_empresa LIKE ? 
               OR nombre_encargado LIKE ? 
               OR numero_documento LIKE ?
               OR email LIKE ?
            ORDER BY nombre_empresa ASC
        `;
        
        db.all(query, [term, term, term, term], callback);
    }

    // Obtener productos de un proveedor
    static getProductosByProveedor(proveedorId, callback) {
        const query = `
            SELECT 
                ip.*,
                p.nombre_empresa as proveedor_nombre
            FROM item_proveedor ip
            INNER JOIN proveedores p ON ip.proveedor_id = p.id
            WHERE ip.proveedor_id = ?
            ORDER BY ip.nombre ASC
        `;
        
        db.all(query, [proveedorId], callback);
    }
}

module.exports = Proveedores;