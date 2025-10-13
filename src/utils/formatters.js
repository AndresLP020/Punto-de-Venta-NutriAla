/**
 * Utilidades para formatear valores en la aplicación Nutri-Ala
 */

/**
 * Formatea un valor numérico como moneda mexicana con exactamente 2 decimales
 * @param {number} value - El valor numérico a formatear
 * @returns {string} - El valor formateado como $X,XXX.XX
 */
export const formatCurrency = (value) => {
  if (typeof value !== 'number' || isNaN(value)) {
    return '$0.00';
  }
  
  return value.toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

/**
 * Formatea un porcentaje con 1 decimal
 * @param {number} value - El valor numérico a formatear como porcentaje
 * @returns {string} - El valor formateado como XX.X%
 */
export const formatPercentage = (value) => {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0.0%';
  }
  
  return `${value.toFixed(1)}%`;
};

/**
 * Formatea un número con separadores de miles
 * @param {number} value - El valor numérico a formatear
 * @returns {string} - El valor formateado como X,XXX
 */
export const formatNumber = (value) => {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0';
  }
  
  return value.toLocaleString('es-MX');
};

/**
 * Parsea un string de moneda formateado de vuelta a número
 * @param {string} currencyString - String con formato $X,XXX.XX
 * @returns {number} - El valor numérico
 */
export const parseCurrency = (currencyString) => {
  if (typeof currencyString !== 'string') {
    return 0;
  }
  
  // Remover símbolo de peso, comas y espacios
  const cleanString = currencyString.replace(/[$,\s]/g, '');
  const number = parseFloat(cleanString);
  
  return isNaN(number) ? 0 : number;
};