import { FaTrash, FaEdit   } from "react-icons/fa";

export const Table = ({ productos, loading, error, filteredProducts }) => {

    if (loading) return <p>Cargando productos...</p>;
    if (error) return <p>Error al cargar productos: {error}</p>;
    if (!productos || productos.length === 0) return <p>No se encontraron productos.</p>;

    return (
        <div className="max-h-100 overflow-y-auto rounded-lg text-xs">
            <table className="w-full bg-neutral-300 table-auto border-0">
                <thead className="sticky top-0 bg-neutral-200 text-neutral-800">
                    <tr>
                        <th className="border  border-neutral-100 text-sm px-4 py-2 text-left whitespace-nowrap w-120">NOMBRE</th>
                        <th className="border border-neutral-100 text-sm px-4 py-2 text-center whitespace-nowrap w-60">TIPO</th>
                        <th className="border border-neutral-100 text-sm px-4 py-2 text-center whitespace-nowrap w-40">CANTIDAD</th>
                        <th className="border border-neutral-100 text-sm px-4 py-2 text-center whitespace-nowrap w-32">ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map(producto => (
                        <tr key={producto.id} className="hover:bg-neutral-400">
                            <td className="border border-neutral-100 px-2 py-1 whitespace-nowrap">{producto.nombre}</td>
                            <td className="border border-neutral-100 px-2 py-1 whitespace-nowrap w-24 text-center">{producto.tipo}</td>
                            <td className="border border-neutral-100 px-2 py-1 whitespace-nowrap w-20 text-center">{producto.cantidad}</td>
                            <td className="border border-neutral-100 px-2 py-1 whitespace-nowrap w-32">
                                <div className="flex gap-1 justify-center">
                                    <button className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600 cursor-pointer">
                                        <FaEdit  />
                                    </button>
                                    <button className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-800 cursor-pointer">
                                        <FaTrash />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};