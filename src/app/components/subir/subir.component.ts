// src/app/components/subir/subir.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReviewsService } from '../../services/reviews.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms'; // <-- Obligatorio para vincular formularios [(ngModel)]
import { CommonModule } from '@angular/common'; // <-- Obligatorio para condiciones *ngIf y bucles *ngFor

@Component({
  selector: 'app-subir',
  standalone: true, 
  imports: [FormsModule, CommonModule],
  templateUrl: './subir.component.html',
  styleUrls: ['./subir.component.css']
})
export class SubirComponent implements OnInit {

  usuario: any = null;
  plataformas: any[] = [];
  mensaje = '';
  error   = '';

  // Campos del formulario
  titulo       = '';
  descripcion  = '';
  tipo         = 'pelicula';
  id_plataforma = '';
  anio         = '';
  
  // Guardamos la imagen codificada en esta variable como string base64
  fotoBase64   = ''; 

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
    this.reviewsSvc.getPlataformas().subscribe((data: any[]) => {
      this.plataformas = data;
    });
  }

  // Captura el archivo cargado en el navegador y lo convierte a Base64
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // El resultado ya es la cadena de texto base64 lista para guardar
        this.fotoBase64 = reader.result as string; 
      };
      reader.readAsDataURL(file);
    }
  }

  enviar(): void {
    this.mensaje = '';
    this.error   = '';

    if (!this.titulo || !this.descripcion || !this.id_plataforma) {
      this.error = 'Rellena todos los campos obligatorios';
      return;
    }

    const datos = {
      titulo:        this.titulo,
      descripcion:   this.descripcion,
      tipo:          this.tipo,
      id_plataforma: Number(this.id_plataforma),
      // Si subió foto mandamos la cadena Base64 entera; si no, dejamos la palabra 'default.jpg'
      foto:          this.fotoBase64 || 'default.jpg', 
      anio:          this.anio ? Number(this.anio) : null,
      id_usuario:    this.usuario.id
    };

    this.reviewsSvc.anadeContenido(datos).subscribe(() => {
      this.mensaje = '¡Añadido correctamente! Redirigiendo...';
      setTimeout(() => this.router.navigate(['/categorias']), 1500);
    });
  }

  volver(): void {
    this.router.navigate(['/categorias']);
  }
}