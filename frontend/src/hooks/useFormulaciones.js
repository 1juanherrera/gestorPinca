import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchFormulaciones,
  selectFormulaciones,
  selectFormulacionesLoading,
  selectFormulacionesError,
  selectProductosConFormulaciones,
  selectEstadisticasPorTipo, 
} from '../features/formulaciones/formulacionesSlice';

export const useFormulaciones = () => {
  const dispatch = useDispatch();
  
  // Estado de Redux
  const allFormulaciones = useSelector(selectFormulaciones);
  const loading = useSelector(selectFormulacionesLoading);
  const error = useSelector(selectFormulacionesError);
  const productos = useSelector(selectProductosConFormulaciones);
  const estadisticas = useSelector(selectEstadisticasPorTipo);
  
  // Estado local para la selección
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedProductData, setSelectedProductData] = useState(null);
  const [formulaciones, setFormulaciones] = useState([]);
  const [totalCantidad, setTotalCantidad] = useState(0);
  const [totalCosto, setTotalCosto] = useState(0);

  // Cargar formulaciones al montar el componente
  useEffect(() => {
    dispatch(fetchFormulaciones());
  }, [dispatch]);

  // Función para manejar selección de producto
  const handleProductSelect = (productId) => {
    setSelectedProduct(productId);
    
    if (productId) {
      const product = productos.find(p => p.id === parseInt(productId));
      
      if (product) {
        setSelectedProductData(product);
        setFormulaciones(product.formulaciones || []);
        
        // Calcular totales
        const totalCant = (product.formulaciones || []).reduce((sum, form) => {
          return sum + (parseFloat(form.cantidad) || 0);
        }, 0);
        
        const totalCost = (product.formulaciones || []).reduce((sum, form) => {
          return sum + (parseFloat(form.costo_total_materia) || 0);
        }, 0);
        
        setTotalCantidad(totalCant);
        setTotalCosto(totalCost);
      }
    } else {
      setSelectedProductData(null);
      setFormulaciones([]);
      setTotalCantidad(0);
      setTotalCosto(0);
    }
  };

  const handleClearSelection = () => {
    setSelectedProduct('');
    setSelectedProductData(null);
    setFormulaciones([]);
    setTotalCantidad(0);
    setTotalCosto(0);
  };

  const refreshData = () => {
    dispatch(fetchFormulaciones());
  };

  return {
    // Datos
    productos,
    selectedProduct,
    selectedProductData,
    formulaciones,
    allFormulaciones,
    estadisticas,
    
    // Estados
    loading,
    error,
    
    // Totales calculados
    totalCantidad,
    totalCosto,
    
    // Funciones
    handleProductSelect,
    handleClearSelection,
    refreshData,
  };
};