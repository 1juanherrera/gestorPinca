import { Sidebar } from "./components/Sidebar"
import { Clientes } from "./pages/Clientes";
import { Formulaciones } from "./pages/Formulaciones";
import { Inventario } from "./pages/Inventario"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useStateOptimization } from "./hooks/useStateOptimization";

export const App = () => {
  // Usar optimización automática del estado
  useStateOptimization();

  return (
    <BrowserRouter>
      <Sidebar />
      <Routes>
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/formulaciones" element={<Formulaciones />} />
        <Route path="/clientes" element={<Clientes />} />
      </Routes>
    </BrowserRouter>
  )
}