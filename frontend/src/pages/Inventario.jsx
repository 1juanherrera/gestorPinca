import { Table } from "../components/Table"; 
import { ItemForm } from "../components/ItemForm"; 
import { SearchBar } from "../components/SearchBar";
import { useInventario } from "../hooks/useInventario";
import { MdAddCircleOutline } from "react-icons/md";
import { AiFillProduct, AiFillAppstore } from "react-icons/ai";
import { LuAtom } from "react-icons/lu";
import { FaBoxOpen } from "react-icons/fa";

export const Inventario = () => {
    // Usa el custom hook para obtener toda la lógica y el estado
    const {
        itemType,
        searchTerm,
        loading,
        error,
        showForm,
        editingItem,
        // Datos derivados y funciones
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
        handleDeleteItem
    } = useInventario();

    return (
        <div className="ml-65 p-4 bg-gray-100 min-h-screen">
            <div className="mb-4 flex items-center gap-2">
                    <FaBoxOpen className="text-blue-500" size={25} />
                <div>
                    <h5 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
                        Gestión de Inventario
                    </h5>                       
                </div>
            </div> 

            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4">

                    {/* Botones de filtro por tipo de ítem */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleProducto}
                            className={`
                                px-4 py-2 rounded-lg font-medium text-sm uppercase tracking-wide
                                transition-all duration-200 transform hover:scale-105
                                shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2
                                ${itemType === 'PRODUCTO'
                                    ? 'bg-blue-600 text-white shadow-blue-500/30'
                                    : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                }
                            `}
                        >
                            <AiFillProduct size={16} />
                            Productos
                        </button>

                        <button
                            onClick={handleItemMateria}
                            className={`
                                px-4 py-2 rounded-lg font-medium text-sm uppercase tracking-wide
                                transition-all duration-200 transform hover:scale-105
                                shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2
                                ${itemType === 'MATERIA PRIMA'
                                    ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                                    : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'
                                }
                            `}
                        >
                            <LuAtom size={16} />
                            Materia Prima
                        </button>

                        <button
                            onClick={handleInsumo}
                            className={`
                                px-4 py-2 rounded-lg font-medium text-sm uppercase tracking-wide
                                transition-all duration-200 transform hover:scale-105
                                shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2
                                ${itemType === 'INSUMO'
                                    ? 'bg-yellow-500 text-white shadow-yellow-500/30'
                                    : 'bg-gray-100 text-gray-700 hover:bg-yellow-50 hover:text-yellow-600'
                                }
                            `}
                        >
                            <AiFillAppstore size={16} />
                            Insumos
                        </button>
                    </div>

                    {/* Botón de añadir nuevo ítem */}
                    <button
                        onClick={() => setShowForm(true)}
                        className="
                            px-6 py-2 rounded-lg font-medium text-sm uppercase tracking-wide
                            transition-all duration-200 transform hover:scale-105
                            shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2
                            bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                        <MdAddCircleOutline size={18} />
                        Añadir {
                            itemType === 'PRODUCTO'
                                ? 'productos'
                                : itemType === 'MATERIA PRIMA'
                                    ? 'materia prima'
                                    : 'insumos'}
                    </button>
                </div>
            </div>

            {/* Sección de la tabla y búsqueda */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">

                {/* Encabezado de la tabla con filtros y búsqueda */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-gray-800 uppercase">
                                {itemType === 'PRODUCTO'
                                    ? 'productos'
                                    : itemType === 'MATERIA PRIMA'
                                        ? 'materia prima'
                                        : 'insumos'}
                            </h3>
                            <span className={`
                                px-3 py-1 text-xs font-medium rounded-full
                                ${itemType === 'PRODUCTO'
                                    ? 'bg-blue-100 text-blue-800'
                                    : itemType === 'MATERIA PRIMA'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }
                            `}>
                                {filteredProducts.length} Elemento{filteredProducts.length !== 1 ? 's' : ''}
                            </span>
                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                                {lengthProducts} Elementos totales
                            </span>
                        </div>
                        <div className="w-80">
                            <SearchBar
                                onSearch={handleSearch}
                                searchTerm={searchTerm}
                                onClear={clearSearch}
                                placeholder={`Buscar ${
                                    itemType === 'PRODUCTO'
                                        ? 'productos'
                                        : itemType === 'MATERIA PRIMA'
                                            ? 'materia prima'
                                            : 'insumos'}...
                                `}
                            />
                        </div>
                    </div>
                </div>

                {/* Contenido de la tabla */}
                <div className="p-6">
                    {loading ? (
                        <p className="text-center text-gray-600">Cargando ítems...</p>
                    ) : error ? (
                        <p className="text-red-600 text-center">Error: {error}</p>
                    ) : (
                        <Table
                            // Se asume que Table solo necesita filteredProducts, onEdit y handleType
                            productos={filteredProducts} 
                            handleType={handleType}
                            onEdit={handleEditItem}
                            onDelete={handleDeleteItem}
                        />
                    )}
                </div>
            </div>

            {/* Mensaje para estados vacíos mejorados */}
            {!loading && !error && filteredProducts.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center mt-6 flex flex-col items-center">
                    <div className="text-gray-400 mb-4">
                        {itemType === 'PRODUCTO' ? <AiFillProduct size={48} /> : <LuAtom size={48} />}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No hay {itemType === 'PRODUCTO'
                            ? 'productos'
                            :
                            itemType === 'MATERIA PRIMA'
                                ? 'materias primas'
                                : 'insumos'} disponibles
                    </h3>
                    <button
                        className="bg-emerald-600 text-white px-6 py-2 rounded-lg mt-2 hover:bg-emerald-700 transition-colors flex items-center gap-2"
                        onClick={() => setShowForm(true)}
                    >
                        <MdAddCircleOutline size={20} />
                        Añadir {itemType === 'PRODUCTO'
                            ? 'productos'
                            :
                            itemType === 'MATERIA PRIMA'
                                ? 'materias primas'
                                : 'insumos'}
                    </button>
                </div>
            )}

            {/* Formulario Modal para crear/editar ítems */}
            {showForm && (
                <ItemForm
                    onSubmit={editingItem ? handleUpdateItem : handleCreateItem}
                    onCancel={handleCloseForm}
                    initialData={editingItem}
                    isEditing={!!editingItem}
                />
            )}
        </div>
    );
};