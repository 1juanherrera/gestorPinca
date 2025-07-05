import { useState } from 'react';
import { MdSave, MdCancel } from 'react-icons/md';

export const ItemForm = ({ onSubmit, onCancel, initialData = null, isEditing = false }) => {
    
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

    const [errors, setErrors] = useState({});

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

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
        if (!formData.codigo.trim()) newErrors.codigo = 'El código es requerido';
        if (!formData.tipo) newErrors.tipo = 'El tipo es requerido';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const dataToSend = {
                ...formData,
                cantidad: formData.cantidad === '' ? 0 : Number(formData.cantidad),
                costo_unitario: formData.costo_unitario === '' ? 0 : Number(formData.costo_unitario), 
                categoria_id: formData.categoria_id === '' ? null : Number(formData.categoria_id), 
            };
            onSubmit(dataToSend);
        }
    };

    const inputClasses = "w-full text-sm px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out placeholder-gray-300 text-gray-800";
    const labelClasses = "block text-sm font-semibold text-gray-700 mb-1";
    const errorClasses = "text-red-500 text-xs mt-1";
    const sectionTitleClasses = "text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide transform scale-95 opacity-0 animate-scale-in">
                <div className="p-4">
                    <h2 className="text-xl font-extrabold text-gray-900 mb-8 border-b pb-4 border-gray-200">
                        {isEditing ? 'Editar Item' : 'Crear Nuevo Item'}
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-3">
                        {/* Contenedor principal de los campos: Dividido en 2 columnas en pantallas medianas y grandes */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Columna Izquierda: Información Básica e Inventario/Costos */}
                            <div>
                                {/* Información Básica */}
                                <div className="bg-blue-50 p-4 rounded-lg shadow-sm mb-8">
                                    <h3 className={sectionTitleClasses}>Información Básica</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Se puede ajustar a 1 si se prefiere */}
                                        <div>
                                            <label className={labelClasses}>
                                                Nombre <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="nombre"
                                                value={formData.nombre}
                                                onChange={handleChange}
                                                className={`${inputClasses} ${errors.nombre ? 'border-red-500 ring-red-200' : ''}`}
                                                placeholder="Nombre del item"
                                            />
                                            {errors.nombre && <p className={errorClasses}>{errors.nombre}</p>}
                                        </div>
                                        
                                        <div>
                                            <label className={labelClasses}>
                                                Código <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="codigo"
                                                value={formData.codigo}
                                                onChange={handleChange}
                                                className={`${inputClasses} ${errors.codigo ? 'border-red-500 ring-red-200' : ''}`}
                                                placeholder="Código del item"
                                            />
                                            {errors.codigo && <p className={errorClasses}>{errors.codigo}</p>}
                                        </div>
                                        
                                        <div>
                                            <label className={labelClasses}>
                                                Tipo <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="tipo"
                                                value={formData.tipo}
                                                onChange={handleChange}
                                                className={`${inputClasses} ${errors.tipo ? 'border-red-500 ring-red-200' : ''}`}
                                            >
                                                <option value="PRODUCTO">PRODUCTO</option>
                                                <option value="MATERIA PRIMA">MATERIA PRIMA</option>
                                                <option value="INSUMO">INSUMO</option>
                                            </select>
                                            {errors.tipo && <p className={errorClasses}>{errors.tipo}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Inventario y Costos */}
                                <div className="bg-purple-50 p-4 rounded-lg shadow-sm">
                                    <h3 className={sectionTitleClasses}>Inventario y Costos</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
                                        <div>
                                            <label className={labelClasses}>
                                                Cantidad
                                            </label>
                                            <input
                                                type="number" 
                                                name="cantidad"
                                                value={formData.cantidad}
                                                onChange={handleChange}
                                                className={inputClasses}
                                                placeholder="Cantidad en stock"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className={labelClasses}>
                                                Costo Unitario
                                            </label>
                                            <input
                                                type="number" 
                                                step="0.01" 
                                                name="costo_unitario"
                                                value={formData.costo_unitario}
                                                onChange={handleChange}
                                                className={inputClasses}
                                                placeholder="Costo por unidad"
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Categoría ID</label>
                                            <input
                                                type="number" 
                                                name="categoria_id"
                                                value={formData.categoria_id}
                                                onChange={handleChange}
                                                className={inputClasses}
                                                placeholder="ID de categoría"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Columna Derecha: Propiedades Específicas */}
                            <div>
                                <div className="bg-green-50 p-4 rounded-lg shadow-sm">
                                    <h3 className={sectionTitleClasses}>Propiedades Específicas</h3>
                                    {/* Los campos de Propiedades Específicas ahora están en 2 columnas en pantallas medianas y grandes. */}
                                    <div className="grid grid-cols-2 gap-6"> 
                                        <div>
                                            <label className={labelClasses}>Viscosidad</label>
                                            <input type="text" name="viscosidad" value={formData.viscosidad} onChange={handleChange} className={inputClasses} placeholder="Viscosidad" />
                                        </div>
                                        
                                        <div>
                                            <label className={labelClasses}>P.G</label>
                                            <input type="text" name="p_g" value={formData.p_g} onChange={handleChange} className={inputClasses} placeholder="P.G" />
                                        </div>
                                        
                                        <div>
                                            <label className={labelClasses}>Color</label>
                                            <input type="text" name="color" value={formData.color} onChange={handleChange} className={inputClasses} placeholder="Color" />
                                        </div>
                                        
                                        <div>
                                            <label className={labelClasses}>Brillo 60°</label>
                                            <input type="text" name="brillo_60" value={formData.brillo_60} onChange={handleChange} className={inputClasses} placeholder="Brillo 60°" />
                                        </div>
                                        
                                        <div>
                                            <label className={labelClasses}>Secado</label>
                                            <input type="text" name="secado" value={formData.secado} onChange={handleChange} className={inputClasses} placeholder="Secado" />
                                        </div>
                                        
                                        <div>
                                            <label className={labelClasses}>Cubrimiento</label>
                                            <input type="text" name="cubrimiento" value={formData.cubrimiento} onChange={handleChange} className={inputClasses} placeholder="Cubrimiento" />
                                        </div>
                                        
                                        <div>
                                            <label className={labelClasses}>Molienda</label>
                                            <input type="text" name="molienda" value={formData.molienda} onChange={handleChange} className={inputClasses} placeholder="Molienda" />
                                        </div>
                                        
                                        <div>
                                            <label className={labelClasses}>pH</label>
                                            <input type="text" name="ph" value={formData.ph} onChange={handleChange} className={inputClasses} placeholder="pH" />
                                        </div>
                                        
                                        <div>
                                            <label className={labelClasses}>Poder Tintóreo</label>
                                            <input type="text" name="poder_tintoreo" value={formData.poder_tintoreo} onChange={handleChange} className={inputClasses} placeholder="Poder tintóreo" />
                                        </div>
                                        
                                        <div>
                                            <label className={labelClasses}>Volumen</label>
                                            <input type="text" name="volumen" value={formData.volumen} onChange={handleChange} className={inputClasses} placeholder="Volumen" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-8 py-3 text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 transition-all duration-200 ease-in-out flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg"
                            >
                                <MdCancel size={18} />
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200 ease-in-out flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg"
                            >
                                <MdSave size={18} />
                                {isEditing ? 'Actualizar' : 'Crear'} Item
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};