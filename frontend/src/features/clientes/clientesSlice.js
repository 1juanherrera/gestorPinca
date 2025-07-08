import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { apiService } from '../../services/apiService';

// Estado inicial
const initialState = {
  clientes: [],
  selectedCliente: null,
  clienteConFacturas: null,
  clienteConPagos: null,
  clienteEstadisticas: null,
  loading: false,
  error: null,
  searchTerm: '',
  filters: {
    activos: true,
    inactivos: false
  },
  // Cache para optimizar rendimiento
  lastFetch: null,
  totalClientes: 0
};

// Thunk para obtener todos los clientes
export const fetchClientes = createAsyncThunk(
  'clientes/fetchClientes',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🟢 Thunk: fetchClientes iniciado');
      const response = await apiService.get('clientes');
      console.log('🟢 Thunk: Clientes obtenidos:', response.length);
      return response;
    } catch (error) {
      console.error('🟢 Thunk: Error al obtener clientes:', error);
      return rejectWithValue(error.message || 'Error al obtener clientes');
    }
  }
);

// Thunk para obtener un cliente por ID
export const fetchClienteById = createAsyncThunk(
  'clientes/fetchClienteById',
  async (id, { rejectWithValue }) => {
    try {
      console.log('🟢 Thunk: fetchClienteById iniciado para ID:', id);
      const response = await apiService.get(`clientes/${id}`);
      console.log('🟢 Thunk: Cliente obtenido:', response);
      return response;
    } catch (error) {
      console.error('🟢 Thunk: Error al obtener cliente por ID:', error);
      return rejectWithValue(error.message || 'Error al obtener cliente');
    }
  }
);

// Thunk para obtener cliente con facturas
export const fetchClienteWithFacturas = createAsyncThunk(
  'clientes/fetchClienteWithFacturas',
  async (id, { rejectWithValue }) => {
    try {
      console.log('🟢 Thunk: fetchClienteWithFacturas iniciado para ID:', id);
      const response = await apiService.get(`clientes/${id}/facturas`);
      console.log('🟢 Thunk: Cliente con facturas obtenido:', response);
      return response;
    } catch (error) {
      console.error('🟢 Thunk: Error al obtener cliente con facturas:', error);
      return rejectWithValue(error.message || 'Error al obtener cliente con facturas');
    }
  }
);

// Thunk para obtener cliente con pagos
export const fetchClienteWithPagos = createAsyncThunk(
  'clientes/fetchClienteWithPagos',
  async (id, { rejectWithValue }) => {
    try {
      console.log('🟢 Thunk: fetchClienteWithPagos iniciado para ID:', id);
      const response = await apiService.get(`clientes/${id}/pagos`);
      console.log('🟢 Thunk: Cliente con pagos obtenido:', response);
      return response;
    } catch (error) {
      console.error('🟢 Thunk: Error al obtener cliente con pagos:', error);
      return rejectWithValue(error.message || 'Error al obtener cliente con pagos');
    }
  }
);

// Thunk para obtener estadísticas del cliente
export const fetchClienteEstadisticas = createAsyncThunk(
  'clientes/fetchClienteEstadisticas',
  async (id, { rejectWithValue }) => {
    try {
      console.log('🟢 Thunk: fetchClienteEstadisticas iniciado para ID:', id);
      const response = await apiService.get(`clientes/${id}/estadisticas`);
      console.log('🟢 Thunk: Estadísticas del cliente obtenidas:', response);
      return response;
    } catch (error) {
      console.error('🟢 Thunk: Error al obtener estadísticas del cliente:', error);
      return rejectWithValue(error.message || 'Error al obtener estadísticas del cliente');
    }
  }
);

// Thunk para buscar clientes
export const searchClientes = createAsyncThunk(
  'clientes/searchClientes',
  async (searchTerm, { rejectWithValue }) => {
    try {
      console.log('🟢 Thunk: searchClientes iniciado:', searchTerm);
      const response = await apiService.get(`clientes/search?q=${encodeURIComponent(searchTerm)}`);
      console.log('🟢 Thunk: Búsqueda de clientes completada:', response.length);
      return response;
    } catch (error) {
      console.error('🟢 Thunk: Error al buscar clientes:', error);
      return rejectWithValue(error.message || 'Error al buscar clientes');
    }
  }
);

