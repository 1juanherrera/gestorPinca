import { useState } from 'react';
import { apiService } from '../services/apiService';

export const useCostCalculator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateCosts = async (itemId, newVolume) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🧮 Calculando costos para item:', itemId, 'volumen:', newVolume);
      
      const response = await apiService.post(`formulaciones/calculate-costs/${itemId}`, {
        newVolume: newVolume
      });
      
      console.log('✅ Costos calculados:', response);
      return response;
    } catch (err) {
      console.error('❌ Error al calcular costos:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const saveCosts = async (itemId, costos_nuevos) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('💾 Guardando costos para item:', itemId);
      
      const response = await apiService.put(`formulaciones/update-costs/${itemId}`, {
        costos_nuevos: costos_nuevos
      });
      
      console.log('✅ Costos guardados:', response);
      return response;
    } catch (err) {
      console.error('❌ Error al guardar costos:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    loading,
    error,
    calculateCosts,
    saveCosts,
    clearError
  };
};