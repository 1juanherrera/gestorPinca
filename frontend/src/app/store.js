import { configureStore } from '@reduxjs/toolkit';
import inventarioReducer from '../features/inventario/inventarioSlice';

export const store = configureStore({
  reducer: {
    inventario: inventarioReducer,
  },
});