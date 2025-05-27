import { Component,OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder,FormGroup,Validators,ReactiveFormsModule } from '@angular/forms';

import { ActivatedRoute,Router, RouterModule } from '@angular/router';
import { SocioService } from '../../services/socio.service';
import { Socio } from '../../models/socio.model';

import Swal from 'sweetalert2';
import { raceWith } from 'rxjs';



@Component({
  selector: 'app-socio-form',
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './socio-form.component.html',
  styleUrl: './socio-form.component.css'
})
export class SocioFormComponent implements OnInit{
  socioForm:FormGroup;
  isEditMode=false;

  socioId:string|null=null;
  isLoading=false;

  errorMsg:string|null = null;

  imagePreview: string | ArrayBuffer|null=null;

  private fb = inject(FormBuilder);
  private socioService = inject(SocioService);
  private router = inject( Router);
  private route = inject(ActivatedRoute);

  constructor(){
    this.socioForm=this.fb.group({
      nombre:['',[Validators.required]],
      email:['',[Validators.required,Validators.email]],
      telefono:[''],
      estado:['Activo',Validators.required],
      foto:[null]
    })
  }

  ngOnInit(): void {
    this.socioId = this.route.snapshot.paramMap.get('id');
    if(this.socioId){
      this.isEditMode=true;

      this.isLoading=true;

      this.socioService.getSocio(this.socioId).subscribe({
        next:(socio)=>{
          this.socioForm.patchValue(socio);
          if(socio.foto){
            this.imagePreview = socio.foto;
          }
          this.isLoading=false;
        },
        error:(err)=>{
          console.error(err);
          this.errorMsg=err.mensaje || "No se pudo cargar el socio para editar. ";
          this.isLoading=false;
        }
      });

    }
  }


