import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/apiService';

// Thunks asincrónicos
export const fetchItemsProveedor = createAsyncThunk(
    'itemProveedor/fetchItemsProveedor',
    async (_, { rejectWithValue }) => {
        try {
            const data = await apiService.get('item-proveedor');
            return data;
        } catch (error) {
            console.error('fetchItemsProveedor: Mensaje de error:', error.message);
            return rejectWithValue(error.message || 'Error desconocido al cargar productos de proveedores.');
        }
    }
);

export const fetchItemProveedorById = createAsyncThunk(
    'itemProveedor/fetchItemProveedorById',
    async (id, { rejectWithValue }) => {
        try {
            const data = await apiService.get(`item-proveedor/${id}`);
            return data;
        } catch (error) {
            console.error('fetchItemProveedorById: Error al obtener producto:', error.message);
            return rejectWithValue(error.message || 'Error al obtener producto');
        }
    }
);

export const createItemProveedor = createAsyncThunk(
    'itemProveedor/createItemProveedor',
    async (itemData, { rejectWithValue }) => {
        try {
            const data = await apiService.post('item-proveedor', itemData);
            return data;
        } catch (error) {
            console.error('createItemProveedor: Error al crear producto:', error.message);
            return rejectWithValue(error.message || 'Error al crear producto');
        }
    }
);

export const updateItemProveedor = createAsyncThunk(
    'itemProveedor/updateItemProveedor',
    async ({ id, itemData }, { rejectWithValue }) => {
        try {
            const data = await apiService.put(`item-proveedor/${id}`, itemData);
            return data;
        } catch (error) {
            console.error('updateItemProveedor: Error al actualizar producto:', error.message);
            return rejectWithValue(error.message || 'Error al actualizar producto');
        }
    }
);

export const deleteItemProveedor = createAsyncThunk(
    'itemProveedor/deleteItemProveedor',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiService.delete(`item-proveedor/${id}`);
            return { id, ...response };
        } catch (error) {
            console.error('deleteItemProveedor: Error al eliminar producto:', error.message);
            return rejectWithValue(error.message || 'Error al eliminar producto');
        }
    }
);

export const searchItemsProveedor = createAsyncThunk(
    'itemProveedor/searchItemsProveedor',
    async (searchTerm, { rejectWithValue }) => {
        try {
            const data = await apiService.get(`item-proveedor/search/${searchTerm}`);
            return data;
        } catch (error) {
            console.error('searchItemsProveedor: Error en la búsqueda:', error.message);
            return rejectWithValue(error.message || 'Error en la búsqueda');
        }
    }
);

export const fetchItemsByProveedor = createAsyncThunk(
    'itemProveedor/fetchItemsByProveedor',
    async (proveedorId, { rejectWithValue }) => {
        try {
            const data = await apiService.get(`item-proveedor/proveedor/${proveedorId}`);
            return data;
        } catch (error) {
            console.error('fetchItemsByProveedor: Error al obtener productos:', error.message);
            return rejectWithValue(error.message || 'Error al obtener productos del proveedor');
        }
    }
);

export const verificarEnInventario = createAsyncThunk(
    'itemProveedor/verificarEnInventario',
    async (itemId, { rejectWithValue }) => {
        try {
            const data = await apiService.get(`item-proveedor/${itemId}/verificar-inventario`);
            return data;
        } catch (error) {
            console.error('verificarEnInventario: Error al verificar inventario:', error.message);
            return rejectWithValue(error.message || 'Error al verificar inventario');
        }
    }
);

export const agregarAInventario = createAsyncThunk(
    'itemProveedor/agregarAInventario',
    async ({ itemId, cantidad }, { rejectWithValue }) => {
        try {
            const data = await apiService.post(`item-proveedor/${itemId}/agregar-inventario`, { cantidad });
            return data;
        } catch (error) {
            console.error('agregarAInventario: Error al agregar a inventario:', error.message);
            return rejectWithValue(error.message || 'Error al agregar a inventario');
        }
    }
);

export const cambiarProveedor = createAsyncThunk(
    'itemProveedor/cambiarProveedor',
    async ({ itemId, nuevoProveedorId }, { rejectWithValue }) => {
        try {
            const data = await apiService.put(`item-proveedor/${itemId}/cambiar-proveedor`, { nuevo_proveedor_id: nuevoProveedorId });
            return data;
        } catch (error) {
            console.error('cambiarProveedor: Error al cambiar proveedor:', error.message);
            return rejectWithValue(error.message || 'Error al cambiar proveedor');
        }
    }
);

