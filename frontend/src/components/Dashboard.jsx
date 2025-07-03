

export const Dashboard = () => {
  return (
    <div className="w-3xs bg-neutral-600 text-white p-4 m-2 rounded-lg shadow-lg h-170 fixed">
      <ul className="mt-5 space-y-2">
        <li className="p-3 mt-5 rounded-xl hover:bg-neutral-900 cursor-pointer">Inventario</li>
        <li className="p-3 mt-5 rounded-xl hover:bg-neutral-900 cursor-pointer">Facturación</li>
        <li className="p-3 mt-5 rounded-xl hover:bg-neutral-900 cursor-pointer">Formulaciones</li>
        <li className="p-3 mt-5 rounded-xl hover:bg-neutral-900 cursor-pointer">Proveedores</li>
        <li className="p-3 mt-5 rounded-xl hover:bg-neutral-900 cursor-pointer">Clientes</li>
        <li className="p-3 mt-5 rounded-xl hover:bg-neutral-900 cursor-pointer">Movimientos</li>
        <li className="p-3 mt-30 rounded-xl bg-red-500 hover:bg-red-900 cursor-pointer">Salir</li>
      </ul>
    </div>
  )
}