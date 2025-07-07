// hooks/useItemForm.js
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems } from '../features/inventario/inventarioSlice';

export const useItemForm = (initialData = null) => {
    // Redux
    const dispatch = useDispatch();
    const { items, loading: loadingItems } = useSelector(state => state.inventario);

    const [formData, setFormData] = useState({
        // Campos básicos
        nombre: initialData?.nombre || '',
        codigo: initialData?.codigo || '',
        tipo: initialData?.tipo || 'PRODUCTO',
        cantidad: initialData?.cantidad || '',
        costo_unitario: initialData?.costo_unitario || '',

        // Campos específicos
        viscosidad: initialData?.viscosidad || '',
        p_g: initialData?.p_g || '',
        color: initialData?.color || '',
        brillo_60: initialData?.brillo_60 || '',
        secado: initialData?.secado || '',
        cubrimiento: initialData?.cubrimiento || '',
        molienda: initialData?.molienda || '',
        ph: initialData?.ph || '',
        poder_tintoreo: initialData?.poder_tintoreo || '',
        volumen: initialData?.volumen || '',
        categoria_id: initialData?.categoria_id || ''
    });

    // Estado para formulaciones
    const [formulaciones, setFormulaciones] = useState(initialData?.formulaciones || []);
    const [errors, setErrors] = useState({});
    const [activeTab, setActiveTab] = useState('basico');

    // Cargar items al montar el componente
    useEffect(() => {
        console.log('useItemForm: Cargando items para materias primas...');
        dispatch(fetchItems());
    }, [dispatch]);

    // Filtrar materias primas de los items cargados
    const materiasPrimas = items.filter(item => 
        item.tipo === 'MATERIA PRIMA' || item.tipo === 'INSUMO'
    );

    // Debug: Mostrar materias primas disponibles (puedes quitar esto en producción)
    useEffect(() => {
        console.log('useItemForm: Items cargados:', items);
        console.log('useItemForm: Materias primas filtradas:', materiasPrimas);
    }, [items, materiasPrimas]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Limpiar error si existe
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Manejar formulaciones
    const handleAddFormulacion = () => {
        const newFormulacion = {
            id: Date.now(), // ID temporal
            materia_prima_id: '',
            cantidad: '',
            unidad: 'kg'
        };
        setFormulaciones([...formulaciones, newFormulacion]);
    };

    const handleUpdateFormulacion = (index, field, value) => {
        const updated = [...formulaciones];
        updated[index][field] = value;
        setFormulaciones(updated);
    };

    const handleDeleteFormulacion = (index) => {
        const updated = formulaciones.filter((_, i) => i !== index);
        setFormulaciones(updated);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
        if (!formData.codigo.trim()) newErrors.codigo = 'El código es requerido';
        if (!formData.tipo) newErrors.tipo = 'El tipo es requerido';

        // Validar formulaciones si es PRODUCTO o INSUMO
        if ((formData.tipo === 'PRODUCTO' || formData.tipo === 'INSUMO') && formulaciones.length > 0) {
            formulaciones.forEach((form, index) => {
                if (!form.materia_prima_id) {
                    newErrors[`formulacion_${index}_materia`] = 'Seleccione una materia prima';
                }
                if (!form.cantidad || form.cantidad <= 0) {
                    newErrors[`formulacion_${index}_cantidad`] = 'La cantidad debe ser mayor a 0';
                }
                if (!form.unidad) {
                    newErrors[`formulacion_${index}_unidad`] = 'Seleccione una unidad';
                }
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getProcessedData = () => {
        if (!validateForm()) {
            return null;
        }

        return {
            ...formData,
            cantidad: formData.cantidad === '' ? 0 : Number(formData.cantidad),
            costo_unitario: formData.costo_unitario === '' ? 0 : Number(formData.costo_unitario),
            categoria_id: formData.categoria_id === '' ? null : Number(formData.categoria_id),
            // Incluir formulaciones solo si es PRODUCTO o INSUMO
            formulaciones: (formData.tipo === 'PRODUCTO' || formData.tipo === 'INSUMO') ? formulaciones : []
        };
    };

    return {
        formData,
        setFormData, // Puedes exponer el setter si necesitas resetear el formulario desde fuera
        formulaciones,
        setFormulaciones, // Puedes exponer el setter si necesitas resetear las formulaciones desde fuera
        errors,
        loadingItems,
        materiasPrimas,
        activeTab,
        setActiveTab,
        handleChange,
        handleAddFormulacion,
        handleUpdateFormulacion,
        handleDeleteFormulacion,
        validateForm,
        getProcessedData,
    };
};