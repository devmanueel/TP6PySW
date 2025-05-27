export interface Socio{
    _id?: string;
    nombre: string;
    email: string;
    telefono?: string|null;
    estado:''|'Activo'|'Inactivo';
    foto?: string|null;
    fechaRegistro?: string;

}