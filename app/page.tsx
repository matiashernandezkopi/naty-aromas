'use client'

import { ProductoForm } from "./components/productosForm";
import { ProductosTable } from "./components/table";
import { ModeToggle } from "./components/theme";
import LoginButton from "./login/loginButton";


export default function Home() {
    
  return (
    <main className="flex flex-col gap-8 row-start-2 items-center justify-center">
      
      <ModeToggle />
      <div className="flex gap-4 items-center flex-col w-full h-full">
        
        <ProductosTable />
        <LoginButton/>
        <ProductoForm/>
      </div>
    </main>
  );
}