  // Método que se ejecuta cuando cambia el archivo seleccionado en un input de tipo 'file'.
  // nFileChange para que solo permita archivos JPG y que no superen los 250KB
  onFileChange(event: any): void {
    // Obtiene el archivo seleccionado del evento. El '?' es el operador de encadenamiento opcional.
    const file = (event.target as HTMLInputElement).files?.[0];
    // Define el tamaño máximo del archivo en KB.
    const MAX_FILE_SIZE_KB = 250; // 250 KB (en el comentario original dice 250KB, pero el código usa 250)
    // Convierte el tamaño máximo a bytes.
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_KB * 1024;
    // Define el tipo MIME permitido (solo imágenes JPEG).
    const ALLOWED_MIME_TYPE = 'image/jpeg'; // Para archivos JPG/JPEG

    // Limpia el valor del input de archivo. Esto es importante para permitir
    // que el evento 'change' se dispare de nuevo si el usuario selecciona el mismo archivo después de un error.
    (event.target as HTMLInputElement).value = '';

    // Si se seleccionó un archivo.
    if (file) {
      // 1. Validación del tipo de archivo (MIME type)
      // Comprueba si el tipo MIME del archivo no es el permitido.
      if (file.type !== ALLOWED_MIME_TYPE) {
        // Muestra una alerta al usuario indicando el error de tipo de archivo.
        alert(`Error: Solo se permiten archivos en formato JPG/JPEG. El archivo seleccionado es de tipo: ${file.type}`);
        // Restaura la previsualización de imagen a la imagen anterior (si está en modo edición) o a null.
        this.imagePreview = this.isEditMode ? this.socioForm.get('foto')?.value : null;
        // Si no está en modo edición y hay un error, limpia el valor del campo 'foto' en el formulario.
        if (!this.isEditMode) {
          this.socioForm.patchValue({ foto: null });
        }
        // Termina la ejecución de la función si el tipo no es válido.
        return;
      }

      // 2. Validación del tamaño del archivo
      // Comprueba si el tamaño del archivo supera el máximo permitido.
      if (file.size > MAX_FILE_SIZE_BYTES) {
        // Muestra una alerta al usuario indicando el error de tamaño de archivo.
        alert(`Error: El archivo no debe superar los ${MAX_FILE_SIZE_KB}KB. Tamaño actual: ${(file.size / 1024).toFixed(2)}KB`);
        // Restaura la previsualización de imagen a la imagen anterior (si está en modo edición) o a null.
        this.imagePreview = this.isEditMode ? this.socioForm.get('foto')?.value : null;
        // Si no está en modo edición y hay un error, limpia el valor del campo 'foto' en el formulario.
        if (!this.isEditMode) {
          this.socioForm.patchValue({ foto: null });
        }
        // Termina la ejecución de la función si el tamaño no es válido.
        return;
      }

      // Si pasa ambas validaciones, proceder a leer el archivo.
      // Crea una nueva instancia de FileReader para leer el contenido del archivo.
      const reader = new FileReader();
      // Define el callback 'onload' que se ejecuta cuando el archivo se ha leído completamente.
      reader.onload = () => {
        // Asigna el resultado de la lectura (la imagen en formato base64) a 'imagePreview' para mostrarla.
        this.imagePreview = reader.result;
        // Actualiza el valor del control 'foto' en el formulario con la imagen en base64.
        this.socioForm.patchValue({ foto: reader.result as string });
        // Marca el control 'foto' como 'dirty' (modificado) para que las validaciones y el estado del formulario se actualicen.
        this.socioForm.get('foto')?.markAsDirty();
        // Limpia cualquier error de validación previo que pudiera tener el control 'foto'.
        this.socioForm.get('foto')?.setErrors(null);
      };
      // Define el callback 'onerror' que se ejecuta si ocurre un error durante la lectura del archivo.
      reader.onerror = (error) => {
        // Imprime el error en la consola.
        console.error("Error al leer el archivo:", error);
        // Muestra una alerta al usuario.
        alert("Ocurrió un error al procesar la imagen.");
        // Restaura la previsualización de imagen.
        this.imagePreview = this.isEditMode ? this.socioForm.get('foto')?.value : null;
        // Si no está en modo edición, limpia el valor del campo 'foto'.
        if (!this.isEditMode) {
          this.socioForm.patchValue({ foto: null });
        }
      };
      // Comienza la lectura del archivo y lo convierte a una URL de datos (formato base64).
      reader.readAsDataURL(file);
    } else {
      // Si no se selecciona ningún archivo (por ejemplo, el usuario cancela la selección o borra un archivo previamente seleccionado).
      // Este bloque se ejecuta si 'file' es undefined, pero no si hubo un 'return' por error de validación.
      // Restaura la previsualización de imagen.
      this.imagePreview = this.isEditMode ? this.socioForm.get('foto')?.value : null;
      // Si no está en modo edición (creando un nuevo socio) y se deselecciona el archivo, limpia el campo 'foto' del formulario.
      if (!this.isEditMode) {
        this.socioForm.patchValue({ foto: null });
      }
      // Comentario original: // Opcional: si quieres que la deselección también limpie errores del control 'foto'
      // Esta línea comentada sugiere que también se podrían limpiar los errores del control 'foto' al deseleccionar.
      // this.socioForm.get('foto')?.setErrors(null);
    }
  }
  onSubmit():void{
    if(this.socioForm.invalid){
      this.socioForm.markAllAsTouched();
      return;
    }

    this.isLoading=true;
    this.errorMsg=null;

    const socioData: Socio= this.socioForm.value;
    if(this.isEditMode && this.socioId){
      this.socioService.updateSocio(this.socioId, socioData).subscribe({
        next:(response)=>{
          Swal.fire({
            icon:'success',
            title:'Actualizado!',
            text:response.mensaje || 'Socio actulizado Exitosamente',
            timer: 2000,
            showConfirmButton:false
          }).then(()=>{
            this.router.navigate(['/socios']);
          });
          this.isLoading=false;
        },
        error:(err)=>{
          console.error(err);
          const detailError = err.error?.message || err.error?.error || err.message;

          this.errorMsg=err.mensaje || "Error al actulizar el socio. ";
          Swal.fire({
            icon:'error',
            title:'Error al actulizar',
            text:this.errorMsg !==null?this.errorMsg: 'Ocurrio un error desconocido al actulizar'
          });

          this.isLoading=false;
        }
      });
    }else{
      this.socioService.createSocio(socioData).subscribe({
        next:(response)=>{
          this.isLoading=false;
          Swal.fire({
            icon:'success',
            title:'Socio Creado!',
            text:response.mensaje || 'Socio Creado Exitosamente',
            timer: 2000,
            showConfirmButton:false
          }).then((result)=>{
            this.router.navigate(['/socios']);
          });
        },
        error:(err)=>{
          console.error(err);
          const detailError = err.error?.message || err.error?.error || err.message;

          this.errorMsg=err.mensaje || "Error al Crear el socio. ";
          this.isLoading=false;
          Swal.fire({
            icon:'error',
            title:'Error al Crear',
            text:this.errorMsg !==null?this.errorMsg: 'Ocurrio un error desconocido al Crear'
          });
        }
      });
    }
  }

  get nombreCtrl(){return this.socioForm.get('nombre');}
  get emailCtrl(){return this.socioForm.get('email');}
  get estadoCtrl(){return this.socioForm.get('estado');}
}
