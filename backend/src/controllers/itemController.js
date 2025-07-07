const Item = require('../models/Item');
const { formatCantidad, formatMoneda } = require('../utils/formatters');

exports.getAllItems = (req, res) => {
  Item.getAll((err, items) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const formattedItems = items.map(item => ({
      ...item,
      cantidad: formatCantidad(item.cantidad),
      costo_unitario: formatMoneda(item.costo_unitario)
    }));
    
    res.json(formattedItems);
  });
}

exports.getItemById = (req, res) => {
  const { id } = req.params;
  Item.getById(id, (err, item) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!item) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }
    
    const formattedItem = {
      ...item,
      cantidad: formatCantidad(item.cantidad),
      costo_unitario: formatMoneda(item.costo_unitario)
    };
    
    res.json(formattedItem);
  });
}

exports.createItem = (req, res) => {
  const newItem = req.body;
  Item.create(newItem, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ 
      id: this.lastID, 
      ...newItem,
      cantidad: formatCantidad(newItem.cantidad || 0),
      costo_unitario: formatMoneda(newItem.costo_unitario || 0)
    });
  });
}

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const itemData = req.body;
    
    // Validar que el ID sea un número
    if (!id || isNaN(id)) {
      console.error('ID inválido:', id);
      return res.status(400).json({ error: 'ID de ítem inválido' });
    }
    
    // Validar datos básicos
    if (!itemData.nombre || !itemData.codigo || !itemData.tipo) {
      console.error('Datos básicos faltantes:', { nombre: itemData.nombre, codigo: itemData.codigo, tipo: itemData.tipo });
      return res.status(400).json({ error: 'Faltan datos básicos (nombre, código, tipo)' });
    }
    
    Item.update(parseInt(id), itemData, (err, updatedItem) => {
      if (err) {
        console.error('Error en Item.update:', err);
        console.error('Error.message:', err.message);
        console.error('Error.stack:', err.stack);
        return res.status(500).json({ error: err.message });
      }
      res.json(updatedItem);
    });
  } catch (error) {
    console.error('Error inesperado en updateItem:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validar que el ID sea un número
    if (!id || isNaN(id)) {
      console.error('ID inválido:', id);
      return res.status(400).json({ error: 'ID de ítem inválido' });
    }
    
    // Verificar que el ítem existe antes de eliminar
    Item.getById(parseInt(id), (getErr, item) => {
      if (getErr) {
        console.error('Error verificando existencia del item:', getErr);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
      
      if (!item) {
        console.error('Item no encontrado:', id);
        return res.status(404).json({ error: 'Ítem no encontrado' });
      }
      
      // Proceder con la eliminación
      Item.delete(parseInt(id), (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Ítem eliminado exitosamente', ...result });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};