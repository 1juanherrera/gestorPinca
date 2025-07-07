import { configureStore } from '@reduxjs/toolkit';
import inventarioReducer from '../features/inventario/inventarioSlice';
import formulacionesReducer from '../features/formulaciones/formulacionesSlice'; 

export const store = configureStore({
  reducer: {
    inventario: inventarioReducer,
    formulaciones: formulacionesReducer,
  }
})