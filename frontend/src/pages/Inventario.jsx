import { Table } from "../components/Table";
import { useItems } from "../hooks/useItems";
import { MdAddCircleOutline } from "react-icons/md";
import { AiFillProduct } from "react-icons/ai";
import { LuAtom } from "react-icons/lu";
import { SearchBar } from "../components/SearchBar";

export const Inventario = () => {
    const { 
        handleItemMateria, 
        handleProducto, 
        item, 
        productos, 
        loading, 
        error, 
        filteredProducts, 
        lengthProducts,
        searchTerm,
        handleSearch,
        clearSearch
     } = useItems();

    // Función para manejar el botón de añadir (placeholder)
    const handleAdd = () => {
        console.log(`Añadir ${item === 'PRODUCTO' ? 'Producto' : 'Materia Prima'}`);
        // Aquí irá la lógica para abrir modal o navegar a formulario
    };

    return (
        <div className="ml-65 p-6 bg-gray-100 min-h-screen">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Gestión de Inventario
                </h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    
                    {/* Botones de filtro */}
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleProducto} 
                            className={`
                                px-4 py-2 rounded-lg font-medium text-sm uppercase tracking-wide
                                transition-all duration-200 transform hover:scale-105 
                                shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2
                                ${item === 'PRODUCTO' 
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
                                ${item === 'MATERIA PRIMA' 
                                    ? 'bg-emerald-600 text-white shadow-emerald-500/30' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'
                                }
                            `}
                        >
                            <LuAtom size={16} />
                            Materia Prima
                        </button>
                    </div>

                    {/* Botón de añadir */}
                    <button 
                        onClick={handleAdd}
                        className="
                            px-6 py-2 rounded-lg font-medium text-sm uppercase tracking-wide
                            transition-all duration-200 transform hover:scale-105
                            shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2
                            bg-emerald-600 text-white hover:bg-emerald-700
                        "
                    >
                        <MdAddCircleOutline size={18}/>
                        Añadir {item === 'PRODUCTO' ? 'Producto' : 'Materia Prima'}
                    </button>
                </div>
            </div>

            {/* Indicador del filtro activo y tabla */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                
                {/* Header de la tabla */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-gray-800 uppercase">
                                {item === 'PRODUCTO' ? 'Productos' : 'Materia Prima'}
                            </h3>
                            <span className={`
                                px-3 py-1 text-xs font-medium rounded-full
                                ${item === 'PRODUCTO' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-emerald-100 text-emerald-800'
                                }
                            `}>
                                {filteredProducts.length} elemento{filteredProducts.length !== 1 ? 's' : ''}
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
                                    placeholder={`Buscar ${item === 'PRODUCTO' ? 'productos' : 'materia prima'}...`}
                                />
                            </div>
                        </div>
                </div>

                {/* Tabla */}
                <div className="p-6">
                    <Table 
                        productos={productos}
                        loading={loading}
                        error={error}
                        filteredProducts={filteredProducts}
                    />
                </div>
            </div>

            {/* Estados vacíos mejorados */}
            {!loading && !error && filteredProducts.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center mt-6 flex flex-col items-center">
                    <div className="text-gray-400 mb-4">
                        {item === 'PRODUCTO' ? <AiFillProduct size={48} /> : <LuAtom size={48} />}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No hay {item === 'PRODUCTO' ? 'productos' : 'materia prima'} disponibles
                    </h3>
                    <button 
                        onClick={handleAdd}
                        className="bg-emerald-600 text-white px-6 py-2 rounded-lg mt-2 hover:bg-emerald-700 transition-colors flex items-center gap-2"
                    >
                        <MdAddCircleOutline size={20}/>
                        Añadir {item === 'PRODUCTO' ? 'Producto' : 'Materia Prima'}
                    </button>
                </div>
            )}
        </div>
    );
};