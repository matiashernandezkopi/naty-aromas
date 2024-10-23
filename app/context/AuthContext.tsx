// app/context/AuthContext.tsx
"use client"; // Asegúrate de que esta línea esté al principio

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getProductos } from '../lib/productos';

interface AuthContextType {
  user: User | null;
  signOutUser: () => Promise<void>;
  Productos: Productos[];
  refreshProductos: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [Productos, setProductos] = useState<Productos[]>([]);

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

  // Guardar productos en sessionStorage cada vez que cambien
  useEffect(() => {
    if (Productos.length > 0) {
      sessionStorage.setItem('productos', JSON.stringify(Productos));
    }
  }, [Productos]);

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Primero, intenta cargar los productos desde sessionStorage
        const cachedProductos = loadProductosFromCache();
        if (cachedProductos.length > 0) {
          setProductos(cachedProductos);
        } else {
          // Si no hay productos en cache, haz la llamada a Firebase
          await refreshProductos();
        }
      } else {
        setProductos([]); // Limpia los productos si no hay usuario
      }
    });
    return () => unsubscribe();
  }, [refreshProductos]);

  const signOutUser = async () => {
    await signOut(auth);
    // Al cerrar sesión, puedes limpiar el sessionStorage si lo prefieres
    sessionStorage.removeItem('productos');
  };

  return (
    <AuthContext.Provider value={{ user, signOutUser, Productos, refreshProductos }}>
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
