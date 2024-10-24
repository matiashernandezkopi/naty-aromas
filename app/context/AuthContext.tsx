// app/context/AuthContext.tsx
"use client"; // Asegúrate de que esta línea esté al principio

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getProductos } from '../lib/productos';
import { getVentas } from '../lib/ventas'; // Importa la función para obtener ventas desde Firebase

interface AuthContextType {
  user: User | null;
  signOutUser: () => Promise<void>;
  Productos: Productos[];
  Ventas: Ventas[]; // Agregar ventas
  refreshProductos: () => Promise<void>;
  refreshVentas: () => Promise<void>; // Agregar función para refrescar ventas
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [Productos, setProductos] = useState<Productos[]>([]);
  const [Ventas, setVentas] = useState<Ventas[]>([]); // Estado para manejar ventas

  // Función para cargar productos desde sessionStorage
  const loadProductosFromCache = () => {
    const cachedProductos = sessionStorage.getItem('productos');
    if (cachedProductos) {
      try {
        return JSON.parse(cachedProductos); // Parsear correctamente los productos
      } catch (error) {
        console.error('Error parsing productos from session storage:', error);
      }
    }
    return [];
  };

  // Función para cargar ventas desde sessionStorage
  const loadVentasFromCache = () => {
    const cachedVentas = sessionStorage.getItem('ventas');
    if (cachedVentas) {
      try {
        return JSON.parse(cachedVentas); // Parsear correctamente las ventas
      } catch (error) {
        console.error('Error parsing ventas from session storage:', error);
      }
    }
    return [];
  };

  // Guardar productos en sessionStorage cada vez que cambien
  useEffect(() => {
    if (Productos.length > 0) {
      sessionStorage.setItem('productos', JSON.stringify(Productos));
    }
  }, [Productos]);

  // Guardar ventas en sessionStorage cada vez que cambien
  useEffect(() => {
    if (Ventas.length > 0) {
      sessionStorage.setItem('ventas', JSON.stringify(Ventas));
    }
  }, [Ventas]);

  // Función para refrescar los productos desde Firebase
  const refreshProductos = useCallback(async () => {
    if (user) {
      try {
        const userProductos = await getProductos(user.uid);
        setProductos(userProductos);
      } catch (error) {
        console.error('Error fetching Productos:', error);
      }
    }
  }, [user]);

  // Función para refrescar las ventas desde Firebase
  const refreshVentas = useCallback(async () => {
    if (user) {
      try {
        const userVentas = await getVentas(user.uid); // Obtener ventas desde Firebase
        setVentas(userVentas);
      } catch (error) {
        console.error('Error fetching Ventas:', error);
      }
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Cargar productos desde sessionStorage o Firebase
        const cachedProductos = loadProductosFromCache();
        if (cachedProductos.length > 0) {
          setProductos(cachedProductos);
        } else {
          await refreshProductos();
        }

        // Cargar ventas desde sessionStorage o Firebase
        const cachedVentas = loadVentasFromCache();
        if (cachedVentas.length > 0) {
          setVentas(cachedVentas);
        } else {
          await refreshVentas();
        }
      } else {
        setProductos([]); // Limpia los productos si no hay usuario
        setVentas([]); // Limpia las ventas si no hay usuario
      }
    });
    return () => unsubscribe();
  }, [refreshProductos, refreshVentas]);

  const signOutUser = async () => {
    await signOut(auth);
    // Al cerrar sesión, limpiar el sessionStorage
    sessionStorage.removeItem('productos');
    sessionStorage.removeItem('ventas');
  };

  return (
    <AuthContext.Provider value={{ user, signOutUser, Productos, Ventas, refreshProductos, refreshVentas }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
