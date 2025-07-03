
export const Squares = ({ productos = [] }) => {

    const productosValidos = Array.isArray(productos) ? productos : [];

    return (
        <div className="flex justify-center gap-20">
                <div className="w-40 h-16 rounded-lg flex flex-col items-center justify-center shadow-lg/20 cursor-pointer">
                    <p className="text-black text-center text-xs">TOTAL PRODUCTOS</p>
                    <p className="text-blue-700 font-bold text-md">
                        {productosValidos.filter(producto => producto.tipo === 'PRODUCTO').length}
                        </p>
                </div>
                <div className="w-40 h-16 border-red-700 rounded-lg flex flex-col items-center shadow-lg/20 cursor-pointer justify-center">
                    
                    <p className="text-red-700 font-bold text-md">
                        {productosValidos.filter(producto => producto.tipo === 'MATERIA PRIMA').length}
                        </p>
                    <p className="text-black text-center text-xs">TOTAL MATERIA PRIMA</p>
                </div>
                <div className="w-40 h-16 rounded-lg flex flex-col items-center justify-center shadow-lg/20 cursor-pointer">
                    <p className="text-black text-center text-xs">TOTAL EN INVENTARIO</p>
                    <p className="text-green-700 font-bold text-md">
                        {productosValidos.length}
                    </p>
                </div>
        </div> 
    )
}