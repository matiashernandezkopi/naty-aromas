'use client';

import { useAuth } from "../context/AuthContext"; // Asegúrate de que la ruta sea correcta
import { deleteProductoById } from '../lib/productos';
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
import React, { useState } from "react";

export function ProductosTable() {
  const { Productos, refreshProductos } = useAuth();
  const [tipoFilter, setTipoFilter] = useState("");
  const [nombreFilter, setNombreFilter] = useState("");
  const [marcaFilter, setMarcaFilter] = useState("");

  // Función para manejar la eliminación de un producto
  const handleDelete = async (id: string) => {
    try {
      await deleteProductoById(id);
      refreshProductos(); // Refrescar los productos desde Firestore
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Función para renderizar cantidad o detalles de tallas
  const renderCantidadOrDetails = (producto: Productos) => {
    if (producto.cantidad && producto.cantidad > 0) {
      return (
        <span>
          Total: <span className='text-green-500'>{ producto.cantidad}</span>
        </span>
      );
    } else {
      const detalles: JSX.Element[] = [];
      const sizeKeys: (keyof Productos)[] = ["XL", "L", "M", "S", 'Talle 2', 'Talle 3', 'Talle 4', 'Talle 5', 'Talle 6'];
  
      sizeKeys.forEach((key) => {
        const value = producto[key];
        if (typeof value === 'number' && value > 0) {
            detalles.push(
                <span key={key}>
                {key}: <span className='text-green-500'>{ value}</span>{" "}
              </span>
            );
          }
        });
  
      return detalles.length > 0 ? detalles : <span>Sin unidades disponibles</span>;
    }
  };

  // Filtrar los productos por tipo, nombre y marca
  const filteredProductos = Productos.filter((producto) =>
    producto.tipo.toLowerCase().includes(tipoFilter.toLowerCase()) &&
    producto.nombre.toLowerCase().includes(nombreFilter.toLowerCase()) &&
    producto.marca.toLowerCase().includes(marcaFilter.toLowerCase())
  );

  // Calcular el total de unidades sumando `cantidad` y las tallas
  const totalUnidades = filteredProductos.reduce((total, producto) => {
    let cantidadTotal = producto.cantidad || 0;
    const sizeKeys: (keyof Productos)[] = ["XL", "L", "M", "S", 'Talle 2', 'Talle 3', 'Talle 4', 'Talle 5', 'Talle 6'];

    sizeKeys.forEach((key) => {
        const value = producto[key];
        if (typeof value === 'number') {
            cantidadTotal += value;
        }
    });

    return total + cantidadTotal;
  }, 0);

  return (
    <div className=" w-screen">
      
      <TalbleForm setMarcaFilter={setMarcaFilter} setNombreFilter={setNombreFilter} setTipoFilter={setTipoFilter} tipoFilter={tipoFilter} marcaFilter={marcaFilter} nombreFilter={nombreFilter} />
      <Table>
        <TableCaption>Una lista de tus productos recientes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Marca</TableHead>
            <TableHead className="text-right">Precio</TableHead>
            <TableHead>Cantidad / Detalles</TableHead>
            <TableHead>Acciones</TableHead> {/* Nueva columna para acciones */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProductos.map((producto) => (
            <TableRow key={producto.id}>
              <TableCell>{producto.tipo}</TableCell>
              <TableCell>{producto.nombre}</TableCell>
              <TableCell>{producto.marca ? (producto.marca) : ('Desconocido')}</TableCell>
              <TableCell className="text-right">
                {new Intl.NumberFormat('es-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 2,
                }).format(producto.precio)}
              </TableCell>
              <TableCell>{renderCantidadOrDetails(producto)}</TableCell>
              <TableCell>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(producto.id)}
                >
                  Borrar
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total de unidades (cantidad + talles)</TableCell>
            <TableCell className="text-right">{totalUnidades}</TableCell>
            <TableCell /> {/* Celda vacía para la columna de acciones */}
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

interface TableFormProps {

  setTipoFilter: (value: string) => void;
  setNombreFilter: (value: string) => void;
  setMarcaFilter: (value: string) => void;
  tipoFilter: string;
  nombreFilter: string;
  marcaFilter: string;
}

export const TalbleForm:React.FC<TableFormProps> = ({
  setTipoFilter,
  setNombreFilter,
  setMarcaFilter,
  tipoFilter,
  nombreFilter,
  marcaFilter,
}) => {
  return (
    <div className="flex gap-4 mb-4">
      <input
        type="text"
        placeholder="Buscar por tipo"
        value={tipoFilter}
        onChange={(e) => setTipoFilter(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Buscar por nombre"
        value={nombreFilter}
        onChange={(e) => setNombreFilter(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Buscar por marca"
        value={marcaFilter}
        onChange={(e) => setMarcaFilter(e.target.value)}
      className="border p-2 rounded"
    />
  </div>
  )
}
