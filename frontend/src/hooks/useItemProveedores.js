// frontend/src/hooks/useItemProveedores.js
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
     fetchItemsProveedor,
     fetchItemProveedorById,
     createItemProveedor,
     updateItemProveedor,
     deleteItemProveedor,
     fetchItemsByProveedor, // ✅ Correcto
     searchItemsProveedor,
     clearError,
     clearCurrentItemProveedor,
     setFilters,
     setPagination,
     clearSearchResults,
} from '../features/itemProveedor/itemProveedorSlice';

export const useItemProveedores = () => {
    const dispatch = useDispatch();
    
    const itemProveedoresState = useSelector(state => {
        console.log('🔍 Estado item-proveedores:', state.itemProveedores);
        return state.itemProveedores;
    });

    // Extraer datos del estado
    const itemProveedores = useMemo(
        () =>
            Array.isArray(itemProveedoresState?.items?.data)
                ? itemProveedoresState.items.data.map(item => ({
                    ...item,
                    // Usa los nombres que realmente llegan del backend:
                    nombre_item: item.nombre_item ?? '',
                    codigo_item: item.codigo_item ?? '',
                    nombre_proveedor: item.nombre_proveedor ?? '',
                    nombre_encargado: item.nombre_encargado ?? '',
                    descripcion: item.descripcion ?? '',
                    precio_unitario: item.precio_unitario ?? 0,
                    precio_con_iva: item.precio_con_iva ?? 0,   
                    disponible: item.disponible ?? 1,
                    cantidad: item.cantidad ?? 0,
                    proveedor_id: item.proveedor_id ?? null,    
                }))
                : [],
        [itemProveedoresState?.items]
    );
    const currentItemProveedor = itemProveedoresState?.currentItemProveedor || null;
    const itemProveedorProductos = itemProveedoresState?.itemProveedorProductos || [];
    const loading = itemProveedoresState?.loading || false;
    const error = itemProveedoresState?.error || null;
    const searchResults = itemProveedoresState?.searchResults || [];
    const searchLoading = itemProveedoresState?.searchLoading || false;
    const searchError = itemProveedoresState?.searchError || null;
    const filters = useMemo(() => (
        itemProveedoresState?.filters || {
            searchTerm: '',
            sortBy: 'nombre_item',
            sortOrder: 'asc',
            proveedorId: null
        }
    ), [itemProveedoresState?.filters]);
    const pagination = useMemo(() => (
        itemProveedoresState?.pagination || {
            currentPage: 1,
            itemsPerPage: 10,
            totalItems: 0
        }
    ), [itemProveedoresState?.pagination]);

    // Datos computados (filtrado, ordenamiento, paginación)
    const computed = useMemo(() => {
        console.log('🧮 COMPUTED: item-proveedores de entrada:', itemProveedores);
        
        // Filtrar por proveedor si está especificado
        let filteredItems = Array.isArray(itemProveedores) ? itemProveedores.filter(item => {
            if (filters.proveedorId && item.proveedor_id !== filters.proveedorId) {
                return false;
            }
            
            if (!filters.searchTerm) return true;
            
            const searchTerm = filters.searchTerm.toLowerCase();
            return (
                item.nombre_item?.toLowerCase().includes(searchTerm) ||
                item.descripcion?.toLowerCase().includes(searchTerm) ||
                item.codigo_item?.toLowerCase().includes(searchTerm) ||
                item.nombre_proveedor?.toLowerCase().includes(searchTerm)
            );
        }) : [];

        // Ordenar
        const sortedItems = [...filteredItems].sort((a, b) => {
            const aValue = a[filters.sortBy] || '';
            const bValue = b[filters.sortBy] || '';
            
            if (filters.sortOrder === 'asc') {
                return aValue.toString().localeCompare(bValue.toString());
            } else {
                return bValue.toString().localeCompare(aValue.toString());
            }
        });

        // Paginar
        const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
        const endIndex = startIndex + pagination.itemsPerPage;
        const paginatedItems = sortedItems.slice(startIndex, endIndex);

        // Estadísticas
        const totalItems = filteredItems.length;
        const totalValue = filteredItems.reduce((sum, item) => sum + (item.precio * item.cantidad || 0), 0);
        const avgPrice = totalItems > 0 ? totalValue / totalItems : 0;

        console.log('🧮 COMPUTED: paginatedItems FINAL:', paginatedItems);

        return {
            filteredItems,
            sortedItems,
            paginatedItems,
            totalPages: Math.ceil(sortedItems.length / pagination.itemsPerPage),
            estadisticas: {
                totalItems,
                totalValue,
                avgPrice: avgPrice.toFixed(2)
            }
        };
    }, [itemProveedores, filters, pagination]);

    // Acciones
    const loadItemProveedores = useCallback(async () => {
        console.log('🔄 Cargando item-proveedores');
        try {
            const result = await dispatch(fetchItemsProveedor()).unwrap();
            return { success: true, data: result };
        } catch (error) {
            console.error('❌ Error cargando item-proveedores:', error);
            return { success: false, error: error.message || 'Error al cargar item-proveedores' };
        }
    }, [dispatch]);

    const loadItemProveedorById = useCallback(async (id) => {
        try {
            const result = await dispatch(fetchItemProveedorById(id)).unwrap();
            return { success: true, data: result };
        } catch (error) {
            console.error('❌ Error cargando item-proveedor:', error);
            return { success: false, error: error.message || 'Error al cargar item-proveedor' };
        }
    }, [dispatch]);

    const createNewItemProveedor = useCallback(async (itemProveedorData) => {
        try {
            const result = await dispatch(createItemProveedor(itemProveedorData)).unwrap();
            return { success: true, data: result };
        } catch (error) {
            console.error('❌ Error creando item-proveedor:', error);
            return { success: false, error: error.message || 'Error al crear item-proveedor' };
        }
    }, [dispatch]);

    const updateExistingItemProveedor = useCallback(async (id, itemProveedorData) => {
        try {
            const result = await dispatch(updateItemProveedor({ id, itemProveedorData })).unwrap();
            return { success: true, data: result };
        } catch (error) {
            console.error('❌ Error actualizando item-proveedor:', error);
            return { success: false, error: error.message || 'Error al actualizar item-proveedor' };
        }
    }, [dispatch]);

    const removeItemProveedor = useCallback(async (id) => {
        try {
            await dispatch(deleteItemProveedor(id)).unwrap();
            return { success: true };
        } catch (error) {
            console.error('❌ Error eliminando item-proveedor:', error);
            return { success: false, error: error.message || 'Error al eliminar item-proveedor' };
        }
    }, [dispatch]);

    const loadItemsByProveedor = useCallback(async (proveedorId) => {
        try {
            const result = await dispatch(fetchItemsByProveedor(proveedorId)).unwrap();
            return { success: true, data: result };
        } catch (error) {
            console.error('❌ Error cargando items del proveedor:', error);
            return { success: false, error: error.message || 'Error al cargar items del proveedor' };
        }
    }, [dispatch]);

    const searchItemProveedoresByTerm = useCallback(async (searchTerm) => {
        if (!searchTerm.trim()) {
            dispatch(clearSearchResults());
            return { success: true, data: [] };
        }

        try {
            const result = await dispatch(searchItemsProveedor(searchTerm)).unwrap();
            return { success: true, data: result };
        } catch (error) {
            console.error('❌ Error buscando item-proveedores:', error);
            return { success: false, error: error.message || 'Error en la búsqueda' };
        }
    }, [dispatch]);

    // Acciones simples
    const clearErrors = useCallback(() => dispatch(clearError()), [dispatch]);
    const clearCurrentItemProveedorData = useCallback(() => dispatch(clearCurrentItemProveedor()), [dispatch]);
    const updateFilters = useCallback((newFilters) => dispatch(setFilters(newFilters)), [dispatch]);
    const updatePagination = useCallback((newPagination) => dispatch(setPagination(newPagination)), [dispatch]);
    const clearSearch = useCallback(() => dispatch(clearSearchResults()), [dispatch]);

    return {
        // Estado
        itemProveedores,
        currentItemProveedor,
        itemProveedorProductos,
        loading,
        error,
        searchResults,
        searchLoading,
        searchError,
        filters,
        pagination,
        
        // Datos computados
        ...computed,
        
        // Acciones
        loadItemProveedores,
        loadItemProveedorById,
        createNewItemProveedor,
        updateExistingItemProveedor,
        removeItemProveedor,
        loadItemsByProveedor,
        searchItemProveedoresByTerm,
        clearErrors,
        clearCurrentItemProveedorData,
        updateFilters,
        updatePagination,
        clearSearch
    };
};