import Link from 'next/link';
import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginButton() {
  const { user } = useAuth(); 
  const isLoggedIn: boolean = Boolean(user);

  return (
    <Link
      href='/login'
      className={`block text-white font-semibold py-2 px-4 rounded transition duration-200 ${
        isLoggedIn
          ? 'bg-red-600 hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-600' // Botón rojo si está logueado
          : 'bg-blue-600 hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600' // Botón azul si no está logueado
      }`}
    >
      {isLoggedIn ? 'LogOut' : 'LogIn'}
    </Link>
  );
}