// Thunk para crear un nuevo cliente
export const createCliente = createAsyncThunk(
  'clientes/createCliente',
  async (clienteData, { rejectWithValue }) => {
    try {
      console.log('🟢 Thunk: createCliente iniciado:', clienteData);
      const response = await apiService.post('clientes', clienteData);
      console.log('🟢 Thunk: Cliente creado:', response);
      return response.cliente || response;
    } catch (error) {
      console.error('🟢 Thunk: Error al crear cliente:', error);
      return rejectWithValue(error.message || 'Error al crear cliente');
    }
  }
);

// Thunk para actualizar un cliente
export const updateCliente = createAsyncThunk(
  'clientes/updateCliente',
  async ({ id, clienteData }, { rejectWithValue }) => {
    try {
      console.log('🟢 Thunk: updateCliente iniciado para ID:', id, clienteData);
      const response = await apiService.put(`clientes/${id}`, clienteData);
      console.log('🟢 Thunk: Cliente actualizado:', response);
      return response.cliente || response;
    } catch (error) {
      console.error('🟢 Thunk: Error al actualizar cliente:', error);
      return rejectWithValue(error.message || 'Error al actualizar cliente');
    }
  }
);

// Thunk para eliminar un cliente
export const deleteCliente = createAsyncThunk(
  'clientes/deleteCliente',
  async (id, { rejectWithValue }) => {
    try {
      console.log('🟢 Thunk: deleteCliente iniciado para ID:', id);
      await apiService.delete(`clientes/${id}`);
      console.log('🟢 Thunk: Cliente eliminado con ID:', id);
      return id;
    } catch (error) {
      console.error('🟢 Thunk: Error al eliminar cliente:', error);
      return rejectWithValue(error.message || 'Error al eliminar cliente');
    }
  }
);

