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
    
    db.all(sql, [], (err, items) => {
      if (err) {
        callback(err);
        return;
      }

      // Si no hay items, retornar array vacío
      if (!items || items.length === 0) {
        callback(null, []);
        return;
      }

      // Obtener formulaciones para todos los items que son PRODUCTO o INSUMO
      const itemsWithFormulaciones = items.filter(item => 
        item.tipo === 'PRODUCTO' || item.tipo === 'INSUMO'
      );

      if (itemsWithFormulaciones.length === 0) {
        // Si no hay productos/insumos, devolver items sin formulaciones
        const itemsWithEmptyFormulaciones = items.map(item => ({
          ...item,
          formulaciones: []
        }));
        callback(null, itemsWithEmptyFormulaciones);
        return;
      }

      // Crear placeholders para la consulta IN
      const placeholders = itemsWithFormulaciones.map(() => '?').join(',');
      const itemIds = itemsWithFormulaciones.map(item => item.id);

      // Consultar todas las formulaciones de una vez - CORREGIDO: usar producto_id consistentemente
      const formulacionesSql = `
        SELECT 
          f.id,
          f.producto_id,
          f.materia_prima_id,
          f.cantidad,
          f.unidad,
          ig.nombre as materia_prima_nombre,
          ig.codigo as materia_prima_codigo,
          COALESCE(inv.cantidad, 0) as cantidad_disponible
        FROM formulaciones f
        INNER JOIN item_general ig ON f.materia_prima_id = ig.id
        LEFT JOIN inventario inv ON ig.id = inv.item_id
        LEFT JOIN costos_produccion cp ON ig.id = inv.item_id
        WHERE f.producto_id IN (${placeholders})
        ORDER BY f.producto_id, ig.nombre
      `;

      db.all(formulacionesSql, itemIds, (formErr, formulaciones) => {
        if (formErr) {
          callback(formErr);
          return;
        }

        // Agrupar formulaciones por producto_id
        const formulacionesMap = {};
        formulaciones.forEach(form => {
          if (!formulacionesMap[form.producto_id]) {
            formulacionesMap[form.producto_id] = [];
          }
          formulacionesMap[form.producto_id].push({
            id: form.id,
            materia_prima_id: form.materia_prima_id,
            cantidad: form.cantidad,
            unidad: form.unidad,
            materia_prima: {
              nombre: form.materia_prima_nombre,
              codigo: form.materia_prima_codigo,
              cantidad_disponible: form.cantidad_disponible
            }
          });
        });

        // Combinar items con sus formulaciones
        const result = items.map(item => ({
          ...item,
          formulaciones: formulacionesMap[item.id] || []
        }));

        callback(null, result);
      });
    });
  }

  // CORREGIDO: Para obtener un ítem por su ID con TODOS los campos
  static getById(id, callback) {
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
      const cantidad = parseFloat(item.cantidad) || 0;
      const costoUnitario = parseFloat(item.costo_unitario) || 0;

      // Crear item_especifico
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
        item.categoria_id || null
      ], (ieErr) => {
        if (ieErr) {
          callback(ieErr);
          return;
        }

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
            if (costErr) {
              callback(costErr);
              return;
            }

            // Crear formulaciones si las hay y es PRODUCTO o INSUMO
            if ((item.tipo === 'PRODUCTO' || item.tipo === 'INSUMO') && item.formulaciones && item.formulaciones.length > 0) {
              Item.createFormulaciones(itemId, item.formulaciones, (formErr) => {
                if (formErr) {
                  callback(formErr);
                  return;
                }
                
                callback(null, { 
                  id: itemId, 
                  ...item,
                  cantidad: cantidad,
                  costo_unitario: costoUnitario,
                  formulaciones: item.formulaciones
                });
              });
            } else {
              callback(null, { 
                id: itemId, 
                ...item,
                cantidad: cantidad,
                costo_unitario: costoUnitario,
                formulaciones: []
              });
            }
          });
        });
      });
    });
  }

  // CORREGIDO: Método helper para crear formulaciones con nombres consistentes
 static createFormulaciones(itemId, formulaciones, callback) {
  
  if (!formulaciones || formulaciones.length === 0) {
    callback(null);
    return;
  }

  // CORREGIDO: Solo usar las columnas que existen en la tabla
  const sql = `INSERT INTO formulaciones (producto_id, materia_prima_id, cantidad, unidad) VALUES (?, ?, ?, ?)`;
  let completed = 0;
  let hasError = false;

  formulaciones.forEach((form, index) => {
    
    // Validar que la formulación tenga los campos requeridos
    if (!form.materia_prima_id || !form.cantidad) {
      console.error(`Formulación ${index + 1} incompleta:`, form);
      if (!hasError) {
        hasError = true;
        callback(new Error('Formulación incompleta: falta materia prima o cantidad'));
      }
      return;
    }

    // CORREGIDO: Solo los 4 parámetros que existen en la tabla
    const params = [
      itemId,
      form.materia_prima_id,
      parseFloat(form.cantidad),
      form.unidad || 'kg'
    ];

    db.run(sql, params, function(err) {
      if (err && !hasError) {
        console.error(`Error en formulación ${index + 1}:`, err);
        hasError = true;
        callback(err);
        return;
      }
      
      completed++;
      
      if (completed === formulaciones.length && !hasError) {
        callback(null);
      }
    });
  });
}

