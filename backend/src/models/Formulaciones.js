const db = require('../db/connection');

class Formulaciones {
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
        cp.id as costo_id,
        COALESCE(cp.costo_unitario, 0) as costo_unitario,
        COALESCE(cp.costo_mp_galon, 0) as costo_mp_galon,
        cp.periodo,
        cp.metodo_calculo,
        cp.fecha_calculo,
        COALESCE(cp.costo_mp_kg, 0) as costo_mp_kg,
        COALESCE(cp.envase, 0) as envase,
        COALESCE(cp.etiqueta, 0) as etiqueta,
        COALESCE(cp.bandeja, 0) as bandeja,
        COALESCE(cp.plastico, 0) as plastico,
        COALESCE(cp.costo_total, 0) as costo_total,
        COALESCE(cp.volumen, 0) as volumen_costo,
        COALESCE(cp.precio_venta, 0) as precio_venta,
        COALESCE(cp.cantidad_total, 0) as cantidad_total,
        COALESCE(cp.costo_mod, 0) as costo_mod
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

      if (!items || items.length === 0) {
        callback(null, []);
        return;
      }

      // Obtener formulaciones para productos e insumos
      const itemsWithFormulaciones = items.filter(item => 
        item.tipo === 'PRODUCTO' || item.tipo === 'INSUMO'
      );

      if (itemsWithFormulaciones.length === 0) {
        const itemsWithEmptyFormulaciones = items.map(item => ({
          ...item,
          formulaciones: []
        }));
        callback(null, itemsWithEmptyFormulaciones);
        return;
      }

      const placeholders = itemsWithFormulaciones.map(() => '?').join(',');
      const itemIds = itemsWithFormulaciones.map(item => item.id);

