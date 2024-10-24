import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { addVenta } from '../lib/ventas';


export function VentasForm() {
    const { user, refreshVentas } = useAuth();
    // Obtener la fecha actual
        const fechaActual = new Date();

        // Extraer el día, el mes y el año
        const dia = String(fechaActual.getDate()).padStart(2, '0'); // Asegurarse de que el día tenga dos dígitos
        const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Asegurarse de que el mes tenga dos dígitos (sumar 1 porque getMonth() inicia en 0)
        const anio = fechaActual.getFullYear();


    const fecha = `${anio}-${mes}-${dia}`;
    
    
    const RESET_DATA = {
        id: '',
        userID: user?.uid || '',
        fecha: fecha,
        fechaUltimoPago: fecha,
        cantidad: 0,
        cliente: '',
        pagoTotal: 0,
        ultimoPago: 0,
        contacto: '',
    }

    const [venta, setVenta] = useState<Ventas>(RESET_DATA);

    // Función para formatear la fecha a YYYY-MM-DD
    const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0]; // Formato "YYYY-MM-DD"
    };


    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setVenta((prev: Ventas) => ({
            ...prev,
            [name]: name === 'cantidad' || name === 'pagoTotal' || name === 'ultimoPago' ? parseFloat(value) || 0 : value, // Convertir a número si es necesario
        }));
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            if (user) {
                
                // Llamar a addVenta y pasar el objeto venta
                setVenta(RESET_DATA)
                await addVenta(user.uid, venta);
                await refreshVentas();
                
            }
        } catch (error) {
            console.error('Error agregando venta:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-6">
            <div>
                <label htmlFor="cliente" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cliente</label>
                <input
                    type="text"
                    name="cliente"
                    value={venta.cliente}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                    required
                />
            </div>

            <div>
                <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cantidad</label>
                <input
                    type="number"
                    name="cantidad"
                    value={venta.cantidad}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                    required
                />
            </div>

            <div>
                <label htmlFor="contacto" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contacto</label>
                <input
                    type="text"
                    name="contacto"
                    value={venta.contacto}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                    required
                />
            </div>

            <div>
                <label htmlFor="pagoTotal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pago Total</label>
                <input
                    type="number"
                    name="pagoTotal"
                    value={venta.pagoTotal}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                    required
                />
            </div>

            <div>
                <label htmlFor="ultimoPago" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Último Pago</label>
                <input
                    type="number"
                    name="ultimoPago"
                    value={venta.ultimoPago}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                    required
                />
            </div>

            <div>
                <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de Venta</label>
                <input
                    type="date"
                    name="fecha"
                    value={formatDate(new Date(venta.fecha))}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                    required
                />
            </div>

            <div>
                <label htmlFor="fechaUltimoPago" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha Último Pago</label>
                <input
                    type="date"
                    name="fechaUltimoPago"
                    value={formatDate(new Date(venta.fechaUltimoPago))}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 dark:focus:ring-opacity-50"
            >
                Guardar Venta
            </button>
        </form>
    );
}
