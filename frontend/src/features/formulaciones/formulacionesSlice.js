import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/apiService';

// Estado inicial
const initialState = {
  formulaciones: [],
  loading: false,
  error: null,
};

// Thunk para obtener todas las formulaciones
export const fetchFormulaciones = createAsyncThunk(
  'formulaciones/fetchFormulaciones',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🟡 Thunk: fetchFormulaciones iniciado');
      const response = await apiService.get('formulaciones');
      console.log('🟡 Thunk: Formulaciones obtenidas:', response.length);
      return response;
    } catch (error) {
      console.error('🟡 Thunk: Error al obtener formulaciones:', error);
      return rejectWithValue(error.message || 'Error al obtener formulaciones');
    }
  }
);

// Slice
const formulacionesSlice = createSlice({
  name: 'formulaciones',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearFormulaciones: (state) => {
      state.formulaciones = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch formulaciones
      .addCase(fetchFormulaciones.pending, (state) => {
        console.log('🟡 Slice: fetchFormulaciones.pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFormulaciones.fulfilled, (state, action) => {
        console.log('🟡 Slice: fetchFormulaciones.fulfilled', action.payload.length);
        state.loading = false;
        state.formulaciones = action.payload;
        state.error = null;
      })
      .addCase(fetchFormulaciones.rejected, (state, action) => {
        console.error('🟡 Slice: fetchFormulaciones.rejected', action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Acciones
export const { clearError, clearFormulaciones } = formulacionesSlice.actions;

// Selectores
export const selectFormulaciones = (state) => state.formulaciones.formulaciones;
export const selectFormulacionesLoading = (state) => state.formulaciones.loading;
export const selectFormulacionesError = (state) => state.formulaciones.error;

// Selector para productos con formulaciones
export const selectProductosConFormulaciones = (state) => {
  return state.formulaciones.formulaciones.filter(item => 
    (item.tipo === 'PRODUCTO' || item.tipo === 'INSUMO') &&
    item.formulaciones && 
    item.formulaciones.length > 0
  );
};

export const selectEstadisticasPorTipo = (state) => {
  const items = state.formulaciones.formulaciones;
  const productos = items.filter(item => item.tipo === 'PRODUCTO' && item.formulaciones?.length > 0);
  const insumos = items.filter(item => item.tipo === 'INSUMO' && item.formulaciones?.length > 0);
  
  return {
    productos: productos.length,
    insumos: insumos.length,
    total: productos.length + insumos.length
  };
};

export default formulacionesSlice.reducer;