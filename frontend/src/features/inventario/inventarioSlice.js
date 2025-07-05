// src/features/inventory/inventorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService, getApiUrl } from '../../services/apiService';

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
            console.log('fetchItems: Intentando cargar TODOS los ítems.');
            const url = `items`;
            console.log('fetchItems: URL de la API a solicitar:', getApiUrl(url)); 

            const data = await apiService.get(url);

            console.log('fetchItems: Datos recibidos de la API (dentro del thunk):', data);
            return data;
        } catch (error) {
            console.error('fetchItems: Error capturado en thunk:', error);
            console.error('fetchItems: Mensaje de error:', error.message);
            console.error('fetchItems: Detalles adicionales del error:', error.response?.data || error.response || JSON.stringify(error));
            return rejectWithValue(error.message || 'Error desconocido al cargar ítems.');
        }
    }
);

// Thunk para crear un ítem (sin cambios)
export const createItem = createAsyncThunk(
    'inventory/createItem',
    async (formData, { rejectWithValue }) => {
        try {
            console.log('createItem: Intentando crear ítem con datos:', formData);
            const data = await apiService.post('items', formData);
            console.log('createItem: Ítem creado con éxito:', data);
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
            console.log(`updateItem: Intentando actualizar ítem ${id} con datos:`, formData);
            const data = await apiService.put(`items/${id}`, formData);
            console.log('updateItem: Ítem actualizado con éxito:', data);
            return data;
        } catch (error) {
            console.error('updateItem: Error al actualizar ítem:', error.message);
            return rejectWithValue(error.message);
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
            .addCase(createItem.fulfilled, (state, action) => {
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
            .addCase(updateItem.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(updateItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Error al actualizar ítem';
            });
    },
});

export const { setItemType, setSearchTerm, clearSearchTerm } = inventarioSlice.actions;
export default inventarioSlice.reducer;