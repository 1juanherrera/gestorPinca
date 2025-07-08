const db = require('../db/connection');

class Clientes {
    // Obtener todos los clientes
    static getAll(callback) {
        const query = `
            SELECT 
                c.id, 
                c.nombre_encargado,
                c.nombre_empresa,
                c.numero_documento,
                c.direccion,
                c.telefono,
                c.email,
                -- Estadísticas de facturas
                (SELECT COUNT(*) FROM facturas WHERE cliente_id = c.id) as total_facturas,
                (SELECT COALESCE(SUM(total), 0) FROM facturas WHERE cliente_id = c.id) as total_facturado,
                (SELECT COUNT(*) FROM facturas WHERE cliente_id = c.id AND estado = 'pendiente') as facturas_pendientes,
                -- Estadísticas de pagos
                (SELECT COALESCE(SUM(monto), 0) FROM pagos_cliente WHERE cliente_id = c.id) as total_pagado,
                -- Saldo pendiente calculado
                (SELECT COALESCE(SUM(total), 0) FROM facturas WHERE cliente_id = c.id) - 
                (SELECT COALESCE(SUM(monto), 0) FROM pagos_cliente WHERE cliente_id = c.id) as saldo_pendiente
            FROM clientes c
            ORDER BY c.nombre_empresa ASC
        `;
        
        db.all(query, (error, results) => {
            if (error) {
                return callback(error);
            }
            
            const clientesConEstadisticas = results.map(cliente => ({
                id: cliente.id,
                nombre_encargado: cliente.nombre_encargado,
                nombre_empresa: cliente.nombre_empresa,
                numero_documento: cliente.numero_documento,
                direccion: cliente.direccion,
                telefono: cliente.telefono,
                email: cliente.email,
                total_facturas: cliente.total_facturas,
                total_facturado: parseFloat(cliente.total_facturado),
                total_pagado: parseFloat(cliente.total_pagado),
                saldo_pendiente: parseFloat(cliente.saldo_pendiente),
                facturas_pendientes: cliente.facturas_pendientes
            }));
            
            callback(null, clientesConEstadisticas);
        });
    }

