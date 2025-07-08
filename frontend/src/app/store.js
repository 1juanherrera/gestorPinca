import { configureStore } from '@reduxjs/toolkit';
import inventarioReducer from '../features/inventario/inventarioSlice';
import formulacionesReducer from '../features/formulaciones/formulacionesSlice'; 
import clienteReducer from '../features/clientes/clientesSlice';
import { getOptimizedMiddleware, getDevToolsConfig } from './storeConfig';

export const store = configureStore({
  reducer: {
    inventario: inventarioReducer,
    formulaciones: formulacionesReducer,
    clientes: clienteReducer
  },
  middleware: getOptimizedMiddleware,
  devTools: getDevToolsConfig(),
})