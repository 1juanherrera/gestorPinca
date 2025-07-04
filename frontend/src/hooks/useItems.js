import { useState } from 'react';
import { useApi } from './useApi';

export const useItems = () => {

    const [ item, setItem ] = useState('PRODUCTO');
    const [ searchTerm, setSearchTerm ] = useState('');

    const { data: productos, loading, error } = useApi('/items');

    const handleItemMateria = () => {
        setItem('MATERIA PRIMA')
    }
    const handleProducto = () => {
        setItem('PRODUCTO')
    }

    const handleInsumo = () => {
        setItem('INSUMO')
    }

    const handleSearch = (term) => {
        setSearchTerm(term);
    }

    const clearSearch = () => {
        setSearchTerm('');
    }

    const filteredProducts = productos?.filter(producto => {
        const matchesType = producto.tipo === item;
        const matchesSearch = searchTerm === '' || 
            producto.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesType && matchesSearch;
    }) || [];

    const lengthProducts = productos?.length || 0;

    const handleType = (producto) => {
        if (producto.tipo === 'PRODUCTO') {
            return 'bg-blue-100 text-blue-800 border border-blue-200';
        } else if (item === 'MATERIA PRIMA') {
            return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
        } else {
            return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
        }
    }

    return {
        productos,
        loading,
        error,
        item,
        filteredProducts,
        handleItemMateria,
        handleProducto,
        handleInsumo,
        lengthProducts,
        searchTerm,
        handleSearch,
        clearSearch,
        handleType
    }
}