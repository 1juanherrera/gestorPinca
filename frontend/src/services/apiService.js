export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/'; // Con barra al final

export const getApiUrl = (endpoint) => {
    // Asumimos que API_BASE_URL termina en '/' y endpoint empieza con '/'
    return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint.substring(1) : endpoint}`; // Esto quita la barra del endpoint si ya tiene una
    // O más simplemente, si SIEMPRE pasas el endpoint sin la barra inicial a apiService.get('items')
    // return `${API_BASE_URL}${endpoint}`;
};

// 3. Encabezados (headers) comunes para las peticiones JSON
export const commonHeaders = {
  'Content-Type': 'application/json',
};

// 4. Función de utilidad para realizar llamadas a la API
const apiCall = async (endpoint, options = {}) => {
  const url = getApiUrl(endpoint);
  
  const config = {
    headers: {
      ...commonHeaders,
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  // Si la respuesta no es OK (ej. 4xx, 5xx), lanza un error
  if (!response.ok) {
    let errorBody = {};
    let rawErrorText = ''; // Variable para almacenar el texto crudo

    try {
      rawErrorText = await response.text(); // <-- Primero lee el texto crudo
      console.error('Respuesta de error cruda del servidor:', rawErrorText); // <-- Imprime el texto crudo

      // Intenta parsear el cuerpo de la respuesta como JSON
      errorBody = JSON.parse(rawErrorText);
    } catch (e) {
      console.error('Error al parsear el cuerpo de error como JSON:', e);
      // Si no se puede parsear a JSON, o si el texto crudo no era JSON, crea un mensaje genérico
      errorBody = { message: 'Ha ocurrido un error inesperado en el servidor o la respuesta no es JSON.' };
      if (rawErrorText.startsWith('<!doctype html>')) {
          errorBody.message = 'El servidor devolvió una página HTML en lugar de JSON. Revisa el backend.';
      }
    }
    // Lanza un error con el mensaje del servidor o uno por defecto
    throw new Error(errorBody.message || `Error de API: ${response.status}`);
  }

  // Si la respuesta es OK, devuelve el JSON parseado
  return response.json();
};

// 5. Servicio API con métodos convenientes para GET, POST, PUT, DELETE
// Simplifica el uso de apiCall para los métodos HTTP más comunes
export const apiService = {
  get: (endpoint, options) => apiCall(endpoint, { method: 'GET', ...options }),
  
  post: (endpoint, data, options) => apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options
  }),
  
  put: (endpoint, data, options) => apiCall(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options
  }),
  
  delete: (endpoint, options) => apiCall(endpoint, { method: 'DELETE', ...options }),
};

