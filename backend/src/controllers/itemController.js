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

exports.updateItem = (req, res) => {
  const { id } = req.params;
  const updatedItem = req.body;

  Item.update(id, updatedItem, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
        return res.status(404).json({ message: 'Item no encontrado para actualizar' });
    }
    res.json({ 
      message: 'Item actualizado con éxito',
      id: id,
      ...updatedItem,
      cantidad: updatedItem.cantidad ? formatCantidad(updatedItem.cantidad) : undefined,
      costo_unitario: updatedItem.costo_unitario ? formatMoneda(updatedItem.costo_unitario) : undefined
    });
  });
}

exports.deleteItem = (req, res) => {
  const { id } = req.params;
  Item.delete(id, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
        return res.status(404).json({ message: 'Item no encontrado para eliminar' });
    }
    res.status(204).send();
  });
}