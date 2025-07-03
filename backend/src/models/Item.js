// src/models/Item.js
const db = require('../db/connection'); // Importa la conexión a la DB

class Item {
  // Para obtener todos los ítems
  static getAll(callback) {
    const sql = `SELECT id, nombre, codigo, tipo FROM item_general`;
    db.all(sql, [], callback); 
  }

  // Para obtener un ítem por su ID
  static getById(id, callback) {
    const sql = `SELECT id, nombre, codigo, tipo FROM item_general WHERE id = ?`;
    db.get(sql, [id], callback); 
  }

  // Para crear un nuevo ítem
  static create(item, callback) {
    const sql = `INSERT INTO item_general (nombre, codigo, tipo) VALUES (?, ?, ?)`;
    db.run(sql, [item.nombre, item.codigo, item.tipo], callback);
  }

  // Para actualizar un ítem existente
  static update(id, item, callback) {
    const sql = `UPDATE item_general SET nombre = ?, codigo = ?, tipo = ? WHERE id = ?`;
    db.run(sql, [item.nombre, item.codigo, item.tipo, id], callback);
  }

  // Para eliminar un ítem
  static delete(id, callback) {
    const sql = `DELETE FROM item_general WHERE id = ?`;
    db.run(sql, [id], callback);
  }
}

module.exports = Item;