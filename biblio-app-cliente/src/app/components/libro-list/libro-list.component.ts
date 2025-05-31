import { Component, OnInit } from '@angular/core';
import { LibroService } from '../../services/libro.service';
import { Libro } from '../../models/libro.model';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-libro-list',
  imports: [CommonModule, RouterLink, NgClass, FormsModule],
  templateUrl: './libro-list.component.html',
  styleUrls: ['./libro-list.component.css']
})
export class LibroListComponent implements OnInit {
  libros: Libro[] = [];
  isLoading = true;
  errorMsg: string | null = null;
  searchTerm = '';

  constructor(
    private libroService: LibroService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLibros();
  }

  loadLibros(): void {
    this.isLoading = true;
    this.errorMsg = null;

    this.libroService.getLibros().subscribe({
      next: (data) => {
        this.libros = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = err.message;
        this.isLoading = false;
      }
    });
  }

  editLibro(id?: string): void {
    if (id) {
      this.router.navigate(['/libros/editar', id]);
    }
  }

  deleteLibro(id?: string): void {
    if (id) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás revertir esta acción',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.libroService.deleteLibro(id).subscribe({
            next: () => {
              Swal.fire('Eliminado', 'El libro ha sido eliminado', 'success');
              this.loadLibros();
            },
            error: (err) => {
              Swal.fire('Error', err.message, 'error');
            }
          });
        }
      });
    }
  }

  cambiarEstado(libro: Libro): void {
    const nuevoEstado = libro.estado === 'Disponible' ? 'Prestado' : 'Disponible';
    
    this.libroService.cambiarEstado(libro._id!, nuevoEstado).subscribe({
      next: (updatedLibro) => {
        libro.estado = updatedLibro.estado;
        Swal.fire('Estado actualizado', `El libro ahora está ${libro.estado}`, 'success');
      },
      error: (err) => {
        Swal.fire('Error', err.message, 'error');
      }
    });
  }

  get filteredLibros(): Libro[] {
    if (!this.searchTerm) return this.libros;
    return this.libros.filter(libro => 
      libro.titulo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      libro.autor.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}