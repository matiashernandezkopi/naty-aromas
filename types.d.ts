interface Productos {
    id:string,
    marca:string,
    nombre:string,
    tipo:string,
    userID:string,
    precio:number,
    cantidad?:number,
    XL?:number,
    L?:number,
    M?:number,
    S?:number,
    'Talle 2'?:number,
    'Talle 3'?:number,
    'Talle 4'?:number,
    'Talle 5'?:number,
    'Talle 6'?:number,
    [key: string]: number | string | undefined;
}

interface Ventas {
    id: string,
    userID: string,
    fecha: Date | string,
    fechaUltimoPago: Date | string,
    cantidad: number,
    cliente: string,
    pagoTotal: number,
    ultimoPago: number,
    contacto: string,
}