      const formulacionesSql = `
        SELECT 
          f.id,
          f.producto_id,
          f.materia_prima_id,
          f.cantidad,
          f.unidad,
          ig.nombre as materia_prima_nombre,
          ig.codigo as materia_prima_codigo,
          COALESCE(inv.cantidad, 0) as cantidad_disponible,
          COALESCE(cp_mp.costo_unitario, 0) as materia_prima_costo_unitario,
          (f.cantidad * COALESCE(cp_mp.costo_unitario, 0)) as costo_total_materia
        FROM formulaciones f
        INNER JOIN item_general ig ON f.materia_prima_id = ig.id
        LEFT JOIN inventario inv ON ig.id = inv.item_id
        LEFT JOIN costos_produccion cp_mp ON ig.id = cp_mp.item_id
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
            materia_prima_nombre: form.materia_prima_nombre,
            materia_prima_codigo: form.materia_prima_codigo,
            materia_prima_costo_unitario: form.materia_prima_costo_unitario,
            costo_total_materia: form.costo_total_materia,
            materia_prima: {
              nombre: form.materia_prima_nombre,
              codigo: form.materia_prima_codigo,
              cantidad_disponible: form.cantidad_disponible,
              costo_unitario: form.materia_prima_costo_unitario
            }
          });
        });

        // Combinar items con sus formulaciones
        const result = items.map(item => {
          const formulacionesItem = formulacionesMap[item.id] || [];
          
          const costo_total_formulacion = formulacionesItem.reduce((total, form) => {
            return total + (form.costo_total_materia || 0);
          }, 0);

          return {
            ...item,
            formulaciones: formulacionesItem,
            costo_total_formulacion
          };
        });

        callback(null, result);
      });
    });
  }

  // ...existing code...

static calculateCostsWithNewVolume(itemId, newVolume, callback) {
    console.log('🧮 [DEBUG] Iniciando cálculo - itemId:', itemId, 'newVolume:', newVolume);
    
    if (!itemId || !newVolume || isNaN(newVolume) || newVolume <= 0) {
      console.log('🔴 [ERROR] Parámetros inválidos:', { itemId, newVolume });
      callback(new Error('Parámetros inválidos'));
      return;
    }

    const itemSql = `
      SELECT 
        ig.id,
        ig.nombre,
        ig.codigo,
        ig.tipo,
        COALESCE(cp.costo_unitario, 0) as costo_unitario,
        COALESCE(cp.costo_mp_galon, 0) as costo_mp_galon,
        COALESCE(cp.costo_mp_kg, 0) as costo_mp_kg,
        COALESCE(cp.envase, 0) as envase,
        COALESCE(cp.etiqueta, 0) as etiqueta,
        COALESCE(cp.bandeja, 0) as bandeja,
        COALESCE(cp.plastico, 0) as plastico,
        COALESCE(cp.costo_total, 0) as costo_total_actual,
        COALESCE(cp.volumen, 1) as volumen_actual,
        COALESCE(cp.precio_venta, 0) as precio_venta_actual,
        COALESCE(cp.cantidad_total, 0) as cantidad_total_actual,
        COALESCE(cp.costo_mod, 0) as costo_mod,
        -- AGREGADO: Campos adicionales para debugging
        cp.costo_total as costo_total_raw,
        cp.precio_venta as precio_venta_raw
      FROM item_general ig
      LEFT JOIN costos_produccion cp ON ig.id = cp.item_id
      WHERE ig.id = ?
    `;

    console.log('🧮 [DEBUG] Ejecutando consulta de item...');
    
    db.get(itemSql, [itemId], (err, item) => {
      if (err) {
        console.error('🔴 [ERROR] Error en consulta de item:', err.message);
        callback(err);
        return;
      }

      if (!item) {
        console.log('🔴 [ERROR] Item no encontrado:', itemId);
        callback(new Error(`Item con ID ${itemId} no encontrado`));
        return;
      }

      console.log('✅ [DEBUG] Item encontrado:', {
        nombre: item.nombre,
        costo_total_actual: item.costo_total_actual,
        precio_venta_actual: item.precio_venta_actual,
        volumen_actual: item.volumen_actual,
        costo_total_raw: item.costo_total_raw,
        precio_venta_raw: item.precio_venta_raw
      });

      const formulacionesSql = `
        SELECT 
          f.id,
          f.producto_id,
          f.materia_prima_id,
          f.cantidad,
          f.unidad,
          ig.nombre as materia_prima_nombre,
          ig.codigo as materia_prima_codigo,
          COALESCE(cp_mp.costo_unitario, 0) as materia_prima_costo_unitario,
          (f.cantidad * COALESCE(cp_mp.costo_unitario, 0)) as costo_total_materia
        FROM formulaciones f
        INNER JOIN item_general ig ON f.materia_prima_id = ig.id
        LEFT JOIN costos_produccion cp_mp ON ig.id = cp_mp.item_id
        WHERE f.producto_id = ?
        ORDER BY ig.nombre
      `;

      console.log('🧮 [DEBUG] Ejecutando consulta de formulaciones...');

      db.all(formulacionesSql, [itemId], (formErr, formulaciones) => {
        if (formErr) {
          console.error('🔴 [ERROR] Error en consulta de formulaciones:', formErr.message);
          callback(formErr);
          return;
        }

        console.log('✅ [DEBUG] Formulaciones encontradas:', formulaciones.length);

        try {
          // CALCULAR VALORES ORIGINALES
          const costo_total_materias_primas = formulaciones.reduce((total, form) => {
            return total + (parseFloat(form.costo_total_materia) || 0);
          }, 0);

          const volumen_original = parseFloat(item.volumen_actual) || 1;
          const factor_escala = parseFloat(newVolume) / volumen_original;

          // CORREGIDO: Usar los valores reales de la base de datos
          const costo_total_original = parseFloat(item.costo_total_actual) || 0;
          const precio_venta_original = parseFloat(item.precio_venta_actual) || 0;

          console.log('🧮 [DEBUG] Valores originales:', {
            costo_total_materias_primas,
            volumen_original,
            factor_escala,
            costo_total_original,
            precio_venta_original
          });

          // CALCULAR NUEVOS VALORES
          const nuevas_cantidades = formulaciones.map(form => ({
            ...form,
            cantidad_original: parseFloat(form.cantidad) || 0,
            cantidad_nueva: (parseFloat(form.cantidad) || 0) * factor_escala,
            costo_total_materia_nueva: ((parseFloat(form.cantidad) || 0) * factor_escala) * (parseFloat(form.materia_prima_costo_unitario) || 0)
          }));

          const nuevo_costo_total_materias_primas = nuevas_cantidades.reduce((total, form) => {
            return total + (parseFloat(form.costo_total_materia_nueva) || 0);
          }, 0);

          const es_liquido = item.tipo === 'PRODUCTO';
          const costo_mp_por_unidad = nuevo_costo_total_materias_primas / parseFloat(newVolume);
          const costo_mp_galon = es_liquido ? costo_mp_por_unidad : 0;
          const costo_mp_kg = !es_liquido ? costo_mp_por_unidad : 0;

          const envase_nuevo = (parseFloat(item.envase) || 0) * factor_escala;
          const etiqueta_nueva = (parseFloat(item.etiqueta) || 0) * factor_escala;
          const bandeja_nueva = (parseFloat(item.bandeja) || 0) * factor_escala;
          const plastico_nuevo = (parseFloat(item.plastico) || 0) * factor_escala;
          const costo_mod_nuevo = (parseFloat(item.costo_mod) || 0) * factor_escala;

          const costo_total_nuevo = nuevo_costo_total_materias_primas + 
                                    envase_nuevo + 
                                    etiqueta_nueva + 
                                    bandeja_nueva + 
                                    plastico_nuevo + 
                                    costo_mod_nuevo;

          const precio_venta_nuevo = costo_total_nuevo * 1.4;
          const cantidad_total_nueva = (parseFloat(item.cantidad_total_actual) || 0) * factor_escala;

          const resultado = {
            item_info: {
              id: item.id,
              nombre: item.nombre,
              codigo: item.codigo,
              tipo: item.tipo
            },
            volumenes: {
              volumen_original: volumen_original,
              volumen_nuevo: parseFloat(newVolume),
              factor_escala: factor_escala
            },
            costos_originales: {
              costo_total_materias_primas: costo_total_materias_primas,
              costo_mp_galon: parseFloat(item.costo_mp_galon) || 0,
              costo_mp_kg: parseFloat(item.costo_mp_kg) || 0,
              envase: parseFloat(item.envase) || 0,
              etiqueta: parseFloat(item.etiqueta) || 0,
              bandeja: parseFloat(item.bandeja) || 0,
              plastico: parseFloat(item.plastico) || 0,
              costo_mod: parseFloat(item.costo_mod) || 0,
              // CORREGIDO: Asegurar que los valores originales estén presentes
              costo_total: costo_total_original > 0 ? costo_total_original : costo_total_materias_primas,
              precio_venta: precio_venta_original > 0 ? precio_venta_original : costo_total_materias_primas * 1.4,
              cantidad_total: parseFloat(item.cantidad_total_actual) || 0
            },
            costos_nuevos: {
              costo_total_materias_primas: nuevo_costo_total_materias_primas,
              costo_mp_galon: costo_mp_galon,
              costo_mp_kg: costo_mp_kg,
              envase: envase_nuevo,
              etiqueta: etiqueta_nueva,
              bandeja: bandeja_nueva,
              plastico: plastico_nuevo,
              costo_mod: costo_mod_nuevo,
              costo_total: costo_total_nuevo,
              precio_venta: precio_venta_nuevo,
              cantidad_total: cantidad_total_nueva,
              volumen: parseFloat(newVolume)
            },
            formulaciones_originales: formulaciones,
            formulaciones_nuevas: nuevas_cantidades,
            metadatos: {
              fecha_calculo: new Date().toISOString(),
              metodo_calculo: 'ESCALADO_POR_VOLUMEN'
            }
          };

          console.log('✅ [DEBUG] Resultado final:', {
            costos_originales: resultado.costos_originales,
            costos_nuevos: resultado.costos_nuevos
          });

          callback(null, resultado);

        } catch (calcErr) {
          console.error('🔴 [ERROR] Error en cálculos:', calcErr.message);
          callback(calcErr);
        }
      });
    });
  }

  // Método para actualizar costos
  static updateCosts(itemId, newCosts, callback) {
    const sql = `
      UPDATE costos_produccion 
      SET 
        costo_total_materias_primas = ?,
        costo_mp_galon = ?,
        costo_mp_kg = ?,
        envase = ?,
        etiqueta = ?,
        bandeja = ?,
        plastico = ?,
        costo_mod = ?,
        costo_total = ?,
        precio_venta = ?,
        cantidad_total = ?,
        volumen = ?,
        fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE item_id = ?
    `;

    db.run(sql, [
      newCosts.costo_total_materias_primas,
      newCosts.costo_mp_galon,
      newCosts.costo_mp_kg,
      newCosts.envase,
      newCosts.etiqueta,
      newCosts.bandeja,
      newCosts.plastico,
      newCosts.costo_mod,
      newCosts.costo_total,
      newCosts.precio_venta,
      newCosts.cantidad_total,
      newCosts.volumen,
      itemId
    ], function(err) {
      if (err) {
        callback(err);
        return;
      }
      
      callback(null, { success: true, changes: this.changes });
    });
  }
}

module.exports = Formulaciones;