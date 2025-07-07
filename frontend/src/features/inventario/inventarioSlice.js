import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/apiService';

const initialState = {
  items: [],
  itemType: 'PRODUCTO',
  searchTerm: '',
  loading: false,
  error: null,
};


// Thunk para obtener ítems
export const fetchItems = createAsyncThunk(
    'inventory/fetchItems',
    async (_, { rejectWithValue }) => {
        try {
            const url = `items`;
            const data = await apiService.get(url);
            return data;
        } catch (error) {
            console.error('fetchItems: Mensaje de error:', error.message);
            return rejectWithValue(error.message || 'Error desconocido al cargar ítems.');
        }
    }
);

// Thunk para crear un ítem (sin cambios)
export const createItem = createAsyncThunk(
    'inventory/createItem',
    async (formData, { rejectWithValue }) => {
        try {
            const data = await apiService.post('items', formData);
            return data;
        } catch (error) {
            console.error('createItem: Error al crear ítem:', error.message);
            return rejectWithValue(error.message);
        }
    }
);

// Thunk para actualizar un ítem (sin cambios)
export const updateItem = createAsyncThunk(
    'inventory/updateItem',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            
            const data = await apiService.put(`items/${id}`, formData);
            return data;
        } catch (error) {
            
            // Proporcionar más información del error
            if (error.response) {
                return rejectWithValue(`Error ${error.response.status}: ${error.response.data?.message || error.response.statusText}`);
            }
            
            return rejectWithValue(error.message || 'Error desconocido al actualizar ítem');
        }
    }
);

// Agregar este thunk después de updateItem
// CORREGIDO: Thunk para eliminar un ítem
export const deleteItem = createAsyncThunk(
    'inventario/deleteItem',
    async (id, { rejectWithValue }) => {
        try {
            
            // USAR el método delete genérico del apiService
            const response = await apiService.delete(`items/${id}`);
            
            return { id, ...response };
        } catch (error) {
            return rejectWithValue(error.message || 'Error al eliminar ítem');
        }
    }
);

const inventarioSlice = createSlice({
    name: 'inventario',
    initialState,
    reducers: {
        setItemType: (state, action) => {
            state.itemType = action.payload;
            state.error = null; 
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        clearSearchTerm: (state) => {
            state.searchTerm = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.error = null;
            })
            .addCase(fetchItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Error al cargar ítems';
                state.items = [];
            })
            .addCase(createItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createItem.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(createItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Error al crear ítem';
            })
            .addCase(updateItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateItem.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(updateItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Error al actualizar ítem';
            })
            .addCase(deleteItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteItem.fulfilled, (state, action) => {
                state.loading = false;
                // Eliminar el ítem del estado
                state.items = state.items.filter(item => item.id !== action.payload);
                state.error = null;
            })
            .addCase(deleteItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Error al eliminar ítem';
            });
    },
});

export const { setItemType, setSearchTerm, clearSearchTerm } = inventarioSlice.actions;
export default inventarioSlice.reducer;