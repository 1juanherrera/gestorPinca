import { Squares } from "../components/squares";
import { Table } from "../components/Table"
import { useItems } from "../hooks/useItems";

export const Inventario = () => {
    const { handleItemMateria, handleProducto, item, productos, loading, error, filteredProducts } = useItems();

    return (
        <div className="ml-65 p-5">
            
            <div className="flex items-center justify-center mb-4 gap-6 mt-2">
                <button 
                    onClick={handleProducto} 
                    className={`
                        px-4 py-2 rounded-lg font-semibold text-xs uppercase tracking-wide
                        transition-all duration-200 transform hover:scale-105 
                        shadow-lg hover:shadow-xl cursor-pointer
                        ${item === 'PRODUCTO' 
                            ? 'bg-blue-700 text-white' 
                            : 'bg-gray-500 text-white hover:bg-blue-600'
                        }
                    `}
                >
                    Productos
                </button>
                
                <button 
                    onClick={handleItemMateria} 
                    className={`
                        px-4 py-2 rounded-lg font-semibold text-xs uppercase tracking-wide
                        transition-all duration-200 transform hover:scale-105
                        shadow-lg hover:shadow-xl cursor-pointer
                        ${item === 'MATERIA PRIMA' 
                            ? 'bg-blue-700 text-white' 
                            : 'bg-gray-500 text-white hover:bg-blue-600'
                        }
                    `}>
                    Materia Prima
                </button>
                <button 
                    onClick={handleItemMateria} 
                    className={`
                        px-4 py-2 rounded-lg font-semibold text-xs uppercase tracking-wide
                        transition-all duration-200 transform hover:scale-105
                        shadow-lg hover:shadow-xl cursor-pointer
                        ${item === 'MATERIA PRIMA' 
                            ? 'bg-blue-700 text-white' 
                            : 'bg-gray-500 text-white hover:bg-blue-600'
                        }
                    `}>
                    Agregar Materia Prima
                </button> 
            </div>
            <Squares productos={productos} />

            <div className="mb-2 mt-2 text-center">
                <span className="text-sm text-gray-600">
                    <span className="ml-1 font-semibold text-blue-600">
                        {item === 'PRODUCTO' ? 'PRODUCTOS' : 'MATERIA PRIMA'}
                    </span>
                </span>
            </div>

            <Table 
                productos={productos}
                loading={loading}
                error={error}
                filteredProducts={filteredProducts}
            />
        </div>
    )
}