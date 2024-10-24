'use client';

// lib/Ventas.ts
import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'; // Importa uuid para generar un ID único


// Función para agregar un gasto
export async function addVenta(userId: string, Venta: Ventas) {
  try {
    const docRef = await addDoc(collection(db, 'ventas'), {
      ...Venta,
      id: uuidv4(),
      userID: userId,
    });
    return docRef.id; // Devuelve el ID generado del Venta
  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('No se pudo agregar el Venta');
  }
}

// Función para obtener los gastos del usuario
export async function getVentas(userId: string): Promise<Ventas[]> {
  try {
    const VentasRef = collection(db, 'ventas');
    const q = query(VentasRef, where('userID', '==', userId));
    const snapshot = await getDocs(q);
    const Ventas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Ventas, 'id'>)  // Asegúrate de que todos los campos están presentes
    }));
    return Ventas;
  } catch (error) {
    console.error('Error fetching Ventas:', error);
    throw error;
  }
}

// Función para eliminar un gasto
export async function deleteVentaById(id: string): Promise<void> {
  try {
    // Referencia directa al documento usando su ID
    const VentaRef = collection(db, 'ventas');
    
    const q = query(VentaRef, where('id', '==', id));
    // Verifica si la referencia es válida antes de intentar eliminar
    const querySnapshot = await getDocs(q);
    

    // Verifica si se encontró al menos un documento
    if (querySnapshot.empty) {
      console.error(`No expense found with name ${id}`);
      return;
    }

    // Elimina todos los documentos encontrados con el nombre proporcionado
    for (const docSnapshot of querySnapshot.docs) {
      const VentaRef = doc(db, 'ventas', docSnapshot.id);
      await deleteDoc(VentaRef);
      console.log(`Venta with ID ${docSnapshot.id} deleted successfully.`);
    }
  } catch (error) {
    console.error('Error eliminando el Venta de Firestore:', error);
    throw new Error(`Error al intentar eliminar el Venta con ID: ${id}`);
  }
}

