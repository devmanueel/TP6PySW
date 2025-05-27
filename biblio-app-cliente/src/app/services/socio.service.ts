import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { catchError } from 'rxjs/operators';

import { Socio } from '../models/socio.model';

@Injectable({
  providedIn: 'root'
})
export class SocioService {
  private apiUrl='http://localhost:4000/api/socios';

  private http = inject(HttpClient);

  private handleError(error:HttpErrorResponse){
    let errorMessage = 'Ocurrio un error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error del servidor: ${error.status}, mensaje: ${error.message}`;
      
      // Verificar si hay un mensaje de error específico del backend
      if (error.error && typeof error.error.mensaje === 'string') {
        errorMessage = error.error.mensaje; // Corregido: usando = en lugar de ==
      }
    }
    console.error(error);

    return throwError(()=>Error(errorMessage));

  }

  getSocios():Observable<Socio[]>{
    console.log('Entrando a Socios Service GetSocios');
    return this.http.get<Socio[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  getSocio(id:string):Observable<Socio>{
    console.log('Entrando a Socios Service GetSocios');
    return this.http.get<Socio>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  createSocio(socio:Socio):Observable<{mensaje:string, socio:Socio}>{
    return this.http.post<{mensaje:string, socio:Socio}>(this.apiUrl, socio).pipe(catchError(this.handleError));
  }

  updateSocio(id:string, socio:Partial<Socio>):Observable<{mensaje:string, socio:Socio}>{
    return this.http.put<{mensaje:string, socio:Socio}>(`${this.apiUrl}/${id}`, socio).pipe(catchError(this.handleError));
  }

  deleteSocio(id:string):Observable<{mensaje:string}>{
    return this.http.delete<{mensaje:string, socio:Socio}>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }
}
