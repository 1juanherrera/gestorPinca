import React, { useEffect, useState } from "react";
import { FaUserTag, FaPlus, FaSearch, FaEdit, FaTrash, FaBuilding, FaEnvelope, FaPhone } from "react-icons/fa";
import { useProveedores } from "../hooks/useProveedores";
import { ProveedorModal } from "../components/ProveedorModal";
import { ProveedorCard } from "../components/ProveedorCard";

export const Proveedores = () => {
    const {
        paginatedProveedores,
        loading,
        error,
        searchResults,
        searchLoading,
        filters,
        pagination,
        totalPages,
        estadisticasGenerales,
        loadProveedores,
        createNewProveedor,
        updateExistingProveedor,
        removeProveedor,
        searchProveedoresByTerm,
        updateFilters,
        updatePagination,
        clearErrors,
        clearSearch
    } = useProveedores();

    const [showModal, setShowModal] = useState(false);
    const [editingProveedor, setEditingProveedor] = useState(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [proveedorToDelete, setProveedorToDelete] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadProveedores();
    }, [loadProveedores]);

    // Manejar búsqueda
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        updateFilters({ searchTerm: value });
        
        if (value.trim().length >= 2) {
            searchProveedoresByTerm(value);
        } else {
            clearSearch();
        }
    };

    // Manejar crear proveedor
    const handleCreateProveedor = () => {
        setEditingProveedor(null);
        setShowModal(true);
    };

    // Manejar editar proveedor
    const handleEditProveedor = (proveedor) => {
        setEditingProveedor(proveedor);
        setShowModal(true);
    };

    // Manejar eliminar proveedor
    const handleDeleteProveedor = (proveedor) => {
        setProveedorToDelete(proveedor);
        setShowConfirmDialog(true);
    };

    // Confirmar eliminación
    const confirmDelete = async () => {
        if (proveedorToDelete) {
            const result = await removeProveedor(proveedorToDelete.id);
            if (result.success) {
                setShowConfirmDialog(false);
                setProveedorToDelete(null);
            }
        }
    };

    // Manejar envío del formulario
    const handleSubmitProveedor = async (proveedorData) => {
        let result;
        
        if (editingProveedor) {
            result = await updateExistingProveedor(editingProveedor.id, proveedorData);
        } else {
            result = await createNewProveedor(proveedorData);
        }

        if (result.success) {
            setShowModal(false);
            setEditingProveedor(null);
        }

        return result;
    };

    // Manejar ordenamiento
    const handleSort = (sortBy) => {
        const sortOrder = filters.sortBy === sortBy && filters.sortOrder === 'asc' ? 'desc' : 'asc';
        updateFilters({ sortBy, sortOrder });
    };

    // Datos a mostrar
    const displayProveedores = filters.searchTerm && searchResults.length > 0 ? searchResults : paginatedProveedores;

    console.log('🔍 VISTA - paginatedProveedores:', paginatedProveedores);
    console.log('🔍 VISTA - searchResults:', searchResults);
    console.log('🔍 VISTA - filters.searchTerm:', filters.searchTerm);
    console.log('🔍 VISTA - displayProveedores:', displayProveedores);

    return (
        <div className="ml-65 p-4 bg-gray-100 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FaUserTag className="text-blue-500" size={25} />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Gestión de Proveedores
                            </h1>
                            <p className="text-gray-600">
                                Administra la información de tus proveedores
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleCreateProveedor}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <FaPlus size={16} />
                        Nuevo Proveedor
                    </button>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Total Proveedores</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {estadisticasGenerales?.totalProveedores || 0}
                                </p>
                            </div>
                            <FaBuilding className="text-blue-500" size={24} />
                        </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Total Productos</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {estadisticasGenerales?.totalProductos || 0}
                                </p>
                            </div>
                            <FaUserTag className="text-green-500" size={24} />
                        </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Promedio Productos</p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {estadisticasGenerales?.promedioProductosPorProveedor || 0}
                                </p>
                            </div>
                            <FaSearch className="text-orange-500" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Controles */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                    {/* Búsqueda */}
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearch}
                                placeholder="Buscar por empresa, encargado, documento o email..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {searchLoading && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Controles de vista */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Vista:</span>
                        <div className="bg-gray-100 p-1 rounded-lg flex">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-3 py-1 rounded text-sm transition-colors ${
                                    viewMode === 'grid' 
                                        ? 'bg-white text-blue-600 shadow' 
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                Tarjetas
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-1 rounded text-sm transition-colors ${
                                    viewMode === 'list' 
                                        ? 'bg-white text-blue-600 shadow' 
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                Lista
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Manejo de errores */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
                    <span>{error}</span>
                    <button
                        onClick={clearErrors}
                        className="text-red-500 hover:text-red-700"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Contenido principal */}
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                    <span className="ml-2 text-gray-600">Cargando proveedores...</span>
                </div>
            ) : (
                <>
                    {displayProveedores.length === 0 ? (
                        <div className="bg-white p-8 rounded-lg shadow text-center">
                            <FaUserTag className="mx-auto text-gray-400 mb-4" size={48} />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No hay proveedores
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {filters.searchTerm 
                                    ? 'No se encontraron proveedores que coincidan con tu búsqueda.'
                                    : 'Comienza agregando tu primer proveedor.'
                                }
                            </p>
                            {!filters.searchTerm && (
                                <button
                                    onClick={handleCreateProveedor}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
                                >
                                    <FaPlus size={16} />
                                    Crear Primer Proveedor
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Vista de tarjetas */}
                            {viewMode === 'grid' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {displayProveedores.map((proveedor, index) => {
                                        console.log(`🔍 CARD ${index}:`, proveedor); // ← AGREGA ESTE LOG
                                        return (
                                            <ProveedorCard
                                                key={proveedor.id}
                                                proveedor={proveedor}
                                                onEdit={handleEditProveedor}
                                                onDelete={handleDeleteProveedor}
                                            />
                                        );
                                    })}
                                </div>
                            )}

                            {/* Vista de lista */}
                            {viewMode === 'list' && (
                                <div className="bg-white rounded-lg shadow overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th 
                                                        onClick={() => handleSort('nombre_empresa')}
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                    >
                                                        Empresa
                                                    </th>
                                                    <th 
                                                        onClick={() => handleSort('nombre_encargado')}
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                    >
                                                        Encargado
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Contacto
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Productos
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Acciones
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {displayProveedores.map((proveedor) => (
                                                    <tr key={proveedor.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {proveedor.nombre_empresa}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {proveedor.numero_documento}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {proveedor.nombre_encargado}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            <div className="flex flex-col gap-1">
                                                                {proveedor.telefono && (
                                                                    <div className="flex items-center gap-1">
                                                                        <FaPhone className="text-gray-400" size={12} />
                                                                        {proveedor.telefono}
                                                                    </div>
                                                                )}
                                                                {proveedor.email && (
                                                                    <div className="flex items-center gap-1">
                                                                        <FaEnvelope className="text-gray-400" size={12} />
                                                                        {proveedor.email}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                {proveedor.total_productos || 0} productos
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => handleEditProveedor(proveedor)}
                                                                    className="text-blue-600 hover:text-blue-900"
                                                                    title="Editar"
                                                                >
                                                                    <FaEdit size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteProveedor(proveedor)}
                                                                    className="text-red-600 hover:text-red-900"
                                                                    title="Eliminar"
                                                                >
                                                                    <FaTrash size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Paginación simple */}
                            {!filters.searchTerm && totalPages > 1 && (
                                <div className="mt-6 flex justify-center items-center gap-2">
                                    <button
                                        onClick={() => updatePagination({ currentPage: pagination.currentPage - 1 })}
                                        disabled={pagination.currentPage === 1}
                                        className="px-3 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Anterior
                                    </button>
                                    
                                    <span className="px-4 py-2 text-sm text-gray-600">
                                        Página {pagination.currentPage} de {totalPages}
                                    </span>
                                    
                                    <button
                                        onClick={() => updatePagination({ currentPage: pagination.currentPage + 1 })}
                                        disabled={pagination.currentPage === totalPages}
                                        className="px-3 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}

            {/* Modal de proveedor */}
            {showModal && (
                <ProveedorModal
                    proveedor={editingProveedor}
                    onSubmit={handleSubmitProveedor}
                    onClose={() => {
                        setShowModal(false);
                        setEditingProveedor(null);
                    }}
                />
            )}

            {/* Diálogo de confirmación simple */}
            {showConfirmDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Eliminar Proveedor
                        </h3>
                        <p className="text-gray-600 mb-4">
                            ¿Estás seguro de que deseas eliminar al proveedor "{proveedorToDelete?.nombre_empresa}"?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowConfirmDialog(false);
                                    setProveedorToDelete(null);
                                }}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};