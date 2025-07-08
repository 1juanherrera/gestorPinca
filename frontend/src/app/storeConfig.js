// Configuración de middleware optimizada para desarrollo
export const getOptimizedMiddleware = (getDefaultMiddleware) => {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  if (isDevelopment) {
    // En desarrollo, configurar con umbrales altos para evitar warnings
    return getDefaultMiddleware({
      serializableCheck: {
        // Desactivar para datos grandes o configurar umbrales muy altos
        warnAfter: 512, // Aumentar a 512ms
        ignoredActions: [
          'persist/PERSIST', 
          'persist/REHYDRATE',
          'clientes/fetchClientes/fulfilled',
          'formulaciones/fetchFormulaciones/fulfilled',
          'inventario/fetchItems/fulfilled'
        ],
        ignoredPaths: [
          '_persist',
          'clientes.clientes',
          'formulaciones.formulaciones', 
          'inventario.items'
        ],
      },
      immutableCheck: {
        warnAfter: 512, // Aumentar a 512ms
        ignoredPaths: [
          'clientes.clientes', 
          'formulaciones.formulaciones', 
          'inventario.items'
        ],
      },
    });
  }
  
  // En producción, usar configuración por defecto (más ligera)
  return getDefaultMiddleware();
};

// Configuración de DevTools optimizada
export const getDevToolsConfig = () => {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  if (!isDevelopment) return false;
  
  return {
    maxAge: 50, // Limitar historial de acciones
    trace: false, // Desactivar trazas para mejor rendimiento
    traceLimit: 25,
    serialize: {
      options: {
        undefined: true,
        function: false, // No serializar funciones
        symbol: false, // No serializar symbols
      }
    }
  };
};
