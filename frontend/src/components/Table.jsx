import { FaTrash, FaEdit } from "react-icons/fa";

export const Table = ({ productos, loading, error, handleType, onEdit }) => {

    if (loading) return (
        <div className="flex justify-center items-center p-8">
            <p className="text-gray-600 text-xs">Cargando productos...</p>
        </div>
    );
    
    if (error) return (
        <div className="flex justify-center items-center p-8">
            <p className="text-red-600 text-xs">Error al cargar productos: {error}</p>
        </div>
    );

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200">
            <div className="max-h-[50vh] overflow-y-auto">
                <table className="w-full">
                    <thead className="sticky top-0 bg-gray-700 text-white uppercase">
                        <tr>
                            <th className="px-4 py-2 text-center text-xs font-medium w-15">ID</th>
                            <th className="px-4 py-2 text-center text-xs font-medium w-25">Codigo</th>
                            <th className="px-4 py-2 text-left text-xs font-medium">Nombre</th>
                            <th className="px-4 py-2 text-center text-xs font-medium w-42">Tipo</th>
                            <th className="px-4 py-2 text-center text-xs font-medium w-24">Cantidad</th>
                            <th className="px-4 py-2 text-center text-xs font-medium w-30">Costo Unit.</th>
                            <th className="px-4 py-2 text-center text-xs font-medium w-32">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-100">
                        {productos.map((producto, index) => (
                            <tr 
                                key={producto.id} 
                                className={`border-b border-gray-300 hover:bg-gray-200 transition-colors ${
                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                }`}
                            >
                                <td className="px-2 text-center ">
                                    <span className="text-xs font-medium text-gray-900">
                                        {producto.id}
                                    </span>
                                </td>
                                <td className="px-2 text-center ">
                                    <span className="text-xs  font-medium text-gray-900">
                                        {producto.codigo}
                                    </span>
                                </td>
                                <td className="px-2">
                                    <span className="text-xs font-medium text-gray-900">
                                        {producto.nombre}
                                    </span>
                                </td>
                                <td className="px-2 text-center">
                                    <span className={`px-3 py-1 text-xs font-medium rounded-md ${handleType(producto)}`}>
                                        {producto.tipo}
                                    </span>
                                </td>
                                <td className="px-2 text-center">
                                    <span className="text-xs font-semibold text-gray-900">
                                        {producto.cantidad}
                                    </span>
                                </td>
                                <td className="px-2 text-left">
                                        <span className="text-xs font-semibold text-emerald-800 pl-6">
                                            {producto.costo_unitario}
                                        </span>

                                </td>
                                <td className="px-2 py-1">
                                    <div className="flex justify-center gap-2">
                                        <button 
                                            onClick={() => onEdit && onEdit(producto)}
                                            className="p-2 text-white rounded-md transition-colors bg-gray-500 hover:bg-gray-800 cursor-pointer"
                                            title="Editar"
                                        >
                                            <FaEdit size={14} />
                                        </button>
                                        <button 
                                            onClick={() => console.log('Delete:', producto)}
                                            className="p-2 bg-red-500 text-white hover:bg-red-800 rounded-md transition-colors cursor-pointer"
                                            title="Eliminar"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}