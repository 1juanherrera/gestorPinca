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

    return {
        productos,
        loading,
        error,
        item,
        filteredProducts,
        handleItemMateria,
        handleProducto,
        lengthProducts,
        searchTerm,
        handleSearch,
        clearSearch
    }
}