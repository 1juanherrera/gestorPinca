// src/hooks/useInventario.js

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    setItemType,
    setSearchTerm,
    clearSearchTerm,
    fetchItems, // Importa el thunk actualizado
    createItem,
    updateItem,
} from '../features/inventario/inventarioSlice'; 

export const useInventario = () => {
    const dispatch = useDispatch();

    const {
        items, // Ahora 'items' contendrá TODOS los ítems de la API
        itemType, // Este valor se usa SOLO para filtrar en el frontend
        searchTerm,
        loading,
        error,
    } = useSelector((state) => state.inventario);

    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const filteredProducts = items?.filter(product => {
       const productTypeName = typeof product.tipo === 'string' ? product.tipo.toUpperCase() : '';
        const currentItemType = typeof itemType === 'string' ? itemType.toUpperCase() : '';

        const matchesType = productTypeName === currentItemType;

        const productNameLower = typeof product.nombre === 'string' ? product.nombre.toLowerCase() : '';
        const searchTermLower = searchTerm.toLowerCase();

        const matchesSearch = searchTermLower === '' || productNameLower.includes(searchTermLower);

        return matchesType && matchesSearch;
    }) || [];

    const lengthProducts = items?.length || 0; 

    // --- Lógica de carga de datos ---
    // ¡Ahora, fetchItems no recibe argumentos! Solo se dispara una vez o cuando dispatch cambia.
    // El filtrado por 'itemType' se hace DENTRO del hook con filteredProducts.
    useEffect(() => {
        const fetchInventoryItems = async () => {
            const resultAction = await dispatch(fetchItems()); // <-- ¡Sin argumentos aquí!
            if (fetchItems.fulfilled.match(resultAction)) {
                console.log('Items cargados en Redux (desde useInventario hook):', resultAction.payload);
            } else if (fetchItems.rejected.match(resultAction)) {
                console.error('Error al cargar items (desde useInventario hook):', resultAction.payload || resultAction.error.message);
            }
        };
        fetchInventoryItems();
    }, [dispatch]); // Dependencias: solo se ejecuta una vez al montar, o si dispatch cambia

    // --- Handlers de acciones de formulario ---
    const handleCreateItem = async (formData) => {
        // Dispatch el thunk createItem con los datos del formulario
        const resultAction = await dispatch(createItem(formData));
        
        // Verifica si la acción de crear fue exitosa
        if (createItem.fulfilled.match(resultAction)) {
            setShowForm(false); // Cierra el formulario
            // Opcional: limpiar editingItem si no hay uno activo
            setEditingItem(null); 
            
            // Re-fetch para actualizar la lista de ítems después de la creación
            // Asegúrate de llamar a fetchItems sin argumentos si así lo adaptaste
            dispatch(fetchItems()); 
            
            // Aquí podrías mostrar un mensaje de éxito al usuario
            console.log('Ítem creado y lista actualizada.');
        } else {
            // Si la acción de crear falló
            console.error('Error al crear ítem:', resultAction.payload || 'Error desconocido');
            // Aquí podrías mostrar un mensaje de error al usuario
        }
    };

    const handleEditItem = (item) => {
        setEditingItem(item);
        setShowForm(true);
    };

    const handleUpdateItem = async (formData) => {
        const resultAction = await dispatch(updateItem({ id: editingItem.id, formData }));
        if (updateItem.fulfilled.match(resultAction)) {
            setShowForm(false);
            setEditingItem(null);
            dispatch(fetchItems()); // Re-fetch para actualizar la lista (sin argumentos)
        } else {
            console.error('Error al actualizar ítem:', resultAction.payload || 'Error desconocido');
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingItem(null);
    };

    // --- Handlers para cambiar el tipo de ítem y término de búsqueda (despachando acciones) ---
    // Estos seguirán despachando el tipo para actualizar el estado 'itemType' para el filtro del frontend
    const handleProducto = () => dispatch(setItemType('PRODUCTO'));
    const handleItemMateria = () => dispatch(setItemType('MATERIA PRIMA'));
    const handleInsumo = () => dispatch(setItemType('INSUMO'));

    const handleSearch = (term) => dispatch(setSearchTerm(term));
    const clearSearch = () => dispatch(clearSearchTerm());

    // --- Función de utilidad para estilos basada en el tipo de producto ---
    const handleType = (producto) => {
        const type = producto.tipo?.toUpperCase(); // Asumiendo 'type' es la propiedad correcta
        if (type === 'PRODUCTO') {
            return 'bg-blue-100 text-blue-800 border border-blue-200';
        } else if (type === 'MATERIA PRIMA') {
            return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
        } else if (type === 'INSUMO') {
            return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
        }
        return 'bg-gray-100 text-gray-800 border border-gray-200'; 
    };

    // Retorna todo lo que la vista necesite
    return {
        items,
        itemType,
        searchTerm,
        loading,
        error,
        showForm,
        editingItem,
        filteredProducts, 
        lengthProducts,
        handleProducto,
        handleItemMateria,
        handleInsumo,
        handleSearch,
        clearSearch,
        handleCreateItem,
        handleEditItem,
        handleUpdateItem,
        handleCloseForm,
        handleType, 
        setShowForm,
    };
}