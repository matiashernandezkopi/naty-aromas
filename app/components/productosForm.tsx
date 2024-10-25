import { useState } from 'react';
import { addProducto } from '../lib/productos';
import { useAuth } from '../context/AuthContext';

export function ProductoForm() {
  const [error, setError] = useState<string|null>()
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

    if (!nuevoProducto.nombre) {
      setError('Falta nombre')
      return
    }
    setError(null)
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
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg space-y-4">
  {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

  <div>
    <label className="block text-gray-700 font-semibold mb-1">Tipo de producto:</label>
    <select
      value={tipoProducto}
      onChange={handleTipoChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="ropa">Ropa</option>
      <option value="medias">Medias</option>
      <option value="perfume">Perfume</option>
      <option value="otro">Otro</option>
    </select>
  </div>

  <div>
    <label className="block text-gray-700 font-semibold mb-1">Nombre:</label>
    <input
      type="text"
      name="nombre"
      placeholder="Nombre"
      value={tipoProducto === 'ropa' ? productoTipoRopa.nombre : tipoProducto === 'medias' ? productoTipoMedias.nombre : productoTipoPerfume.nombre}
      onChange={handleChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <div>
    <label className="block text-gray-700 font-semibold mb-1">Marca:</label>
    <input
      type="text"
      name="marca"
      placeholder="Marca"
      value={tipoProducto === 'ropa' ? productoTipoRopa.marca : tipoProducto === 'medias' ? productoTipoMedias.marca : productoTipoPerfume.marca}
      onChange={handleChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <div>
    <label className="block text-gray-700 font-semibold mb-1">Precio:</label>
    <input
      type="number"
      name="precio"
      placeholder="Precio"
      value={tipoProducto === 'ropa' ? productoTipoRopa.precio : tipoProducto === 'medias' ? productoTipoMedias.precio : productoTipoPerfume.precio}
      onChange={handleChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {tipoProducto === 'ropa' && (
    <div className="grid grid-cols-2 gap-4">
      {['S', 'M', 'L', 'XL'].map(size => (
        <div key={size}>
          <label className="block text-gray-700 font-semibold mb-1">{size}</label>
          <input
            type="number"
            name={size}
            placeholder={size}
            value={productoTipoRopa[size]}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}
    </div>
  )}

  {tipoProducto === 'medias' && (
    <div className="grid grid-cols-2 gap-4">
      {[2, 3, 4, 5, 6].map(size => (
        <div key={size}>
          <label className="block text-gray-700 font-semibold mb-1">Talle {size}</label>
          <input
            type="number"
            name={`Talle ${size}`}
            placeholder={`Talle ${size}`}
            value={productoTipoMedias[`Talle ${size}`]}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}
    </div>
  )}

  {tipoProducto === 'perfume' && (
    <div>
      <label className="block text-gray-700 font-semibold mb-1">Cantidad:</label>
      <input
        type="number"
        name="cantidad"
        placeholder="Cantidad"
        value={productoTipoPerfume.cantidad}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )}

  <button type="submit" className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
    Guardar Producto
  </button>
</form>

  );
}
