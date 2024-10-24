'use client'

import Link from "next/link";
import { ProductoForm } from "./components/productosForm";
import { ProductosTable } from "./components/productosTable";
import { ModeToggle } from "./components/theme";
import LoginButton from "./login/loginButton";


export default function Home() {
    
  return (
    <main className="flex flex-col gap-8 row-start-2 items-center justify-center">
        <Link
          href='/ventas'
          className={`block text-white font-semibold py-2 px-4 rounded transition duration-200 bg-red-600 hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-600 `}
        >
          Ventas
        </Link>
        

      <ModeToggle/>
      <div className="flex gap-4 items-center flex-col w-full h-full">
        
        <ProductosTable/>
        <LoginButton/>
        <ProductoForm/>
      </div>
    </main>
  );
}
