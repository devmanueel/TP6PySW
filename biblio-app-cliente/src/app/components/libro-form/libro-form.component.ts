import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LibroService } from '../../services/libro.service';
import Swal from 'sweetalert2';
import { CommonModule, NgClass } from '@angular/common';


@Component({
  selector: 'app-libro-form',
  imports: [CommonModule, RouterLink, NgClass, FormsModule, ReactiveFormsModule],
  templateUrl: './libro-form.component.html',
  styleUrls: ['./libro-form.component.css']
})
export class LibroFormComponent implements OnInit {
  libroForm: FormGroup;
  isEditMode = false;
  libroId: string | null = null;
  isLoading = false;
  errorMsg: string | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  generos = ['Novela', 'Ciencia Ficción', 'Historia', 'Educativo', 'Fantasía', 'Biografía'];
  formatos = ['Físico', 'PDF', 'ePub', 'Audiolibro'];

  constructor(
    private fb: FormBuilder,
    private libroService: LibroService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.libroForm = this.fb.group({
      isbn: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(13)]],
      titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      autor: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      anioPublicacion: ['', [
        Validators.required,
        Validators.min(1450),
        Validators.max(new Date().getFullYear())
      ]],
      genero: ['', Validators.required],
      estado: ['Disponible', Validators.required],
      formato: ['', Validators.required],
      editorial: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      imagenPortada: [null]
    });
  }

  ngOnInit(): void {
    this.libroId = this.route.snapshot.paramMap.get('id');
    if (this.libroId) {
      this.isEditMode = true;
      this.loadLibroData();
    }
  }

  loadLibroData(): void {
    this.isLoading = true;
    this.libroService.getLibro(this.libroId!).subscribe({
      next: (libro) => {
        this.libroForm.patchValue(libro);
        if (libro.imagenPortada) {
          this.imagePreview = libro.imagenPortada;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = err.message;
        this.isLoading = false;
      }
    });
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
        this.imagePreview = this.isEditMode ? this.libroForm.get('foto')?.value : null;
        // Si no está en modo edición y hay un error, limpia el valor del campo 'foto' en el formulario.
        if (!this.isEditMode) {
          this.libroForm.patchValue({ foto: null });
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
        this.imagePreview = this.isEditMode ? this.libroForm.get('foto')?.value : null;
        // Si no está en modo edición y hay un error, limpia el valor del campo 'foto' en el formulario.
        if (!this.isEditMode) {
          this.libroForm.patchValue({ foto: null });
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
        this.libroForm.patchValue({ foto: reader.result as string });
        // Marca el control 'foto' como 'dirty' (modificado) para que las validaciones y el estado del formulario se actualicen.
        this.libroForm.get('foto')?.markAsDirty();
        // Limpia cualquier error de validación previo que pudiera tener el control 'foto'.
        this.libroForm.get('foto')?.setErrors(null);
      };
      // Define el callback 'onerror' que se ejecuta si ocurre un error durante la lectura del archivo.
      reader.onerror = (error) => {
        // Imprime el error en la consola.
        console.error("Error al leer el archivo:", error);
        // Muestra una alerta al usuario.
        alert("Ocurrió un error al procesar la imagen.");
        // Restaura la previsualización de imagen.
        this.imagePreview = this.isEditMode ? this.libroForm.get('foto')?.value : null;
        // Si no está en modo edición, limpia el valor del campo 'foto'.
        if (!this.isEditMode) {
          this.libroForm.patchValue({ foto: null });
        }
      };
      // Comienza la lectura del archivo y lo convierte a una URL de datos (formato base64).
      reader.readAsDataURL(file);
    } else {
      // Si no se selecciona ningún archivo (por ejemplo, el usuario cancela la selección o borra un archivo previamente seleccionado).
      // Este bloque se ejecuta si 'file' es undefined, pero no si hubo un 'return' por error de validación.
      // Restaura la previsualización de imagen.
      this.imagePreview = this.isEditMode ? this.libroForm.get('foto')?.value : null;
      // Si no está en modo edición (creando un nuevo socio) y se deselecciona el archivo, limpia el campo 'foto' del formulario.
      if (!this.isEditMode) {
        this.libroForm.patchValue({ foto: null });
      }
      // Comentario original: // Opcional: si quieres que la deselección también limpie errores del control 'foto'
      // Esta línea comentada sugiere que también se podrían limpiar los errores del control 'foto' al deseleccionar.
      // this.socioForm.get('foto')?.setErrors(null);
    }
  }

  onSubmit(): void {
    if (this.libroForm.invalid) {
      this.libroForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMsg = null;

    const formData = new FormData();
    Object.keys(this.libroForm.value).forEach(key => {
      if (key === 'imagenPortada' && typeof this.libroForm.value[key] === 'string') {
        // Si es edición y no se cambió la imagen, no la enviamos
        if (this.isEditMode && !this.libroForm.get('imagenPortada')?.dirty) return;
      }
      formData.append(key, this.libroForm.value[key]);
    });

    if (this.isEditMode && this.libroId) {
      this.libroService.updateLibro(this.libroId, formData).subscribe({
        next: (response) => {
          this.showSuccess('Libro actualizado correctamente');
          this.router.navigate(['/libros']);
        },
        error: (err) => {
          this.handleError(err);
        }
      });
    } else {
      this.libroService.createLibro(formData).subscribe({
        next: (response) => {
          this.showSuccess('Libro creado correctamente');
          this.router.navigate(['/libros']);
        },
        error: (err) => {
          this.handleError(err);
        }
      });
    }
  }

  private showSuccess(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: message,
      timer: 2000,
      showConfirmButton: false
    });
    this.isLoading = false;
  }

  private handleError(err: any): void {
    this.errorMsg = err.message || 'Ocurrió un error al procesar la solicitud';
    this.isLoading = false;
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: this.errorMsg ?? 'Ha ocurrido un error inesperado'
    });
  }

  // Getters para acceder fácilmente a los controles del formulario
  get isbnCtrl() { return this.libroForm.get('isbn'); }
  get tituloCtrl() { return this.libroForm.get('titulo'); }
  get autorCtrl() { return this.libroForm.get('autor'); }
  get anioCtrl() { return this.libroForm.get('anioPublicacion'); }
  get generoCtrl() { return this.libroForm.get('genero'); }
  get formatoCtrl() { return this.libroForm.get('formato'); }
  get editorialCtrl() { return this.libroForm.get('editorial'); }
}