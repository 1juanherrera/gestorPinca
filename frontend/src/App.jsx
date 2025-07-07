import { Sidebar } from "./components/Sidebar"
import { Formulaciones } from "./pages/Formulaciones";
import { Inventario } from "./pages/Inventario"
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

export const App = () => {

  return (
    <BrowserRouter>
      <Sidebar />
      <Routes>
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/formulaciones" element={<Formulaciones />} />
      </Routes>
    </BrowserRouter>
  )
}