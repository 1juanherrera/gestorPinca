const db = require('../db/connection');

class Item {
  static getAll(callback) {
    const sql = `
      SELECT 
            ig.id,
            ig.nombre,
            ig.codigo,
            ig.tipo,
            ie.viscosidad,
            ie.p_g,
            ie.color,
            ie.brillo_60,
            ie.secado,
            ie.cubrimiento,
            ie.molienda,
            ie.ph,
            ie.poder_tintoreo,
            ie.volumen,
            ie.categoria_id,
        COALESCE(inv.cantidad, 0) as cantidad,
        COALESCE(cp.costo_unitario, 0) as costo_unitario
      FROM item_general ig
      LEFT JOIN item_especifico ie ON ig.id = ie.item_general_id
      LEFT JOIN inventario inv ON ig.id = inv.item_id
      LEFT JOIN costos_produccion cp ON ig.id = cp.item_id
      ORDER BY ig.id
    `;
    db.all(sql, [], callback); 
  }

  // Para obtener un ítem por su ID con cantidad y costo
  static getById(id, callback) {
    const sql = `
      SELECT 
        ig.id, 
        ig.nombre, 
        ig.codigo, 
        ig.tipo,
        COALESCE(inv.cantidad, 0) as cantidad,
        COALESCE(cp.costo_unitario, 0) as costo_unitario
      FROM item_general ig
      LEFT JOIN inventario inv ON ig.id = inv.item_id
      LEFT JOIN costos_produccion cp ON ig.id = cp.item_id
      WHERE ig.id = ?
    `;
    db.get(sql, [id], callback);
  }

  // Para crear un nuevo ítem
  static create(item, callback) {
    const sql = `INSERT INTO item_general (nombre, codigo, tipo) VALUES (?, ?, ?)`;
    db.run(sql, [item.nombre, item.codigo, item.tipo], function(err) {
      if (err) {
        callback(err);
        return;
      }
      
      const itemId = this.lastID;
      const cantidad = item.cantidad || 0;
      const costoUnitario = item.costo_unitario || 0;

      const itemEspecificoSql = `INSERT INTO item_especifico (item_general_id, viscosidad, p_g, color, brillo_60, secado, cubrimiento, molienda, ph, poder_tintoreo, volumen, categoria_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      db.run(itemEspecificoSql, [
        itemId,
        item.viscosidad || '',
        item.p_g || '',
        item.color || '',
        item.brillo_60 || '',
        item.secado || '',
        item.cubrimiento || '',
        item.molienda || '',
        item.ph || '',
        item.poder_tintoreo || '',
        item.volumen || '',
        item.categoria_id || ''
      ]);

      // Crear registro en inventario
      const inventarioSql = `INSERT INTO inventario (item_id, cantidad) VALUES (?, ?)`;
      db.run(inventarioSql, [itemId, cantidad], (invErr) => {
        if (invErr) {
          callback(invErr);
          return;
        }
        
        // Crear registro en costos_produccion
        const costosSql = `INSERT INTO costos_produccion (item_id, costo_unitario) VALUES (?, ?)`;
        db.run(costosSql, [itemId, costoUnitario], (costErr) => {
          callback(costErr, { 
            id: itemId, 
            ...item,
            cantidad: cantidad,
            costo_unitario: costoUnitario
          });
        });
      });
    });
  }

  // Para actualizar un ítem existente
  static update(id, item, callback) {
    // Actualizar item_general
    const sql = `UPDATE item_general SET nombre = ?, codigo = ?, tipo = ? WHERE id = ?`;
    db.run(sql, [item.nombre, item.codigo, item.tipo, id], function(err) {
      if (err) {
        callback(err);
        return;
      }
      
      // Actualizar inventario si se proporciona cantidad
      if (item.cantidad !== undefined) {
        const cantidad = parseFloat(item.cantidad);
        const inventarioSql = `
          INSERT INTO inventario (item_id, cantidad) VALUES (?, ?)
          ON CONFLICT(item_id) DO UPDATE SET cantidad = excluded.cantidad
        `;
        db.run(inventarioSql, [id, cantidad], (invErr) => {
          if (invErr) {
            callback(invErr);
            return;
          }
          
          // Actualizar costo si se proporciona
          if (item.costo_unitario !== undefined) {
            const costoUnitario = parseFloat(item.costo_unitario);
            const costosSql = `
              INSERT INTO costos_produccion (item_id, costo_unitario) VALUES (?, ?)
              ON CONFLICT(item_id) DO UPDATE SET costo_unitario = excluded.costo_unitario
            `;
            db.run(costosSql, [id, costoUnitario], callback);
          } else {
            callback(null);
          }
        });
      } else if (item.costo_unitario !== undefined) {
        // Solo actualizar costo
        const costoUnitario = parseFloat(item.costo_unitario);
        const costosSql = `
          INSERT INTO costos_produccion (item_id, costo_unitario) VALUES (?, ?)
          ON CONFLICT(item_id) DO UPDATE SET costo_unitario = excluded.costo_unitario
        `;
        db.run(costosSql, [id, costoUnitario], callback);
      } else {
        callback(null);
      }
    });
  }

  // Para eliminar un ítem
  static delete(id, callback) {
    // Eliminar de costos_produccion
    const deleteCostosSql = `DELETE FROM costos_produccion WHERE item_id = ?`;
    db.run(deleteCostosSql, [id], (err) => {
      if (err) {
        callback(err);
        return;
      }
      
      // Eliminar de inventario
      const deleteInventarioSql = `DELETE FROM inventario WHERE item_id = ?`;
      db.run(deleteInventarioSql, [id], (err) => {
        if (err) {
          callback(err);
          return;
        }
        
        // Eliminar de item_general
        const sql = `DELETE FROM item_general WHERE id = ?`;
        db.run(sql, [id], callback);
      });
    });
  }

  // Método para actualizar solo costo unitario
  static updateCostoUnitario(id, costoUnitario, callback) {
    const costo = parseFloat(costoUnitario);
    const sql = `
      INSERT INTO costos_produccion (item_id, costo_unitario) VALUES (?, ?)
      ON CONFLICT(item_id) DO UPDATE SET costo_unitario = excluded.costo_unitario
    `;
    db.run(sql, [id, costo], callback);
  }
}

module.exports = Item;