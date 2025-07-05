// Función para formatear cantidades
const formatCantidad = (cantidad) => {
  const num = parseFloat(cantidad);
  
  if (isNaN(num)) return '0';
  if (num === 0) return '0';
  if (num % 1 === 0) return num.toString();
  
  return num.toFixed(2).replace(/\.?0+$/, '');
};

// Función para formatear costos (siempre con 2 decimales)
const formatMoneda = (costo) => {
  const num = parseFloat(costo);
  if (isNaN(num)) return '$0,00';
  return `$${num.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Función para formatear porcentajes
const formatPorcentaje = (porcentaje) => {
  const num = parseFloat(porcentaje);
  if (isNaN(num)) return '0%';
  return `${num.toFixed(1)}%`;
};

module.exports = {
  formatCantidad,
  formatMoneda,
  formatPorcentaje
};