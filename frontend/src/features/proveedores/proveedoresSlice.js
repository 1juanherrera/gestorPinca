import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/apiService';

// Thunks asincrónicos
export const fetchProveedores = createAsyncThunk(
    'proveedores/fetchProveedores',
    async (_, { rejectWithValue }) => {
        try {
            const data = await apiService.get('proveedores'); 
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Error al obtener proveedores');
        }
    }
);

export const fetchProveedorById = createAsyncThunk(
    'proveedores/fetchProveedorById',
    async (id, { rejectWithValue }) => {
        try {
            const data = await apiService.get(`proveedores/${id}`); // ← Cambiar aquí
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Error al obtener proveedor');
        }
    }
);

export const createProveedor = createAsyncThunk(
    'proveedores/createProveedor',
    async (proveedorData, { rejectWithValue }) => {
        try {
            const data = await apiService.post('proveedores', proveedorData); // ← Cambiar aquí
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Error al crear proveedor');
        }
    }
);

export const updateProveedor = createAsyncThunk(
    'proveedores/updateProveedor',
    async ({ id, proveedorData }, { rejectWithValue }) => {
        try {
            const data = await apiService.put(`proveedores/${id}`, proveedorData); // ← Cambiar aquí
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Error al actualizar proveedor');
        }
    }
);

export const deleteProveedor = createAsyncThunk(
    'proveedores/deleteProveedor',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiService.delete(`proveedores/${id}`); // ← Ya está correcto
            return { id, ...response };
        } catch (error) {
            return rejectWithValue(error.message || 'Error al eliminar proveedor');
        }
    }
);

export const searchProveedores = createAsyncThunk(
    'proveedores/searchProveedores',
    async (searchTerm, { rejectWithValue }) => {
        try {
            const data = await apiService.get(`proveedores/search/${searchTerm}`); // ← Cambiar aquí
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Error en la búsqueda');
        }
    }
);

export const fetchProveedorProductos = createAsyncThunk(
    'proveedores/fetchProveedorProductos',
    async (proveedorId, { rejectWithValue }) => {
        try {
            const data = await apiService.get(`proveedores/${proveedorId}/productos`); // ← Cambiar aquí
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Error al obtener productos del proveedor');
        }
    }
);

export const fetchProveedorEstadisticas = createAsyncThunk(
    'proveedores/fetchProveedorEstadisticas',
    async (proveedorId, { rejectWithValue }) => {
        try {
            const data = await apiService.get(`proveedores/${proveedorId}/estadisticas`); // ← Cambiar aquí
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Error al obtener estadísticas');
        }
    }
);

// Estado inicial
const initialState = {
    proveedores: [],
    currentProveedor: null,
    proveedorProductos: [],
    proveedorEstadisticas: null,
    loading: false,
    error: null,
    searchResults: [],
    searchLoading: false,
    searchError: null,
    filters: {
        searchTerm: '',
        sortBy: 'nombre_empresa',
        sortOrder: 'asc'
    },
    pagination: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0
    }
};

// Slice
const proveedoresSlice = createSlice({
    name: 'proveedores',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
            state.searchError = null;
        },
        clearCurrentProveedor: (state) => {
            state.currentProveedor = null;
            state.proveedorProductos = [];
            state.proveedorEstadisticas = null;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        clearSearchResults: (state) => {
            state.searchResults = [];
            state.searchError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch proveedores
            .addCase(fetchProveedores.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProveedores.fulfilled, (state, action) => {
                
                // CORREGIR: Extraer los datos del objeto response
                const datos = action.payload.data || action.payload;
                
                state.loading = false;
                state.proveedores = datos; // ← Guardar solo el array, no el objeto completo
                state.pagination.totalItems = Array.isArray(datos) ? datos.length : 0;
                state.error = null;
            })
            .addCase(fetchProveedores.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.proveedores = [];
            })

            // Fetch proveedor por ID
            .addCase(fetchProveedorById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProveedorById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentProveedor = action.payload;
            })
            .addCase(fetchProveedorById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Crear proveedor
            .addCase(createProveedor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProveedor.fulfilled, (state, action) => {
                state.loading = false;
                state.proveedores.unshift(action.payload);
                state.pagination.totalItems += 1;
                state.error = null;
            })
            .addCase(createProveedor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Actualizar proveedor
            .addCase(updateProveedor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProveedor.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.proveedores.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.proveedores[index] = action.payload;
                }
                if (state.currentProveedor?.id === action.payload.id) {
                    state.currentProveedor = action.payload;
                }
                state.error = null;
            })
            .addCase(updateProveedor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Eliminar proveedor
            .addCase(deleteProveedor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProveedor.fulfilled, (state, action) => {
                state.loading = false;
                state.proveedores = state.proveedores.filter(p => p.id !== action.payload.id);
                state.pagination.totalItems -= 1;
                if (state.currentProveedor?.id === action.payload.id) {
                    state.currentProveedor = null;
                }
                state.error = null;
            })
            .addCase(deleteProveedor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Buscar proveedores
            .addCase(searchProveedores.pending, (state) => {
                state.searchLoading = true;
                state.searchError = null;
            })
            .addCase(searchProveedores.fulfilled, (state, action) => {
                state.searchLoading = false;
                state.searchResults = action.payload;
            })
            .addCase(searchProveedores.rejected, (state, action) => {
                state.searchLoading = false;
                state.searchError = action.payload;
            })

            // Productos del proveedor
            .addCase(fetchProveedorProductos.fulfilled, (state, action) => {
                state.proveedorProductos = action.payload;
            })

            // Estadísticas del proveedor
            .addCase(fetchProveedorEstadisticas.fulfilled, (state, action) => {
                state.proveedorEstadisticas = action.payload;
            });
    }
});

export const {
    clearError,
    clearCurrentProveedor,
    setFilters,
    setPagination,
    clearSearchResults
} = proveedoresSlice.actions;

export default proveedoresSlice.reducer;