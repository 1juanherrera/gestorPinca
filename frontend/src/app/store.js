import { configureStore } from '@reduxjs/toolkit';
import inventarioReducer from '../features/inventario/inventarioSlice';
import formulacionesReducer from '../features/formulaciones/formulacionesSlice'; 
import clienteReducer from '../features/clientes/clientesSlice';
import proveedoresReducer from '../features/proveedores/proveedoresSlice'; // ← Cambiar a plural
import { getOptimizedMiddleware, getDevToolsConfig } from './storeConfig';
import itemProveedoresReducer from '../features/itemProveedor/itemProveedorSlice'; // ← NUEVO

export const store = configureStore({
  reducer: {
    inventario: inventarioReducer,
    formulaciones: formulacionesReducer,
    clientes: clienteReducer,
    proveedores: proveedoresReducer,
    itemProveedores: itemProveedoresReducer
  },
  middleware: getOptimizedMiddleware,
  devTools: getDevToolsConfig(),
})