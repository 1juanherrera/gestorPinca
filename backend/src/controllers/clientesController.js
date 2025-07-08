const Clientes = require('../models/Clientes');

const clientesController = {
    // Obtener todos los clientes
    getAllClientes: (req, res) => {
        Clientes.getAll((err, clientes) => {
            if (err) {
                console.error('🔴 Error al obtener clientes:', err);
                return res.status(500).json({ 
                    error: 'Error interno del servidor al obtener clientes',
                    details: err.message 
                });
            }
            res.json(clientes);
        });
    },

    // Obtener cliente por ID
    getClienteById: (req, res) => {
        const { id } = req.params;
        
        Clientes.getById(id, (err, cliente) => {
            if (err) {
                console.error('🔴 Error al obtener cliente:', err);
                return res.status(500).json({ 
                    error: 'Error interno del servidor al obtener cliente',
                    details: err.message 
                });
            }
            
            if (!cliente) {
                return res.status(404).json({ 
                    error: 'Cliente no encontrado' 
                });
            }
            
            res.json(cliente);
        });
    },

    // Obtener cliente con facturas
    getClienteWithFacturas: (req, res) => {
        const { id } = req.params;
        
        Clientes.getWithFacturas(id, (err, cliente) => {
            if (err) {
                console.error('🔴 Error al obtener cliente con facturas:', err);
                return res.status(500).json({ 
                    error: 'Error interno del servidor al obtener cliente con facturas',
                    details: err.message 
                });
            }
            
            if (!cliente) {
                return res.status(404).json({ 
                    error: 'Cliente no encontrado' 
                });
            }
            
            res.json(cliente);
        });
    },

    // Obtener cliente con pagos
    getClienteWithPagos: (req, res) => {
        const { id } = req.params;
        
        Clientes.getWithPagos(id, (err, cliente) => {
            if (err) {
                console.error('🔴 Error al obtener cliente con pagos:', err);
                return res.status(500).json({ 
                    error: 'Error interno del servidor al obtener cliente con pagos',
                    details: err.message 
                });
            }
            
            if (!cliente) {
                return res.status(404).json({ 
                    error: 'Cliente no encontrado' 
                });
            }
            
            res.json(cliente);
        });
    },

    // Crear nuevo cliente
    createCliente: (req, res) => {
        const clienteData = req.body;
        
        // Validaciones básicas
        if (!clienteData.nombre_empresa) {
            return res.status(400).json({ 
                error: 'El nombre de la empresa es obligatorio' 
            });
        }
        
        if (!clienteData.numero_documento) {
            return res.status(400).json({ 
                error: 'El número de documento es obligatorio' 
            });
        }
        
        Clientes.create(clienteData, (err, nuevoCliente) => {
            if (err) {
                console.error('🔴 Error al crear cliente:', err);
                return res.status(500).json({ 
                    error: 'Error interno del servidor al crear cliente',
                    details: err.message 
                });
            }
            
            res.status(201).json({
                message: 'Cliente creado exitosamente',
                cliente: nuevoCliente
            });
        });
    },

    // Actualizar cliente
    updateCliente: (req, res) => {
        const { id } = req.params;
        const clienteData = req.body;
        
        // Validaciones básicas
        if (!clienteData.nombre_empresa) {
            return res.status(400).json({ 
                error: 'El nombre de la empresa es obligatorio' 
            });
        }
        
        if (!clienteData.numero_documento) {
            return res.status(400).json({ 
                error: 'El número de documento es obligatorio' 
            });
        }
        
        Clientes.update(id, clienteData, (err, clienteActualizado) => {
            if (err) {
                console.error('🔴 Error al actualizar cliente:', err);
                if (err.message === 'Cliente no encontrado') {
                    return res.status(404).json({ error: err.message });
                }
                return res.status(500).json({ 
                    error: 'Error interno del servidor al actualizar cliente',
                    details: err.message 
                });
            }
            
            res.json({
                message: 'Cliente actualizado exitosamente',
                cliente: clienteActualizado
            });
        });
    },

    // Eliminar cliente
    deleteCliente: (req, res) => {
        const { id } = req.params;
        
        Clientes.delete(id, (err, result) => {
            if (err) {
                console.error('🔴 Error al eliminar cliente:', err);
                if (err.message.includes('no encontrado')) {
                    return res.status(404).json({ error: err.message });
                }
                if (err.message.includes('facturas asociadas') || err.message.includes('pagos asociados')) {
                    return res.status(409).json({ error: err.message });
                }
                return res.status(500).json({ 
                    error: 'Error interno del servidor al eliminar cliente',
                    details: err.message 
                });
            }
            
            res.json(result);
        });
    },

    // Buscar clientes
    searchClientes: (req, res) => {
        const { q } = req.query;
        
        if (!q || q.trim() === '') {
            return res.status(400).json({ 
                error: 'Término de búsqueda requerido' 
            });
        }
        
        Clientes.search(q.trim(), (err, clientes) => {
            if (err) {
                console.error('🔴 Error al buscar clientes:', err);
                return res.status(500).json({ 
                    error: 'Error interno del servidor al buscar clientes',
                    details: err.message 
                });
            }
            
            res.json(clientes);
        });
    },

    // Obtener estadísticas del cliente
    getClienteEstadisticas: (req, res) => {
        const { id } = req.params;
        
        Clientes.getEstadisticas(id, (err, estadisticas) => {
            if (err) {
                console.error('🔴 Error al obtener estadísticas del cliente:', err);
                return res.status(500).json({ 
                    error: 'Error interno del servidor al obtener estadísticas',
                    details: err.message 
                });
            }
            
            if (!estadisticas) {
                return res.status(404).json({ 
                    error: 'Cliente no encontrado' 
                });
            }
            
            res.json(estadisticas);
        });
    }
};

module.exports = clientesController;