'use client';

import { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext"; // Asegúrate de que la ruta sea correcta
import { deleteProductoById, getProductos } from '../lib/productos';
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

export function ProductosTable() {
  const { user } = useAuth(); // Asegúrate de que `useAuth` devuelve el usuario autenticado
  const [productos, setProductos] = useState<Productos[]>([]);

  // Cargar productos del usuario autenticado
  useEffect(() => {
    if (user) {
      getProductos(user.uid)
        .then(setProductos)
        .catch(console.error);
    }
  }, [user]);

  // Función para manejar la eliminación de un producto
  // Función para manejar la eliminación de un producto
  const handleDelete = async (id: string) => {
    try {
      await deleteProductoById(id);
      // Refrescar los productos desde Firestore
      if (user) {
        
        const updatedProductos = await getProductos(user.uid);
        setProductos(updatedProductos);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };


  // Función para renderizar cantidad o detalles de tallas
  const renderCantidadOrDetails = (producto: Productos) => {
    if (producto.cantidad) {
      return (
        <span>
          Total: <span className={producto.cantidad > 0 ? 'text-green-500' : 'text-red-500'}>{producto.cantidad}</span>
        </span>
      );
    } else {
      const detalles: JSX.Element[] = [];
      const sizeKeys: (keyof Productos)[] = ["XL", "L", "M", "S", 'Talle 2', 'Talle 3', 'Talle 4', 'Talle 5', 'Talle 6'];
  
      sizeKeys.forEach((key) => {
        const value = producto[key];
        if (typeof value === 'number') {
            detalles.push(
              <span key={key}>
                {key}: <span className={value > 0 ? 'text-green-500' : 'text-red-500'}>{value}</span>{" "}
              </span>
            );
          }
        });
  
      return detalles.length > 0 ? detalles : <span>Sin detalles</span>;
    }
  };

  // Calcular el total de unidades sumando `cantidad` y las tallas
  const totalUnidades = productos.reduce((total, producto) => {
    let cantidadTotal = producto.cantidad || 0;
    const sizeKeys: (keyof Productos)[] = ["XL", "L", "M", "S", 'Talle 2', 'Talle 3', 'Talle 4', 'Talle 5', 'Talle 6'];

    sizeKeys.forEach((key) => {
        const value = producto[key];
        if (typeof value === 'number') {  // Aquí aseguramos que sea número antes de sumar
            cantidadTotal += value;
        }
    });

    return total + cantidadTotal;
}, 0);

  return (
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
        {productos.map((producto) => (
          <TableRow key={producto.id}>
            <TableCell>{producto.tipo}</TableCell>
            <TableCell>{producto.nombre}</TableCell>
            <TableCell>{producto.marca}</TableCell>
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
            </TableCell> {/* Botón para borrar el producto */}
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
  );
}
