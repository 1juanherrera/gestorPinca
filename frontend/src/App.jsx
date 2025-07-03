import { Dashboard } from "./components/Dashboard"
import { Inventario } from "./pages/Inventario"
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

export const App = () => {

  return (
    <BrowserRouter>
      <Dashboard />
      <Routes>
        <Route path="/inventario" element={<Inventario />} />
      </Routes>
    </BrowserRouter>
  )
}