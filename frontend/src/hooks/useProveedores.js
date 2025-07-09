import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useMemo } from 'react';
import {
    fetchProveedores,
    fetchProveedorById,
    createProveedor,
    updateProveedor,
    deleteProveedor,
    searchProveedores,
    fetchProveedorProductos,
    fetchProveedorEstadisticas,
    clearError,
    clearCurrentProveedor,
    setFilters,
    setPagination,
    clearSearchResults
} from '../features/proveedores/proveedoresSlice';

export const useProveedores = () => {
    const dispatch = useDispatch();
    
    // CORREGIR: Los datos están en .data, no en .proveedores
    const proveedoresState = useSelector(state => {
        // console.log('🔍 estado completo:', state.proveedores);
        return state.proveedores;
    });

    // Extraer correctamente los datos
    const proveedores = useMemo(() => proveedoresState?.proveedores || [], [proveedoresState?.proveedores]);
    const loading = proveedoresState?.loading || false;
    const error = proveedoresState?.error || null;
    const filters = useMemo(() => proveedoresState?.filters || {
        searchTerm: '',
        sortBy: 'nombre_empresa',
        sortOrder: 'asc'
    }, [proveedoresState?.filters]);
    const pagination = useMemo(() => proveedoresState?.pagination || {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0
    }, [proveedoresState?.pagination]);

    // console.log('✅ Proveedores extraídos:', proveedores);
    // console.log('✅ Es array:', Array.isArray(proveedores));
    // console.log('✅ Length:', proveedores.length);

    // Acciones
    const loadProveedores = useCallback(() => {
        // console.log('Dispatching fetchProveedores'); // Para debug
        dispatch(fetchProveedores());
    }, [dispatch]);

    const loadProveedorById = useCallback((id) => {
        dispatch(fetchProveedorById(id));
    }, [dispatch]);

    const createNewProveedor = useCallback(async (proveedorData) => {
        try {
            await dispatch(createProveedor(proveedorData)).unwrap();
            return { success: true };
        } catch (error) {
            console.error('Error creating proveedor:', error);
            return { success: false, error };
        }
    }, [dispatch]);

    const updateExistingProveedor = useCallback(async (id, proveedorData) => {
        try {
            await dispatch(updateProveedor({ id, proveedorData })).unwrap();
            return { success: true };
        } catch (error) {
            console.error('Error updating proveedor:', error);
            return { success: false, error };
        }
    }, [dispatch]);

    const removeProveedor = useCallback(async (id) => {
        try {
            await dispatch(deleteProveedor(id)).unwrap();
            return { success: true };
        } catch (error) {
            console.error('Error deleting proveedor:', error);
            return { success: false, error };
        }
    }, [dispatch]);

    const searchProveedoresByTerm = useCallback((searchTerm) => {
        if (searchTerm.trim().length >= 2) {
            dispatch(searchProveedores(searchTerm));
        } else {
            dispatch(clearSearchResults());
        }
    }, [dispatch]);

    const loadProveedorProductos = useCallback((proveedorId) => {
        dispatch(fetchProveedorProductos(proveedorId));
    }, [dispatch]);

    const loadProveedorEstadisticas = useCallback((proveedorId) => {
        dispatch(fetchProveedorEstadisticas(proveedorId));
    }, [dispatch]);

    const clearErrors = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const clearCurrentProveedorData = useCallback(() => {
        dispatch(clearCurrentProveedor());
    }, [dispatch]);

    const updateFilters = useCallback((newFilters) => {
        dispatch(setFilters(newFilters));
    }, [dispatch]);

    const updatePagination = useCallback((newPagination) => {
        dispatch(setPagination(newPagination));
    }, [dispatch]);

    const clearSearch = useCallback(() => {
        dispatch(clearSearchResults());
    }, [dispatch]);

    // Datos computados
    const computed = useMemo(() => {
        // console.log('Computing with proveedores:', proveedores); // Para debug
        // console.log('Filters:', filters); // Para debug
        
        // Proveedores filtrados y ordenados
        const filteredProveedores = Array.isArray(proveedores) ? proveedores.filter(proveedor => {
            if (!filters.searchTerm) return true;
            const searchTerm = filters.searchTerm.toLowerCase();
            return (
                proveedor.nombre_empresa?.toLowerCase().includes(searchTerm) ||
                proveedor.nombre_encargado?.toLowerCase().includes(searchTerm) ||
                proveedor.numero_documento?.toLowerCase().includes(searchTerm) ||
                proveedor.email?.toLowerCase().includes(searchTerm)
            );
        }) : [];

        // console.log('Filtered proveedores:', filteredProveedores); // Para debug

        // Ordenar proveedores
        const sortedProveedores = [...filteredProveedores].sort((a, b) => {
            const aValue = a[filters.sortBy] || '';
            const bValue = b[filters.sortBy] || '';
            
            if (filters.sortOrder === 'asc') {
                return aValue.toString().localeCompare(bValue.toString());
            } else {
                return bValue.toString().localeCompare(aValue.toString());
            }
        });

        // console.log('Sorted proveedores:', sortedProveedores); // Para debug

        // Paginación
        const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
        const endIndex = startIndex + pagination.itemsPerPage;
        const paginatedProveedores = sortedProveedores.slice(startIndex, endIndex);

        // console.log('Paginated proveedores:', paginatedProveedores); // Para debug

        // Estadísticas generales
        const totalProveedores = Array.isArray(proveedores) ? proveedores.length : 0;
        const totalProductos = Array.isArray(proveedores) ? proveedores.reduce((sum, p) => sum + (p.total_productos || 0), 0) : 0;
        const promedioProductosPorProveedor = totalProveedores > 0 ? totalProductos / totalProveedores : 0;

        return {
            filteredProveedores,
            sortedProveedores,
            paginatedProveedores,
            totalPages: Math.ceil(sortedProveedores.length / pagination.itemsPerPage),
            estadisticasGenerales: {
                totalProveedores,
                totalProductos,
                promedioProductosPorProveedor: promedioProductosPorProveedor.toFixed(1)
            }
        };
    }, [proveedores, filters, pagination]);

    return {
        // Estado
        proveedores,
        loading,
        error,
        filters,
        pagination,
        
        // Datos computados
        ...computed,
        
        // Acciones
        loadProveedores,
        loadProveedorById,
        createNewProveedor,
        updateExistingProveedor,
        removeProveedor,
        searchProveedoresByTerm,
        loadProveedorProductos,
        loadProveedorEstadisticas,
        clearErrors,
        clearCurrentProveedorData,
        updateFilters,
        updatePagination,
        clearSearch
    };
};