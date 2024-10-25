'use client';

import { useAuth } from "../context/AuthContext";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { deleteVentaById } from "../lib/ventas";
import { useState } from "react";

export function VentasTable() {
    const { Ventas, refreshVentas } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchDate, setSearchDate] = useState(''); // Nueva búsqueda por fecha
    const [searchContact, setSearchContact] = useState(''); // Nueva búsqueda por contacto
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Puedes ajustar cuántos items mostrar por página
    const [sortConfig, setSortConfig] = useState<{
      key: keyof Ventas;
      direction: 'asc' | 'desc';
    }>({ key: 'cliente', direction: 'asc' });
    const handleDelete = async (id: string) => {
        try {
            await deleteVentaById(id);
            refreshVentas();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    // Función para calcular el total vendido
    const totalVendido = Ventas.reduce((total, venta) => total + venta.pagoTotal, 0);

    // Función para calcular el total restante por vender
    const totalPorVender = Ventas.reduce((total, venta) => total + (venta.cantidad - venta.pagoTotal), 0);

    // Función para ordenar las ventas
    const handleSort = (key: keyof Ventas) => {
      let direction: 'asc' | 'desc' = 'asc'; // Especificamos explícitamente el tipo
      if (sortConfig.key === key && sortConfig.direction === 'asc') {
          direction = 'desc';
      }
      setSortConfig({ key, direction });
  };

    const sortedVentas = [...Ventas].sort((a, b) => {
        if (sortConfig.key) {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];
            if (sortConfig.direction === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        }
        return 0;
    });


    // Función para buscar ventas
    const filteredVentas = sortedVentas.filter(venta => {
        const matchCliente = venta.cliente.toLowerCase().includes(searchTerm.toLowerCase());
        const matchFecha = searchDate ? new Date(venta.fecha).toLocaleDateString() === new Date(searchDate).toLocaleDateString() : true;
        const matchContacto = venta.contacto.toLowerCase().includes(searchContact.toLowerCase());

        return matchCliente && matchFecha && matchContacto;
    });

    // Paginación
    const indexOfLastVenta = currentPage * itemsPerPage;
    const indexOfFirstVenta = indexOfLastVenta - itemsPerPage;
    const currentVentas = filteredVentas.slice(indexOfFirstVenta, indexOfLastVenta);

    const totalPages = Math.ceil(filteredVentas.length / itemsPerPage);

    return (
        <div className=" w-full">
            {/* Campo de búsqueda */}
            <input
                type="text"
                placeholder="Buscar por cliente"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4 p-2 border"
            />

            {/* Campo de búsqueda por fecha */}
            <input
                type="date"
                placeholder="Buscar por fecha"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="mb-4 p-2 border"
            />

            {/* Campo de búsqueda por contacto */}
            <input
                type="text"
                placeholder="Buscar por contacto"
                value={searchContact}
                onChange={(e) => setSearchContact(e.target.value)}
                className="mb-4 p-2 border"
            />

            <Table>
                <TableCaption>Una lista de tus ventas y clientes.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead onClick={() => handleSort('cliente')}>Cliente</TableHead>
                        <TableHead onClick={() => handleSort('fecha')}>Fecha</TableHead>
                        <TableHead onClick={() => handleSort('fechaUltimoPago')}>Fecha Último Pago</TableHead>
                        <TableHead>Contacto</TableHead>
                        <TableHead onClick={() => handleSort('cantidad')}>Cantidad</TableHead>
                        <TableHead onClick={() => handleSort('pagoTotal')}>Pago Total</TableHead>
                        <TableHead>Restante</TableHead>
                        <TableHead>Último Pago</TableHead>
                        <TableHead>Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentVentas.map((venta) => (
                        <TableRow key={venta.id}>
                            <TableCell>{venta.cliente}</TableCell>
                            <TableCell>{new Date(venta.fecha).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(venta.fechaUltimoPago).toLocaleDateString()}</TableCell>
                            <TableCell>{venta.contacto}</TableCell>
                            <TableCell className="text-right">
                                {new Intl.NumberFormat('es-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    minimumFractionDigits: 2,
                                }).format(venta.cantidad)}
                            </TableCell>
                            <TableCell className="text-right">
                                {new Intl.NumberFormat('es-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    minimumFractionDigits: 2,
                                }).format(venta.pagoTotal)}
                            </TableCell>
                            <TableCell className="text-right">
                                {new Intl.NumberFormat('es-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    minimumFractionDigits: 2,
                                }).format(venta.cantidad - venta.pagoTotal)}
                            </TableCell>
                            <TableCell className="text-right">
                                {new Intl.NumberFormat('es-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    minimumFractionDigits: 2,
                                }).format(venta.ultimoPago)}
                            </TableCell>
                            <TableCell>
                                <button
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                    onClick={() => handleDelete(venta.id)}
                                >
                                    Borrar
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell>
                            Total vendido: <span className="text-green-500">
                                {new Intl.NumberFormat('es-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    minimumFractionDigits: 2,
                                }).format(totalVendido)}
                            </span>
                        </TableCell>
                        <TableCell>
                            Total por vender: <span className="text-red-500">
                                {new Intl.NumberFormat('es-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    minimumFractionDigits: 2,
                                }).format(totalPorVender)}
                            </span>
                        </TableCell>
                        <TableCell colSpan={8}></TableCell>
                    </TableRow>
                </TableFooter>
            </Table>

            {/* Paginación */}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 bg-gray-300 rounded"
                >
                    Anterior
                </button>
                <span>Página {currentPage} de {totalPages}</span>
                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-gray-300 rounded"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}
