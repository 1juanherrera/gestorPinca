const Item = require('../models/Item');

exports.getAllItems = (req, res) => {
  Item.getAll((err, items) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(items);
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
    res.json(item);
  });
}

exports.createItem = (req, res) => {
  const newItem = req.body; // Los datos del nuevo item vienen en el cuerpo de la solicitud
  Item.create(newItem, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, ...newItem }); // Retorna el item creado con su ID
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
    res.json({ message: 'Item actualizado con éxito' });
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
    res.status(204).send(); // 204 No Content para eliminación exitosa
  });
}