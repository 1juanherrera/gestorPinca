const Formulaciones = require('../models/Formulaciones');

const formulacionesController = {
  // Obtener todas las formulaciones con información completa
  getAllFormulaciones: (req, res) => {
    
    Formulaciones.getAll((err, formulaciones) => {
      if (err) {
        console.error('🔴 Error al obtener formulaciones:', err);
        return res.status(500).json({ 
          error: 'Error interno del servidor al obtener formulaciones',
          details: err.message 
        });
      }
      res.json(formulaciones);
    });
  },

  calculateCostsWithNewVolume: (req, res) => {
    const { itemId } = req.params;
    const { newVolume } = req.body;
    
    console.log('🧮 Controller: Calculando costos para item:', itemId, 'volumen:', newVolume);
    
    // Validar parámetros
    if (!itemId || !newVolume || newVolume <= 0) {
      return res.status(400).json({ 
        error: 'itemId y newVolume son requeridos y newVolume debe ser mayor a 0' 
      });
    }
    
    Formulaciones.calculateCostsWithNewVolume(itemId, parseFloat(newVolume), (err, resultado) => {
      if (err) {
        console.error('🔴 Error al calcular costos:', err);
        return res.status(500).json({ 
          error: 'Error interno del servidor al calcular costos',
          details: err.message 
        });
      }
      
      console.log('✅ Costos calculados exitosamente');
      res.json(resultado);
    });
  },

  // AGREGADO: Actualizar costos calculados
  updateCalculatedCosts: (req, res) => {
    const { itemId } = req.params;
    const { costos_nuevos } = req.body;
    
    console.log('💾 Controller: Actualizando costos para item:', itemId);
    
    // Validar parámetros
    if (!itemId || !costos_nuevos) {
      return res.status(400).json({ 
        error: 'itemId y costos_nuevos son requeridos' 
      });
    }
    
    Formulaciones.updateCalculatedCosts(itemId, costos_nuevos, (err, resultado) => {
      if (err) {
        console.error('🔴 Error al actualizar costos:', err);
        return res.status(500).json({ 
          error: 'Error interno del servidor al actualizar costos',
          details: err.message 
        });
      }
      
      console.log('✅ Costos actualizados exitosamente');
      res.json(resultado);
    });
  }
};



module.exports = formulacionesController;