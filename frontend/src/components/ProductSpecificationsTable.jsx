import { FaFlask, FaVial, FaPalette, FaClock, FaEye, FaTint, FaWeight, FaPaintBrush  } from 'react-icons/fa';
import { MdScience } from 'react-icons/md';

export const ProductSpecificationsTable = ({ 
    selectedProductData
}) => {
    if (!selectedProductData) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-3 text-center">
                <div className="text-gray-400 mb-2">
                    <FaEye size={24} className="mx-auto" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                    Especificaciones Técnicas
                </h3>
                <p className="text-xs text-gray-500">
                    Selecciona un producto
                </p>
            </div>
        );
    }

    // Mapear los parámetros técnicos con sus iconos
    const getParameterIcon = (param) => {
        switch(param.toLowerCase()) {
            case 'viscosidad':
                return <FaTint className="text-blue-500" size={12} />;
            case 'p_g':
                return <FaWeight className="text-green-500" size={12} />;
            case 'brillo':
            case 'brillo_60':
                return <FaEye className="text-yellow-500" size={12} />;
            case 'molienda':
                return <FaVial className="text-purple-500" size={12} />;
            case 'secado':
                return <FaClock className="text-orange-500" size={12} />;
            case 'cubrimiento':
                return <FaPaintBrush className="text-indigo-500" size={12} />;
            case 'color':
                return <FaPalette className="text-red-500" size={12} />;
            case 'ph':
                return <FaFlask className="text-teal-500" size={12} />;
            case 'poder_tintoreo':
                return <FaPalette className="text-pink-500" size={12} />;
            default:
                return <MdScience className="text-gray-500" size={12} />;
        }
    };

    // Formatear el nombre del parámetro
    const formatParameterName = (param) => {
        const names = {
            'viscosidad': 'VISCOSIDAD',
            'p_g': 'P / G',
            'brillo': 'BRILLO',
            'brillo_60': 'BRILLO 60°',
            'molienda': 'MOLIENDA',
            'secado': 'SECADO',
            'cubrimiento': 'CUBRIMIENTO',
            'color': 'COLOR',
            'ph': 'PH',
            'poder_tintoreo': 'PODER TINTÓREO'
        };
        return names[param] || param.toUpperCase();
    };

    // Formatear el valor del parámetro
    const formatParameterValue = (param, value) => {
        if (!value || value === 0 || value === '0') return '-';
        
        switch(param.toLowerCase()) {
            case 'viscosidad':
                return `${value} KU`;
            case 'p_g':
                return `${value} Kg`;
            case 'brillo':
                return value === 'MATE' ? 'MATE' : `${value}`;
            case 'brillo_60':
                return `>= ${value}`;
            case 'molienda':
                return `${value} H`;
            case 'secado':
                return `${value} HORAS`;
            case 'cubrimiento':
                return `${value} +/-5`;
            case 'color':
                return value === 'STD' ? 'STD' : value;
            case 'ph':
                return value === 0 ? '-' : value;
            case 'poder_tintoreo':
                return value === 'STD' ? 'STD' : value;
            default:
                return value;
        }
    };

    // Extraer parámetros técnicos del producto
    const parameters = [
        { key: 'viscosidad', value: selectedProductData.viscosidad },
        { key: 'p_g', value: selectedProductData.p_g },
        { key: 'brillo', value: selectedProductData.brillo },
        { key: 'brillo_60', value: selectedProductData.brillo_60 },
        { key: 'molienda', value: selectedProductData.molienda },
        { key: 'secado', value: selectedProductData.secado },
        { key: 'cubrimiento', value: selectedProductData.cubrimiento },
        { key: 'color', value: selectedProductData.color },
        { key: 'ph', value: selectedProductData.ph },
        { key: 'poder_tintoreo', value: selectedProductData.poder_tintoreo }
    ].filter(param => param.value !== null && param.value !== undefined && param.value !== '0');

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Header Compacto */}
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-3 py-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-semibold flex items-center gap-1">
                            <MdScience size={12} />
                            Especificaciones
                        </h3>
                        <p className="text-teal-100 text-xs truncate">
                            {selectedProductData.nombre}
                        </p>
                    </div>
                    <div className="text-right flex gap-1 items-center">
                        <div className="text-sm font-bold">
                            {parameters.length}
                        </div>
                        <div className="text-sm text-teal-100">
                            Parámetros
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla Compacta */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Parámetro
                            </th>
                            <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Patrón
                            </th>
                            <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Lote
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {parameters.length > 0 ? (
                            parameters.map((param) => (
                                <tr key={param.key} className="hover:bg-gray-50">
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 mr-2">
                                                {getParameterIcon(param.key)}
                                            </div>
                                            <div className="text-xs font-medium text-gray-700">
                                                {formatParameterName(param.key)}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-center">
                                        <div className="text-xs font-semibold text-gray-700">
                                            {formatParameterValue(param.key, param.value)}
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-center">
                                        <div className="text-xs text-gray-500">
                                            N/A
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="px-3 py-6 text-center text-gray-500">
                                    <div className="flex flex-col items-center">
                                        <MdScience size={32} className="text-gray-300 mb-2" />
                                        <p className="text-xs">
                                            No hay especificaciones disponibles
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer Compacto */}
            <div className="bg-gray-50 px-3 py-2 border-t">
                <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-600">
                        <span className="font-semibold">{parameters.length}</span> especificaciones
                    </div>
                    <div className="text-xs text-gray-500">
                        {selectedProductData.codigo}
                    </div>
                </div>
            </div>
        </div>
    );
};