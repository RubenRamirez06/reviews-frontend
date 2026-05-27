// src/app/components/detalle/detalle.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewsService } from '../../services/reviews.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  usuario: any = null;
  contenido: any = null;
  opiniones: any[] = [];

  // Formulario nueva opinión
  nuevaValoracion: number = 0;
  nuevoComentario: string = '';
  estrellaHover: number = 0;

  // 🌟 Variables para el estado de edición
  idOpinionEditando: number | null = null;
  comentarioEditado: string = '';
  valoracionEditada: number = 0;
  estrellaEditHover: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reviewsSvc: ReviewsService,
    private authSvc: AuthService
  ) { }

  ngOnInit(): void {
    this.usuario = this.authSvc.getUsuario();
    if (!this.usuario) {
      this.router.navigate(['/login']);
      return;
    }
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarContenido(id);
    this.cargarOpiniones(id);
  }

  cargarContenido(id: number): void {
    this.reviewsSvc.getContenidoID(id).subscribe((data: any) => {
      this.contenido = data;
    });
  }

  cargarOpiniones(id: number): void {
    this.reviewsSvc.getOpiniones(id).subscribe((data: any[]) => {
      this.opiniones = data;
    });
  }

  setHover(n: number): void { this.estrellaHover = n; }
  quitarHover(): void { this.estrellaHover = 0; }
  seleccionarEstrella(n: number): void { this.nuevaValoracion = n; }

  // 🌟 Helpers de estrellas para el modo edición
  setEditHover(n: number): void { this.estrellaEditHover = n; }
  quitarEditHover(): void { this.estrellaEditHover = 0; }
  seleccionarEditEstrella(n: number): void { this.valoracionEditada = n; }

  enviarOpinion(): void {
    if (this.nuevaValoracion === 0) { alert('Selecciona una valoración'); return; }
    if (!this.nuevoComentario.trim()) { alert('Escribe un comentario'); return; }

    const datos = {
      id_contenido: this.contenido.id,
      id_usuario: this.usuario.id,
      valoracion: this.nuevaValoracion,
      comentario: this.nuevoComentario
    };

    this.reviewsSvc.anadeOpinion(datos).subscribe((data: any[]) => {
      this.opiniones = data;
      this.nuevaValoracion = 0;
      this.nuevoComentario = '';
      this.cargarContenido(this.contenido.id);
    });
  }

  eliminarOpinion(opinion: any): void {
    if (!confirm('¿Eliminar esta opinión?')) return;
    this.reviewsSvc.eliminaOpinion(opinion.id, this.contenido.id).subscribe((data: any[]) => {
      this.opiniones = data;
      this.cargarContenido(this.contenido.id);
    });
  }

  // 🌟 Funciones nuevas para gestionar la edición en caliente
  activarEdicion(opinion: any): void {
    this.idOpinionEditando = opinion.id;
    this.comentarioEditado = opinion.comentario;
    this.valoracionEditada = Number(opinion.valoracion);
  }

  cancelarEdicion(): void {
    this.idOpinionEditando = null;
    this.comentarioEditado = '';
    this.valoracionEditada = 0;
  }

  guardarOpinionEditada(): void {
    if (this.valoracionEditada === 0) { alert('Selecciona una valoración'); return; }
    if (!this.comentarioEditado.trim()) { alert('El comentario no puede estar vacío'); return; }

    const datos = {
      id: this.idOpinionEditando,
      id_contenido: this.contenido.id,
      valoracion: this.valoracionEditada,
      comentario: this.comentarioEditado
    };

    this.reviewsSvc.modificaOpinion(datos).subscribe(() => {
      // 1. Cerramos el formulario de edición en la pantalla
      this.idOpinionEditando = null;

      // 2. 🌟 ¡LA CLAVE! Volvemos a pedir al servidor la lista completa de opiniones actualizada
      this.cargarOpiniones(this.contenido.id);

      // 3. Volvemos a calcular la media de estrellas por si cambió la puntuación
      this.cargarContenido(this.contenido.id);
    });
  }

  volver(): void {
    this.router.navigate(['/categorias']);
  }

  rangoEstrellas(): number[] { return [1, 2, 3, 4, 5]; }

  colorEstrella(n: number): string {
    const val = this.estrellaHover || this.nuevaValoracion;
    return n <= val ? '#f5c518' : '#444';
  }

  // 🌟 Color de estrellas dinámico para el editor
  colorEstrellaEditor(n: number): string {
    const val = this.estrellaEditHover || this.valoracionEditada;
    return n <= val ? '#f5c518' : '#444';
  }

  colorEstrellaMedia(n: number, media: number): string {
    return n <= media ? '#f5c518' : '#444';
  }
}