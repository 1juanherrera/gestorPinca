import { useState, useEffect, useCallback, useRef } from 'react'; // Importa useRef
import { getApiUrl, commonHeaders } from '../utils/apiConfig';

export const useApi = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fullUrl = getApiUrl(endpoint);

  const optionsRef = useRef(options);

  // Actualizar el ref si las opciones realmente cambian (profundo o superficialmente según necesites)
  // Para la mayoría de los casos superficial es suficiente si 'options' son simples.
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);


  const fetchData = useCallback(async (body = null, method = 'GET') => {
    setLoading(true);
    setError(null);

    const abortController = new AbortController();
    const signal = abortController.signal;

    try {
      // Usar optionsRef.current aquí
      const finalHeaders = { ...commonHeaders, ...optionsRef.current.headers };
      const config = { ...optionsRef.current, method, signal, headers: finalHeaders };

      if (body) {
        config.body = JSON.stringify(body);
      }

      const response = await fetch(fullUrl, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error desconocido del servidor.' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Petición abortada:', fullUrl);
      } else {
        setError(err);
        console.error('Error al hacer la petición a:', fullUrl, err);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fullUrl]); // <-- ¡IMPORTANTÍSIMO! `options` SE HA ELIMINADO DE LAS DEPENDENCIAS AQUÍ

  useEffect(() => {
    // Usar optionsRef.current aquí
    if (!optionsRef.current.method || optionsRef.current.method.toUpperCase() === 'GET') {
      fetchData();
    }
  }, [fullUrl, optionsRef, fetchData]); // <-- options.method se ha cambiado a optionsRef.current.method, y optionsRef como dependencia.
                                       //  fetchData ya es estable gracias al useCallback.
                                       //  Lo importante es que optionsRef no cambia en cada render.

  return { data, loading, error, fetchData };
}