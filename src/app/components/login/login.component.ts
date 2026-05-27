// src/app/components/login/login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReviewsService } from '../../services/reviews.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms'; // <-- Obligatorio para que funcione [(ngModel)] en standalone
import { CommonModule } from '@angular/common'; // <-- Obligatorio para que funcione *ngIf en standalone

@Component({
  selector: 'app-login',
  standalone: true, // <-- Lo convierte en un componente moderno e independiente
  imports: [FormsModule, CommonModule], // <-- Inyectamos los módulos directamente aquí
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email    = '';
  password = '';
  error    = '';
  modo: 'login' | 'registro' = 'login';   // alterna entre los dos formularios

  // Campos solo para registro
  nombre = '';

  constructor(
    private reviewsSvc: ReviewsService,
    private authSvc: AuthService,
    private router: Router
  ) {}

  iniciarSesion(): void {
    this.error = '';
    this.reviewsSvc.login(this.email, this.password).subscribe((res: any) => {
      if (res.ok) {
        this.authSvc.guardarUsuario(res.usuario);
        this.router.navigate(['/categorias']);
      } else {
        this.error = res.mensaje;
      }
    });
  }

  registrarse(): void {
    this.error = '';
    if (!this.nombre || !this.email || !this.password) {
      this.error = 'Rellena todos los campos';
      return;
    }
    this.reviewsSvc.registro(this.nombre, this.email, this.password).subscribe((res: any) => {
      if (res.ok) {
        this.authSvc.guardarUsuario(res.usuario);
        this.router.navigate(['/categorias']);
      } else {
        this.error = res.mensaje;
      }
    });
  }

  cambiarModo(m: 'login' | 'registro'): void {
    this.modo  = m;
    this.error = '';
  }
}