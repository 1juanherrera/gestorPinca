import { Table } from "../components/Table"
import { useItems } from "../hooks/useItems";

export const Inventario = () => {
    const { handleItemMateria, handleProducto, item, productos, loading, error, filteredProducts } = useItems();

    return (
        <div className="ml-65 p-5">
            
            <div className="flex items-center justify-center mb-4 gap-6 mt-8">
                <button 
                    onClick={handleProducto} 
                    className={`
                        px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wide
                        transition-all duration-200 transform hover:scale-105 
                        shadow-lg hover:shadow-xl
                        ${item === 'PRODUCTO' 
                            ? 'bg-blue-700 text-white' 
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }
                    `}
                >
                    Productos
                </button>
                
                <button 
                    onClick={handleItemMateria} 
                    className={`
                        px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wide
                        transition-all duration-200 transform hover:scale-105
                        shadow-lg hover:shadow-xl
                        ${item === 'MATERIA PRIMA' 
                            ? 'bg-emerald-700 text-white' 
                            : 'bg-emerald-500 text-white hover:bg-emerald-600'
                        }
                    `}
                >
                    Materia Prima
                </button>
            </div>

            {/* Indicador visual del filtro activo */}
            <div className="mb-2 text-center">
                <span className="text-sm text-gray-600">
                    <span className={`ml-1 font-semibold ${
                        item === 'PRODUCTO' ? 'text-blue-600' : 'text-emerald-600'
                    }`}>
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