static update(id, item, callback) {
  
  // AGREGAR: Definir la variable sql que faltaba
  const sql = `UPDATE item_general SET nombre = ?, codigo = ?, tipo = ? WHERE id = ?`;
  
  db.run(sql, [item.nombre, item.codigo, item.tipo, id], function(err) {
    if (err) {
      console.error('Error en item_general update:', err);
      callback(err);
      return;
    }
    
    // Actualizar item_especifico
    const updateEspecificoSql = `
      UPDATE item_especifico SET 
        viscosidad = ?, p_g = ?, color = ?, brillo_60 = ?, secado = ?, 
        cubrimiento = ?, molienda = ?, ph = ?, poder_tintoreo = ?, 
        volumen = ?, categoria_id = ?
      WHERE item_general_id = ?
    `;
    
    const especificoParams = [
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
      item.categoria_id || null,
      id
    ];
    
    db.run(updateEspecificoSql, especificoParams, (updateErr) => {
      if (updateErr) {
        console.error('Error en item_especifico update:', updateErr);
        callback(updateErr);
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
            console.error('Error en inventario update:', invErr);
            callback(invErr);
            return;
          }
          updateCostos();
        });
      } else {
        updateCostos();
      }
      
      function updateCostos() {
        // Actualizar costo si se proporciona y NO es null
        if (item.costo_unitario !== undefined && item.costo_unitario !== null) {
          const costoUnitario = parseFloat(item.costo_unitario);
          
          // Validar que el parseFloat sea válido
          if (isNaN(costoUnitario)) {
            updateFormulaciones();
            return;
          }
          
          const costosSql = `
            INSERT INTO costos_produccion (item_id, costo_unitario) VALUES (?, ?)
            ON CONFLICT(item_id) DO UPDATE SET costo_unitario = excluded.costo_unitario
          `;
          
          db.run(costosSql, [id, costoUnitario], updateFormulaciones);
        } else {
          updateFormulaciones();
        }
      }

      function updateFormulaciones(costErr) {
        if (costErr) {
          console.error('Error en costos update:', costErr);
          callback(costErr);
          return;
        }
        
        // Manejar formulaciones si es PRODUCTO o INSUMO
        if ((item.tipo === 'PRODUCTO' || item.tipo === 'INSUMO') && item.formulaciones !== undefined) {
          
          // Eliminar formulaciones existentes
          const deleteFormulacionesSql = `DELETE FROM formulaciones WHERE producto_id = ?`;
          db.run(deleteFormulacionesSql, [id], (deleteErr) => {
            if (deleteErr) {
              console.error('Error eliminando formulaciones:', deleteErr);
              callback(deleteErr);
              return;
            }
            
            // Crear nuevas formulaciones si las hay
            if (item.formulaciones && item.formulaciones.length > 0) {
              Item.createFormulaciones(id, item.formulaciones, (formErr) => {
                if (formErr) {
                  console.error('Error creando formulaciones:', formErr);
                  callback(formErr);
                  return;
                }
                
                callback(null, { id, ...item });
              });
            } else {
              callback(null, { id, ...item });
            }
          });
        } else {
          callback(null, { id, ...item });
        }
      }
    });
  });
}

  // CORREGIDO: Para eliminar un ítem completamente
  static delete(id, callback) {
  
  // Usar transacciones para asegurar consistencia
  db.serialize(() => {
    db.run("BEGIN TRANSACTION", (beginErr) => {
      if (beginErr) {
        console.error('Error iniciando transacción:', beginErr);
        callback(beginErr);
        return;
      }
      
      // Eliminar formulaciones primero (si existen)
      const deleteFormulacionesSql = `DELETE FROM formulaciones WHERE producto_id = ? OR materia_prima_id = ?`;
      
      db.run(deleteFormulacionesSql, [id, id], function(err) {
        if (err) {
          console.error('Error eliminando formulaciones:', err);
          db.run("ROLLBACK");
          callback(err);
          return;
        }
        
        // Eliminar de costos_produccion
        const deleteCostosSql = `DELETE FROM costos_produccion WHERE item_id = ?`;
        
        db.run(deleteCostosSql, [id], function(err) {
          if (err) {
            console.error('Error eliminando costos:', err);
            db.run("ROLLBACK");
            callback(err);
            return;
          }
          
          // Eliminar de inventario
          const deleteInventarioSql = `DELETE FROM inventario WHERE item_id = ?`;
          
          db.run(deleteInventarioSql, [id], function(err) {
            if (err) {
              console.error('Error eliminando inventario:', err);
              db.run("ROLLBACK");
              callback(err);
              return;
            }
            
            // Eliminar de item_especifico
            const deleteEspecificoSql = `DELETE FROM item_especifico WHERE item_general_id = ?`;
            
            db.run(deleteEspecificoSql, [id], function(err) {
              if (err) {
                console.error('Error eliminando item_especifico:', err);
                db.run("ROLLBACK");
                callback(err);
                return;
              }
              
              // Eliminar de item_general
              const deleteGeneralSql = `DELETE FROM item_general WHERE id = ?`;
              
              db.run(deleteGeneralSql, [id], function(err) {
                if (err) {
                  console.error('Error eliminando item_general:', err);
                  db.run("ROLLBACK");
                  callback(err);
                  return;
                }
                
                // Confirmar transacción
                db.run("COMMIT", (commitErr) => {
                  if (commitErr) {
                    console.error('Error confirmando transacción:', commitErr);
                    callback(commitErr);
                    return;
                  }
                  callback(null, { success: true, deletedId: id });
                });
              });
            });
          });
        });
      });
    });
  });
}
}

module.exports = Item;