import { NavLink } from "react-router-dom";

export const Dashboard = () => {
  return (
    <div className="w-3xs bg-neutral-600 text-white p-4 m-2 rounded-lg shadow-lg h-[97%] fixed">
      <ul className="mt-5 space-y-2">
        <li className="w-full">
          <NavLink
            to="/inventario"
            className={({ isActive }) => `block w-full p-3 rounded-xl cursor-pointer text-left ${ isActive ? 'bg-neutral-900' : 'hover:bg-neutral-900'}`}> Inventario</NavLink>
        </li> 
        <li className="w-full">
          <NavLink
            to="/facturacion"
            className={({ isActive }) => `block w-full p-3 rounded-xl cursor-pointer text-left ${ isActive ? 'bg-neutral-900' : 'hover:bg-neutral-900'}`}> Facturación</NavLink>
        </li>
        <li className="w-full"> 
          <NavLink
            to="/formulaciones"
            className={({ isActive }) => `block w-full p-3 rounded-xl cursor-pointer text-left ${ isActive ? 'bg-neutral-900' : 'hover:bg-neutral-900'}`}> Formulaciones</NavLink>
        </li>
        <li className="w-full">
          <NavLink
            to="/proveedores"
            className={({ isActive }) => `block w-full p-3 rounded-xl cursor-pointer text-left ${ isActive ? 'bg-neutral-900' : 'hover:bg-neutral-900'}`}> Proveedores</NavLink>
        </li>
        <li className="w-full">
          <NavLink
            to="/clientes"
            className={({ isActive }) => `block w-full p-3 rounded-xl cursor-pointer text-left ${ isActive ? 'bg-neutral-900' : 'hover:bg-neutral-900'}`}> Clientes</NavLink>
        </li> 
        <li className="w-full">
          <NavLink
            to="/movimientos"
            className={({ isActive }) => `block w-full p-3 rounded-xl cursor-pointer text-left ${ isActive ? 'bg-neutral-900' : 'hover:bg-neutral-900'}`}> Movimientos</NavLink>
        </li>
        <li className="w-full mt-30">
          <NavLink
            to="/salir"
            className="block w-full p-3 rounded-xl bg-red-500 hover:bg-red-900 cursor-pointer text-left">
            Salir</NavLink>
        </li>
      </ul>
    </div>
  );
};