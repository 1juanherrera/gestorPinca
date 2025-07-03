import { useState } from 'react';
import { useApi } from './useApi';

export const useItems = () => {

    const [ item, setItem ] = useState('PRODUCTO');

    const { data: productos, loading, error } = useApi('/items');

    const handleItemMateria = () => {
        setItem('MATERIA PRIMA')
    }
    const handleProducto = () => {
        setItem('PRODUCTO')
    }

    const filteredProducts = productos?.filter(producto => producto.tipo === item) || [];

    return {
        productos,
        loading,
        error,
        item,
        filteredProducts,
        handleItemMateria,
        handleProducto
    }
}