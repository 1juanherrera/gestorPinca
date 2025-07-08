import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchClientes,
  fetchClienteById,
  fetchClienteWithFacturas,
  fetchClienteWithPagos,
  fetchClienteEstadisticas,
  createCliente,
  updateCliente,
  deleteCliente,
  searchClientes,
  setSelectedCliente,
  clearSelectedCliente,
  setSearchTerm,
  clearError,
  clearClienteRelationalData,
  optimizeState,
  selectClientes,
  selectClientesLoading,
  selectClientesError,
  selectSelectedCliente,
  selectClienteConFacturas,
  selectClienteConPagos,
  selectClienteEstadisticas,
  selectSearchTerm,
  selectClientesFiltrados,
  selectClientesEstadisticas
} from '../features/clientes/clientesSlice';

export const useClientes = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedClienteLocal, setSelectedClienteLocal] = useState(null);

  // Selectores
  const clientes = useSelector(selectClientes);
  const loading = useSelector(selectClientesLoading);
  const error = useSelector(selectClientesError);
  const selectedCliente = useSelector(selectSelectedCliente);
  const clienteConFacturas = useSelector(selectClienteConFacturas);
  const clienteConPagos = useSelector(selectClienteConPagos);
  const clienteEstadisticas = useSelector(selectClienteEstadisticas);
  const searchTerm = useSelector(selectSearchTerm);
  const clientesFiltrados = useSelector(selectClientesFiltrados);
  const estadisticasGenerales = useSelector(selectClientesEstadisticas);

  // Cargar clientes al inicializar
  useEffect(() => {
    dispatch(fetchClientes());
  }, [dispatch]);

  // Funciones principales
  const loadClientes = useCallback(() => {
    dispatch(fetchClientes());
  }, [dispatch]);

  const loadClienteById = useCallback((id) => {
    dispatch(fetchClienteById(id));
  }, [dispatch]);

  const loadClienteConFacturas = useCallback((id) => {
    dispatch(fetchClienteWithFacturas(id));
  }, [dispatch]);

  const loadClienteConPagos = useCallback((id) => {
    dispatch(fetchClienteWithPagos(id));
  }, [dispatch]);

  const loadClienteEstadisticas = useCallback((id) => {
    dispatch(fetchClienteEstadisticas(id));
  }, [dispatch]);

  const buscarClientes = useCallback((termino) => {
    if (termino.trim()) {
      dispatch(searchClientes(termino));
    } else {
      dispatch(fetchClientes());
    }
    dispatch(setSearchTerm(termino));
  }, [dispatch]);

  const crearCliente = useCallback(async (clienteData) => {
    const result = await dispatch(createCliente(clienteData)).unwrap();
    setIsModalOpen(false);
    return result;
  }, [dispatch]);

  const actualizarCliente = useCallback(async (id, clienteData) => {
    const result = await dispatch(updateCliente({ id, clienteData })).unwrap();
    setIsModalOpen(false);
    return result;
  }, [dispatch]);

  const eliminarCliente = useCallback(async (id) => {
    const result = await dispatch(deleteCliente(id)).unwrap();
    return result;
  }, [dispatch]);

  const seleccionarCliente = useCallback((cliente) => {
    dispatch(setSelectedCliente(cliente));
  }, [dispatch]);

  const limpiarSeleccion = useCallback(() => {
    dispatch(clearSelectedCliente());
    dispatch(clearClienteRelationalData());
  }, [dispatch]);

  const limpiarError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Funciones del modal
  const abrirModalCrear = useCallback(() => {
    setModalMode('create');
    setSelectedClienteLocal(null);
    setIsModalOpen(true);
  }, []);

  const abrirModalEditar = useCallback((cliente) => {
    setModalMode('edit');
    setSelectedClienteLocal(cliente);
    setIsModalOpen(true);
  }, []);

  const abrirModalVer = useCallback((cliente) => {
    setModalMode('view');
    setSelectedClienteLocal(cliente);
    setIsModalOpen(true);
  }, []);

  const cerrarModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedClienteLocal(null);
  }, []);

  // Función para cargar datos completos del cliente
  const cargarDatosCompletos = useCallback(async (clienteId) => {
    await Promise.all([
      dispatch(fetchClienteWithFacturas(clienteId)),
      dispatch(fetchClienteWithPagos(clienteId)),
      dispatch(fetchClienteEstadisticas(clienteId))
    ]);
  }, [dispatch]);

  return {
    // Estados
    clientes,
    clientesFiltrados,
    loading,
    error,
    selectedCliente,
    clienteConFacturas,
    clienteConPagos,
    clienteEstadisticas,
    searchTerm,
    estadisticasGenerales,
    
    // Estados del modal
    isModalOpen,
    modalMode,
    selectedClienteLocal,
    
    // Funciones principales
    loadClientes,
    loadClienteById,
    loadClienteConFacturas,
    loadClienteConPagos,
    loadClienteEstadisticas,
    buscarClientes,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    seleccionarCliente,
    limpiarSeleccion,
    limpiarError,
    cargarDatosCompletos,
    
    // Funciones del modal
    abrirModalCrear,
    abrirModalEditar,
    abrirModalVer,
    cerrarModal
  };
};