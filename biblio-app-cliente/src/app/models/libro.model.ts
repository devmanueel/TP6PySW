export interface Libro {
  _id?: string;
  isbn: string;
  titulo: string;
  autor: string;
  anioPublicacion: number;
  genero: string;
  estado: 'Disponible' | 'Prestado';
  imagenPortada?: string;
  formato: string;
  editorial: string;
  createdAt?: string;
  updatedAt?: string;
}