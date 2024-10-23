'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

interface FirebaseAuthError extends Error {
  code: string;
}

export default function Login() {
  const { user, signOutUser } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setError('');
    } catch (err) {
      const firebaseError = err as FirebaseAuthError;
      setError(firebaseError.code ? `Error: ${firebaseError.message}` : 'Error desconocido');
    }
  };

  const handleLogIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
    } catch (err) {
      const firebaseError = err as FirebaseAuthError;
      setError(firebaseError.code ? `Error: ${firebaseError.message}` : 'Error desconocido');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">Autenticación</h1>
        {user ? (
          <div className="text-center">
            <p className="text-gray-800 dark:text-gray-200 mb-4">Bienvenido, <span className="font-semibold">{user.email}</span></p>
            <button
              onClick={async () => {
                await signOutUser();
              }}
              className="bg-blue-600 hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded w-full mb-4"
            >
              Cerrar sesión
            </button>
            <Link href="/" passHref className="bg-gray-600 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded w-full text-center">
              Home 
            </Link>
          </div>
        ) : (
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 w-full mb-4 text-black dark:text-white bg-white dark:bg-gray-800"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 w-full mb-4 text-black dark:text-white bg-white dark:bg-gray-800"
            />
            <button
              onClick={handleLogIn}
              className="bg-blue-600 hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded w-full mb-2"
            >
              Iniciar sesión
            </button>
            <button
              onClick={handleSignUp}
              className="bg-green-600 hover:bg-green-500 dark:bg-green-700 dark:hover:bg-green-600 text-white font-semibold py-2 px-4 rounded w-full"
            >
              Registrarse
            </button>
            {error && <p className="text-red-600 dark:text-red-400 text-center mt-4">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
