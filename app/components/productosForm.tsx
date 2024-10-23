import { useState } from 'react';
import { addProducto } from '../lib/productos';
import { useAuth } from '../context/AuthContext';

export function ProductoForm() {
  const [tipoProducto, setTipoProducto] = useState<'ropa' | 'medias' | 'perfume' | 'otro'>('ropa');
    
  const { user, refreshProductos } = useAuth();

  const [productoTipoRopa, setProductoTipoRopa] = useState<Productos>({
    id: '',
    nombre: '',
    marca: '',
    tipo: 'ropa',
    precio: 0,
    userID: '',
    XL: 0,
    L: 0,
    M: 0,
    S: 0,
  });

  const [productoTipoMedias, setProductoTipoMedias] = useState<Productos>({
    id: '',
    nombre: '',
    marca: '',
    tipo: 'medias',
    precio: 0,
    userID: '',
    'Talle 2': 0,
    'Talle 3': 0,
    'Talle 4': 0,
    'Talle 5': 0,
    'Talle 6': 0,
  });

  const [productoTipoPerfume, setProductoTipoPerfume] = useState<Productos>({
    id: '',
    nombre: '',
    marca: '',
    tipo: 'perfume',
    precio: 0,
    cantidad: 0,
    userID: '',
  });

  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value as 'ropa' | 'medias' | 'perfume' | 'otro';
    setTipoProducto(selectedType);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    // Convertir el valor a número solo si el campo es un número
    const valor = name === 'precio' || ['S', 'M', 'L', 'XL'].includes(name) || ['Talle 2', 'Talle 3', 'Talle 4', 'Talle 5', 'Talle 6'].includes(name)
      ? Number(value) || 0 // Usar 0 si no se puede convertir
      : value; // Mantener como string para los demás campos
  
    // Actualizamos el estado según el tipo de producto seleccionado
    switch (tipoProducto) {
      case 'ropa':
        setProductoTipoRopa((prev) => ({
          ...prev,
          [name]: valor,
        }));
        break;
      case 'medias':
        setProductoTipoMedias((prev) => ({
          ...prev,
          [name]: valor,
        }));
        break;
      case 'perfume':
        setProductoTipoPerfume((prev) => ({
          ...prev,
          [name]: valor,
        }));
        break;
      default:
        break;
    }
  };
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let nuevoProducto = productoTipoRopa;

    if (tipoProducto === 'ropa') {
      nuevoProducto = productoTipoRopa;
    } else if (tipoProducto === 'medias') {
      nuevoProducto = productoTipoMedias;
    } else if (tipoProducto === 'perfume') {
      nuevoProducto = productoTipoPerfume;
    }

    try {
      if (user) {
        await addProducto(user.uid, nuevoProducto); // Guardamos el producto en Firebase
        await refreshProductos();
      }
    } catch (error) {
      console.error('Error agregando producto:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={tipoProducto} onChange={handleTipoChange}>
        <option value="ropa">Ropa</option>
        <option value="medias">Medias</option>
        <option value="perfume">Perfume</option>
        <option value="otro">Otro</option>
      </select>

      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={tipoProducto === 'ropa' ? productoTipoRopa.nombre : tipoProducto === 'medias' ? productoTipoMedias.nombre : productoTipoPerfume.nombre}
        onChange={handleChange}
      />

      <input
        type="text"
        name="marca"
        placeholder="Marca"
        value={tipoProducto === 'ropa' ? productoTipoRopa.marca : tipoProducto === 'medias' ? productoTipoMedias.marca : productoTipoPerfume.marca}
        onChange={handleChange}
      />

      <input
        type="number"
        name="precio"
        placeholder="Precio"
        value={tipoProducto === 'ropa' ? productoTipoRopa.precio : tipoProducto === 'medias' ? productoTipoMedias.precio : productoTipoPerfume.precio}
        onChange={handleChange}
      />

      {tipoProducto === 'ropa' && (
        <>
          <input
            type="number"
            name="S"
            placeholder="S"
            value={productoTipoRopa.S}
            onChange={handleChange}
          />
          <input
            type="number"
            name="M"
            placeholder="M"
            value={productoTipoRopa.M}
            onChange={handleChange}
          />
          <input
            type="number"
            name="L"
            placeholder="L"
            value={productoTipoRopa.L}
            onChange={handleChange}
          />
          <input
            type="number"
            name="XL"
            placeholder="XL"
            value={productoTipoRopa.XL}
            onChange={handleChange}
          />
        </>
      )}

      {tipoProducto === 'medias' && (
        <>
          <input
            type="number"
            name="Talle 2"
            placeholder="Talle 2"
            value={productoTipoMedias['Talle 2']}
            onChange={handleChange}
          />
          <input
            type="number"
            name="Talle 3"
            placeholder="Talle 3"
            value={productoTipoMedias['Talle 3']}
            onChange={handleChange}
          />
          <input
            type="number"
            name="Talle 4"
            placeholder="Talle 4"
            value={productoTipoMedias['Talle 4']}
            onChange={handleChange}
          />
          <input
            type="number"
            name="Talle 5"
            placeholder="Talle 5"
            value={productoTipoMedias['Talle 5']}
            onChange={handleChange}
          />
          <input
            type="number"
            name="Talle 6"
            placeholder="Talle 6"
            value={productoTipoMedias['Talle 6']}
            onChange={handleChange}
          />
        </>
      )}

      {tipoProducto === 'perfume' && (
        <>
          <input
            type="number"
            name="cantidad"
            placeholder="Cantidad"
            value={productoTipoPerfume.cantidad}
            onChange={handleChange}
          />
        </>
      )}

      <button type="submit" className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md shadow hover:bg-blue-600">
        Guardar Producto
      </button>
    </form>
  );
}