// Slice
const clientesSlice = createSlice({
  name: 'clientes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearClientes: (state) => {
      state.clientes = [];
      state.totalClientes = 0;
      state.lastFetch = null;
    },
    setSelectedCliente: (state, action) => {
      state.selectedCliente = action.payload;
    },
    clearSelectedCliente: (state) => {
      state.selectedCliente = null;
    },
    clearClienteRelationalData: (state) => {
      state.clienteConFacturas = null;
      state.clienteConPagos = null;
      state.clienteEstadisticas = null;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.searchTerm = '';
      state.filters = {
        activos: true,
        inactivos: false
      };
    },
    // Nueva acción para limpiar datos innecesarios y optimizar memoria
    optimizeState: (state) => {
      // Limpiar datos relacionales cuando no se necesiten
      if (!state.selectedCliente) {
        state.clienteConFacturas = null;
        state.clienteConPagos = null;
        state.clienteEstadisticas = null;
      }
      // Limpiar errores antiguos
      if (state.error && state.lastFetch && Date.now() - state.lastFetch > 300000) { // 5 minutos
        state.error = null;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch clientes
      .addCase(fetchClientes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientes.fulfilled, (state, action) => {
        state.loading = false;
        state.clientes = action.payload;
        state.totalClientes = action.payload.length;
        state.lastFetch = Date.now();
        state.error = null;
      })
      .addCase(fetchClientes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch cliente por ID
      .addCase(fetchClienteById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClienteById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCliente = action.payload;
        state.error = null;
      })
      .addCase(fetchClienteById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Buscar clientes
      .addCase(searchClientes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchClientes.fulfilled, (state, action) => {
        state.loading = false;
        state.clientes = action.payload;
        state.error = null;
      })
      .addCase(searchClientes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch cliente con facturas
      .addCase(fetchClienteWithFacturas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClienteWithFacturas.fulfilled, (state, action) => {
        state.loading = false;
        state.clienteConFacturas = action.payload;
        state.error = null;
      })
      .addCase(fetchClienteWithFacturas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch cliente con pagos
      .addCase(fetchClienteWithPagos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClienteWithPagos.fulfilled, (state, action) => {
        state.loading = false;
        state.clienteConPagos = action.payload;
        state.error = null;
      })
      .addCase(fetchClienteWithPagos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch estadísticas del cliente
      .addCase(fetchClienteEstadisticas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClienteEstadisticas.fulfilled, (state, action) => {
        state.loading = false;
        state.clienteEstadisticas = action.payload;
        state.error = null;
      })
      .addCase(fetchClienteEstadisticas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Crear cliente
      .addCase(createCliente.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCliente.fulfilled, (state, action) => {
        state.loading = false;
        state.clientes.push(action.payload);
        state.error = null;
      })
      .addCase(createCliente.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Actualizar cliente
      .addCase(updateCliente.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCliente.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.clientes.findIndex(cliente => cliente.id === action.payload.id);
        if (index !== -1) {
          state.clientes[index] = action.payload;
        }
        if (state.selectedCliente?.id === action.payload.id) {
          state.selectedCliente = action.payload;
        }
        state.error = null;
      })
      .addCase(updateCliente.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Eliminar cliente
      .addCase(deleteCliente.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCliente.fulfilled, (state, action) => {
        state.loading = false;
        state.clientes = state.clientes.filter(cliente => cliente.id !== action.payload);
        if (state.selectedCliente?.id === action.payload) {
          state.selectedCliente = null;
        }
        state.error = null;
      })
      .addCase(deleteCliente.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Acciones
export const { 
  clearError, 
  clearClientes, 
  setSelectedCliente, 
  clearSelectedCliente,
  clearClienteRelationalData,
  setSearchTerm,
  updateFilters,
  clearFilters,
  optimizeState
} = clientesSlice.actions;

// Selectores básicos
export const selectClientes = (state) => state.clientes.clientes;
export const selectClientesLoading = (state) => state.clientes.loading;
export const selectClientesError = (state) => state.clientes.error;
export const selectSelectedCliente = (state) => state.clientes.selectedCliente;
export const selectSearchTerm = (state) => state.clientes.searchTerm;
export const selectFilters = (state) => state.clientes.filters;
export const selectClienteConFacturas = (state) => state.clientes.clienteConFacturas;
export const selectClienteConPagos = (state) => state.clientes.clienteConPagos;
export const selectClienteEstadisticas = (state) => state.clientes.clienteEstadisticas;
export const selectTotalClientes = (state) => state.clientes.totalClientes;
export const selectLastFetch = (state) => state.clientes.lastFetch;

// Selectores avanzados memoizados
export const selectClientesFiltrados = createSelector(
  [selectClientes, selectSearchTerm],
  (clientes, searchTerm) => {
    // Si no hay término de búsqueda, devolver todos los clientes
    if (!searchTerm || searchTerm.trim() === '') {
      return clientes;
    }

    const searchTermLower = searchTerm.toLowerCase().trim();

    return clientes.filter(cliente => {
      // Verificar cada campo de forma eficiente
      const empresa = cliente.nombre_empresa?.toLowerCase();
      const encargado = cliente.nombre_encargado?.toLowerCase();
      const documento = cliente.numero_documento?.toString();
      const email = cliente.email?.toLowerCase();

      return (empresa && empresa.includes(searchTermLower)) ||
             (encargado && encargado.includes(searchTermLower)) ||
             (documento && documento.includes(searchTermLower)) ||
             (email && email.includes(searchTermLower));
    });
  }
);

export const selectClienteById = createSelector(
  [selectClientes, (state, clienteId) => clienteId],
  (clientes, clienteId) => {
    return clientes.find(cliente => cliente.id === clienteId);
  }
);

export const selectClientesEstadisticas = createSelector(
  [selectClientes],
  (clientes) => {
    return {
      total: clientes.length,
      conEmail: clientes.filter(c => c.email && c.email.trim() !== '').length,
      conTelefono: clientes.filter(c => c.telefono && c.telefono.trim() !== '').length,
      empresas: clientes.filter(c => c.nombre_empresa && c.nombre_empresa.trim() !== '').length
    };
  }
);

export const selectClientesPorEmpresa = createSelector(
  [selectClientes, (state, nombreEmpresa) => nombreEmpresa],
  (clientes, nombreEmpresa) => {
    return clientes.filter(cliente => 
      cliente.nombre_empresa?.toLowerCase().includes(nombreEmpresa.toLowerCase())
    );
  }
);

export default clientesSlice.reducer;