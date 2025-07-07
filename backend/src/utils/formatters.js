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
  return `$ ${num.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Función para formatear porcentajes
const formatPorcentaje = (porcentaje) => {
  const num = parseFloat(porcentaje);
  if (isNaN(num)) return '0%';
  return `${num.toFixed(1)}%`;
};

// AGREGADO: Función para formatear volumen
const formatVolumen = (volumen, unidad = '') => {
  const num = parseFloat(volumen);
  
  if (isNaN(num)) return '0';
  if (num === 0) return '0';
  if (num % 1 === 0) return unidad ? `${num} ${unidad}` : num.toString();
  
  const formatted = num.toFixed(2).replace(/\.?0+$/, '');
  return unidad ? `${formatted} ${unidad}` : formatted;
};

// AGREGADO: Función para formatear factor de escala
const formatFactor = (factor) => {
  const num = parseFloat(factor);
  if (isNaN(num)) return '1.0000';
  return num.toFixed(4);
};

module.exports = {
  formatCantidad,
  formatMoneda,
  formatPorcentaje,
  formatVolumen,
  formatFactor
};