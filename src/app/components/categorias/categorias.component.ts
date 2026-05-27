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
    
    // 🌟 PROTECCIÓN TS: Si no es el admin, no abrimos el modal
    if (this.usuario?.email !== 'admin@reviews.com') {
      alert('No tienes permisos para editar contenido');
      return;
    }
    
    this.contenidoEditando = { ...contenido };
  }

  cancelarEdicion(): void {
    this.contenidoEditando = null;
  }

 // src/app/components/categorias/categorias.component.ts

  guardarCambios(): void {
    if (!this.contenidoEditando.titulo.trim() || !this.contenidoEditando.descripcion.trim()) {
      alert('Rellena los campos obligatorios');
      return;
    }

    // Pasamos exactamente el tipo y la plataforma que el usuario tiene seleccionados en la pantalla
    const datosActualizar = {
      id: this.contenidoEditando.id,
      titulo: this.contenidoEditando.titulo,
      descripcion: this.contenidoEditando.descripcion,
      anio: this.contenidoEditando.anio,
      foto: this.contenidoEditando.foto,
      id_plataforma: this.contenidoEditando.id_plataforma, // La plataforma real de la serie en BD
      
      // MANDAMOS ESTOS DOS PARA QUE EL BACKEND SEPA RECARGAR LA VISTA CORRECTA:
      tipo: this.tipoSeleccionado, 
      filtro_plataforma: this.plataformaSeleccionada 
    };

    this.reviewsSvc.modificaContenido(datosActualizar).subscribe((data: any[]) => {
      // Sincronizamos la lista con la respuesta del servidor respetando el filtro
      this.contenidos = data; 
      this.contenidoEditando = null; // Cerramos el modal
    });
  }
}