export const transferirProductos = createAsyncThunk(
    'itemProveedor/transferirProductos',
    async ({ productosIds, nuevoProveedorId }, { rejectWithValue }) => {
        try {
            const data = await apiService.put('item-proveedor/transferir-productos', { 
                productos_ids: productosIds, 
                nuevo_proveedor_id: nuevoProveedorId 
            });
            return data;
        } catch (error) {
            console.error('transferirProductos: Error al transferir productos:', error.message);
            return rejectWithValue(error.message || 'Error al transferir productos');
        }
    }
);

export const fetchProveedoresDisponibles = createAsyncThunk(
    'itemProveedor/fetchProveedoresDisponibles',
    async (_, { rejectWithValue }) => {
        try {
            const data = await apiService.get('item-proveedor/proveedores-disponibles');
            return data;
        } catch (error) {
            console.error('fetchProveedoresDisponibles: Error al obtener proveedores:', error.message);
            return rejectWithValue(error.message || 'Error al obtener proveedores disponibles');
        }
    }
);

export const fetchEstadisticasItemsProveedor = createAsyncThunk(
    'itemProveedor/fetchEstadisticasItemsProveedor',
    async (_, { rejectWithValue }) => {
        try {
            const data = await apiService.get('item-proveedor/estadisticas/general');
            return data;
        } catch (error) {
            console.error('fetchEstadisticasItemsProveedor: Error al obtener estadísticas:', error.message);
            return rejectWithValue(error.message || 'Error al obtener estadísticas');
        }
    }
);

// Estado inicial
const initialState = {
    items: [],
    currentItem: null,
    proveedoresDisponibles: [],
    estadisticas: null,
    loading: false,
    error: null,
    searchResults: [],
    searchLoading: false,
    searchError: null,
    filters: {
        searchTerm: '',
        proveedorId: null,
        tipo: '',
        disponible: true,
        sortBy: 'nombre',
        sortOrder: 'asc'
    },
    pagination: {
        currentPage: 1,
        itemsPerPage: 12,
        totalItems: 0
    }
};

// Slice
const itemProveedorSlice = createSlice({
    name: 'itemProveedor',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
            state.searchError = null;
        },
        clearCurrentItem: (state) => {
            state.currentItem = null;
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
        setSearchTerm: (state, action) => {
            state.filters.searchTerm = action.payload;
        },
        clearSearchTerm: (state) => {
            state.filters.searchTerm = '';
            state.searchResults = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch items proveedor
            .addCase(fetchItemsProveedor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchItemsProveedor.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.pagination.totalItems = action.payload.length;
                state.error = null;
            })
            .addCase(fetchItemsProveedor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Error al cargar productos';
                state.items = [];
            })

            // Fetch item por ID
            .addCase(fetchItemProveedorById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchItemProveedorById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentItem = action.payload;
                state.error = null;
            })
            .addCase(fetchItemProveedorById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Error al obtener producto';
            })

            // Crear item
            .addCase(createItemProveedor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createItemProveedor.fulfilled, (state, action) => {
                state.loading = false;
                state.items.unshift(action.payload);
                state.pagination.totalItems += 1;
                state.error = null;
            })
            .addCase(createItemProveedor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Error al crear producto';
            })

            // Actualizar item
            .addCase(updateItemProveedor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateItemProveedor.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
                if (state.currentItem?.id === action.payload.id) {
                    state.currentItem = action.payload;
                }
                state.error = null;
            })
            .addCase(updateItemProveedor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Error al actualizar producto';
            })

            // Eliminar item
            .addCase(deleteItemProveedor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteItemProveedor.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(item => item.id !== action.payload.id);
                state.pagination.totalItems -= 1;
                if (state.currentItem?.id === action.payload.id) {
                    state.currentItem = null;
                }
                state.error = null;
            })
            .addCase(deleteItemProveedor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Error al eliminar producto';
            })

            // Buscar items
            .addCase(searchItemsProveedor.pending, (state) => {
                state.searchLoading = true;
                state.searchError = null;
            })
            .addCase(searchItemsProveedor.fulfilled, (state, action) => {
                state.searchLoading = false;
                state.searchResults = action.payload;
                state.searchError = null;
            })
            .addCase(searchItemsProveedor.rejected, (state, action) => {
                state.searchLoading = false;
                state.searchError = action.payload || 'Error en la búsqueda';
                state.searchResults = [];
            })

            // Obtener proveedores disponibles
            .addCase(fetchProveedoresDisponibles.fulfilled, (state, action) => {
                state.proveedoresDisponibles = action.payload;
            })

            // Estadísticas
            .addCase(fetchEstadisticasItemsProveedor.fulfilled, (state, action) => {
                state.estadisticas = action.payload;
            });
    }
});

export const {
    clearError,
    clearCurrentItem,
    setFilters,
    setPagination,
    clearSearchResults,
    setSearchTerm,
    clearSearchTerm
} = itemProveedorSlice.actions;

export default itemProveedorSlice.reducer;