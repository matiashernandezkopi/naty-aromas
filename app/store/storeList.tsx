import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProductoByID } from '../lib/productos';

function StoreList() {
    const { Productos, refreshProductos } = useAuth();
    const [items, setItems] = useState<Productos[]>(Productos);
    refreshProductos()



    // Función para manejar la compra
    const handleBuy = async (id: string) => {
        console.log(id);
        const updatedItems = items.map((item) => {
            if (item.id === id && item.cantidad && item.cantidad > 0) {
                console.log(item);
                const newCantidad = item.cantidad - 1; 
                updateProductoByID(id, { cantidad: newCantidad });

                return { ...item, cantidad: newCantidad };
            }
            return item;
        });

        setItems(updatedItems);
    };

    return (
        <div className=' flex gap-4 p-4'>
          {items.map(item => (
            <StoreCard key={item.id} Product={item} onBuy={() => handleBuy(item.id)} />
          ))}
        </div>
    );
}

export default StoreList;

interface CardProp {
    Product: Productos;
    onBuy: () => void;
}

const StoreCard: React.FC<CardProp> = ({ Product, onBuy }) => {
    return (
        <div key={Product.id} className="bg-white shadow-md rounded-lg p-4 transition-transform transform hover:scale-105">
            <h2 className="text-lg font-semibold text-gray-800">{Product.nombre}</h2>
            <p className="text-gray-700 mt-2">{Product.descripcion}</p>
            <p className="text-gray-900 font-bold mt-2">Precio: <span className="text-green-600">${Product.precio}</span></p>
            <p className="text-gray-700">Cantidad disponible: <span className="font-bold">{Product.cantidad}</span></p>
            <button
                onClick={onBuy}
                className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:bg-gray-400 transition-colors duration-200"
            >
                Comprar
            </button>
        </div>
    )
};