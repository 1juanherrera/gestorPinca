import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { optimizeState } from '../features/clientes/clientesSlice';

/**
 * Hook para optimizar automáticamente el estado de Redux
 * Limpia datos innecesarios periódicamente para mejorar el rendimiento
 */
export const useStateOptimization = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Ejecutar optimización inicial
    dispatch(optimizeState());

    // Configurar limpieza periódica cada 5 minutos
    const interval = setInterval(() => {
      dispatch(optimizeState());
    }, 300000); // 5 minutos

    // Limpiar intervalo al desmontar
    return () => clearInterval(interval);
  }, [dispatch]);

  // Función manual para optimizar cuando sea necesario
  const optimizeNow = () => {
    dispatch(optimizeState());
  };

  return { optimizeNow };
};
