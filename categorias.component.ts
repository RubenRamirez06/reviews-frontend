// src/app/components/categorias/categorias.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReviewsService } from '../../services/reviews.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; // <-- 1. REVISA QUE ESTA LÍNEA ESTÉ AQUÍ

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- 2. OBLIGATORIO AGREGAR FormsModule AQUÍ
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {

  usuario: any = null;
  plataformas: any[] = [];
  contenidos: any[] = [];

  tipoSeleccionado: string = 'serie';       
  plataformaSeleccionada: number = 0;       

  // Variable para el modal flotante de edición
  contenidoEditando: any = null;
  fotoFile: File | null = null; // Archivo de imagen seleccionado

  constructor(
    private reviewsSvc: ReviewsService,
    private authSvc: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuario = this.authSvc.getUsuario();
    if (!this.usuario) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarPlataformas();
    this.cargarContenidos();
  }

  cargarPlataformas(): void {
    this.reviewsSvc.getPlataformas().subscribe((data: any[]) => {
      this.plataformas = data;
    });
  }

  cargarContenidos(): void {
    this.reviewsSvc.getContenidos(this.tipoSeleccionado, this.plataformaSeleccionada)
      .subscribe((data: any[]) => {
        this.contenidos = data;
      });
  }

  seleccionarTipo(tipo: string): void {
    this.tipoSeleccionado = tipo;
    this.plataformaSeleccionada = 0;
    this.cargarContenidos();
  }

  filtrarPlataforma(id: number): void {
    this.plataformaSeleccionada = id;
    this.cargarContenidos();
  }

  verDetalle(id: number): void {
    this.router.navigate(['/detalle', id]);
  }
  // Dentro de tu clase CategoriasComponent
onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.fotoFile = file; // Guardamos el File para subirlo a Cloudinary
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.contenidoEditando.foto = e.target.result; // Solo para preview
    };
    reader.readAsDataURL(file);
  }
}

  irASubir(): void {
    this.router.navigate(['/subir']);
  }

  logout(): void {
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  estrellas(media: number): number[] {
    return [1, 2, 3, 4, 5];
  }

  // Métodos de acción para los botones nuevos
  // ── ACCIÓN BORRAR ──
  borrarContenido(event: Event, contenido: any): void {
    event.stopPropagation();
    
    // 🌟 PROTECCIÓN TS: Si no es el admin, bloqueamos el proceso
    if (this.usuario?.email !== 'admin@reviews.com') {
      alert('No tienes permisos para realizar esta acción');
      return;
    }
    
    if (confirm(`¿Seguro que quieres eliminar "${contenido.titulo}"?`)) {
      this.reviewsSvc.eliminaContenido(contenido.id, this.tipoSeleccionado, this.plataformaSeleccionada)
        .subscribe((data: any[]) => {
          this.contenidos = data;
        });
    }
  }

  // ── ACCIÓN MODIFICAR ──
  activarEdicion(event: Event, contenido: any): void {
    event.stopPropagation();
    
    if (this.usuario?.email !== 'admin@reviews.com') {
      alert('No tienes permisos para editar contenido');
      return;
    }
    
    this.contenidoEditando = { ...contenido };
    this.fotoFile = null; // Reseteamos el archivo al abrir el modal
  }

  cancelarEdicion(): void {
    this.contenidoEditando = null;
  }

 // src/app/components/categorias/categorias.component.ts

  async guardarCambios(): Promise<void> {
    if (!this.contenidoEditando.titulo.trim() || !this.contenidoEditando.descripcion.trim()) {
      alert('Rellena los campos obligatorios');
      return;
    }

    let fotoFinal = this.contenidoEditando.foto;

    // Si hay imagen nueva, la subimos a Cloudinary y usamos la URL
    if (this.fotoFile) {
      try {
        fotoFinal = await this.reviewsSvc.subirImagenCloudinary(this.fotoFile);
      } catch (err) {
        alert('Error al subir la imagen. Inténtalo de nuevo.');
        return;
      }
    }

    const datosActualizar = {
      id: this.contenidoEditando.id,
      titulo: this.contenidoEditando.titulo,
      descripcion: this.contenidoEditando.descripcion,
      anio: this.contenidoEditando.anio,
      foto: fotoFinal,
      id_plataforma: this.contenidoEditando.id_plataforma,
      tipo: this.tipoSeleccionado, 
      filtro_plataforma: this.plataformaSeleccionada 
    };

    this.reviewsSvc.modificaContenido(datosActualizar).subscribe((data: any[]) => {
      this.contenidos = data; 
      this.contenidoEditando = null;
      this.fotoFile = null;
    });
  }
}
