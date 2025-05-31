import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Libro } from '../models/libro.model';

@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private apiUrl = 'http://localhost:4000/api/libros';
  private http = inject(HttpClient);

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error del servidor: ${error.status}, mensaje: ${error.message}`;
      if (error.error && typeof error.error.mensaje === 'string') {
        errorMessage = error.error.mensaje;
      }
    }
    console.error(error);
    return throwError(() => new Error(errorMessage));
  }

  getLibros(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getLibro(id: string): Observable<Libro> {
    return this.http.get<Libro>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createLibro(libro: FormData): Observable<{ mensaje: string, libro: Libro }> {
    return this.http.post<{ mensaje: string, libro: Libro }>(this.apiUrl, libro).pipe(
      catchError(this.handleError)
    );
  }

  updateLibro(id: string, libro: FormData): Observable<{ mensaje: string, libro: Libro }> {
    return this.http.put<{ mensaje: string, libro: Libro }>(`${this.apiUrl}/${id}`, libro).pipe(
      catchError(this.handleError)
    );
  }

  deleteLibro(id: string): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  cambiarEstado(id: string, estado: string): Observable<Libro> {
    return this.http.patch<Libro>(`${this.apiUrl}/${id}/estado`, { estado }).pipe(
      catchError(this.handleError)
    );
  }
}