    // Obtener cliente por ID
    static getById(id, callback) {
        db.get(`
            SELECT 
                id, 
                nombre_encargado,
                nombre_empresa,
                numero_documento,
                direccion,
                telefono,
                email
            FROM clientes 
            WHERE id = ?`, [id], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    }

    // Obtener cliente con sus facturas
    static getWithFacturas(id, callback) {
        const query = `
            SELECT 
                c.id, 
                c.nombre_encargado,
                c.nombre_empresa,
                c.numero_documento,
                c.direccion,
                c.telefono,
                c.email,
                f.id as factura_id,
                f.numero as factura_numero,
                f.fecha_emision,
                f.total as factura_total,
                f.estado as factura_estado,
                f.subtotal,
                f.impuestos,
                f.retencion
            FROM clientes c
            LEFT JOIN facturas f ON c.id = f.cliente_id
            WHERE c.id = ?
            ORDER BY f.fecha_emision DESC
        `;
        
        db.all(query, [id], (error, results) => {
            if (error) {
                return callback(error);
            }
            
            if (results.length === 0) {
                return callback(null, null);
            }
            
            // Estructurar la respuesta
            const cliente = {
                id: results[0].id,
                nombre_encargado: results[0].nombre_encargado,
                nombre_empresa: results[0].nombre_empresa,
                numero_documento: results[0].numero_documento,
                direccion: results[0].direccion,
                telefono: results[0].telefono,
                email: results[0].email,
                facturas: results.filter(r => r.factura_id).map(r => ({
                    id: r.factura_id,
                    numero: r.factura_numero,
                    fecha_emision: r.fecha_emision,
                    total: r.factura_total,
                    estado: r.factura_estado,
                    subtotal: r.subtotal,
                    impuestos: r.impuestos,
                    retencion: r.retencion
                }))
            };
            
            callback(null, cliente);
        });
    }

    // Obtener cliente con sus pagos
    static getWithPagos(id, callback) {
        const query = `
            SELECT 
                c.id, 
                c.nombre_encargado,
                c.nombre_empresa,
                c.numero_documento,
                c.direccion,
                c.telefono,
                c.email,
                p.id as pago_id,
                p.factura_id,
                p.fecha_pago,
                p.monto,
                p.metodo_pago,
                p.observaciones,
                f.numero as factura_numero
            FROM clientes c
            LEFT JOIN pagos_cliente p ON c.id = p.cliente_id
            LEFT JOIN facturas f ON p.factura_id = f.id
            WHERE c.id = ?
            ORDER BY p.fecha_pago DESC
        `;
        
        db.all(query, [id], (error, results) => {
            if (error) {
                return callback(error);
            }
            
            if (results.length === 0) {
                return callback(null, null);
            }
            
            const cliente = {
                id: results[0].id,
                nombre_encargado: results[0].nombre_encargado,
                nombre_empresa: results[0].nombre_empresa,
                numero_documento: results[0].numero_documento,
                direccion: results[0].direccion,
                telefono: results[0].telefono,
                email: results[0].email,
                pagos: results.filter(r => r.pago_id).map(r => ({
                    id: r.pago_id,
                    factura_id: r.factura_id,
                    factura_numero: r.factura_numero,
                    fecha_pago: r.fecha_pago,
                    monto: r.monto,
                    metodo_pago: r.metodo_pago,
                    observaciones: r.observaciones
                }))
            };
            
            callback(null, cliente);
        });
    }

    // Crear nuevo cliente
    static create(clienteData, callback) {
        const { nombre_encargado, nombre_empresa, numero_documento, direccion, telefono, email } = clienteData;
        
        db.run(`
            INSERT INTO clientes (nombre_encargado, nombre_empresa, numero_documento, direccion, telefono, email)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [nombre_encargado, nombre_empresa, numero_documento, direccion, telefono, email],
            function(error) {
                if (error) {
                    return callback(error);
                }
                
                // Obtener el cliente recién creado
                Clientes.getById(this.lastID, callback);
            }
        );
    }

    // Actualizar cliente
    static update(id, clienteData, callback) {
        const { nombre_encargado, nombre_empresa, numero_documento, direccion, telefono, email } = clienteData;
        
        db.run(`
            UPDATE clientes 
            SET nombre_encargado = ?, nombre_empresa = ?, numero_documento = ?, 
                direccion = ?, telefono = ?, email = ?
            WHERE id = ?`,
            [nombre_encargado, nombre_empresa, numero_documento, direccion, telefono, email, id],
            function(error) {
                if (error) {
                    return callback(error);
                }
                
                if (this.changes === 0) {
                    return callback(new Error('Cliente no encontrado'));
                }
                
                // Obtener el cliente actualizado
                Clientes.getById(id, callback);
            }
        );
    }

    // Eliminar cliente (verificar relaciones)
    static delete(id, callback) {
        // Primero verificar si tiene facturas
        db.get(`SELECT COUNT(*) as count FROM facturas WHERE cliente_id = ?`, [id], (error, result) => {
            if (error) {
                return callback(error);
            }
            
            if (result.count > 0) {
                return callback(new Error('No se puede eliminar el cliente porque tiene facturas asociadas'));
            }
            
            // Verificar si tiene pagos
            db.get(`SELECT COUNT(*) as count FROM pagos_cliente WHERE cliente_id = ?`, [id], (error, result) => {
                if (error) {
                    return callback(error);
                }
                
                if (result.count > 0) {
                    return callback(new Error('No se puede eliminar el cliente porque tiene pagos asociados'));
                }
                
                // Si no tiene relaciones, eliminar
                db.run(`DELETE FROM clientes WHERE id = ?`, [id], function(error) {
                    if (error) {
                        return callback(error);
                    }
                    
                    if (this.changes === 0) {
                        return callback(new Error('Cliente no encontrado'));
                    }
                    
                    callback(null, { message: 'Cliente eliminado correctamente', id: id });
                });
            });
        });
    }

    // Buscar clientes
    static search(searchTerm, callback) {
        const term = `%${searchTerm}%`;
        db.all(`
            SELECT 
                id, 
                nombre_encargado,
                nombre_empresa,
                numero_documento,
                direccion,
                telefono,
                email
            FROM clientes 
            WHERE nombre_empresa LIKE ? 
               OR nombre_encargado LIKE ? 
               OR numero_documento LIKE ?
               OR email LIKE ?
            ORDER BY nombre_empresa ASC`,
            [term, term, term, term], (error, results) => {
            if (error) {
                return callback(error);
            }
            callback(null, results);
        });
    }

    // Obtener estadísticas del cliente
    static getEstadisticas(id, callback) {
        const query = `
            SELECT 
                c.id,
                c.nombre_empresa,
                COUNT(DISTINCT f.id) as total_facturas,
                COALESCE(SUM(f.total), 0) as total_facturado,
                COUNT(DISTINCT p.id) as total_pagos,
                COALESCE(SUM(p.monto), 0) as total_pagado,
                (COALESCE(SUM(f.total), 0) - COALESCE(SUM(p.monto), 0)) as saldo_pendiente
            FROM clientes c
            LEFT JOIN facturas f ON c.id = f.cliente_id
            LEFT JOIN pagos_cliente p ON c.id = p.cliente_id
            WHERE c.id = ?
            GROUP BY c.id, c.nombre_empresa
        `;
        
        db.get(query, [id], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    }
}

module.exports = Clientes;