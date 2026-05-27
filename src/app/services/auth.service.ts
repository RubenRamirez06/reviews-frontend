// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private KEY = 'reviews_usuario';

  // Guarda el usuario en localStorage al hacer login
  guardarUsuario(usuario: any): void {
    localStorage.setItem(this.KEY, JSON.stringify(usuario));
  }

  // Devuelve el usuario logueado (o null si no hay sesión)
  getUsuario(): any {
    const data = localStorage.getItem(this.KEY);
    return data ? JSON.parse(data) : null;
  }

  // ¿Hay alguien logueado?
  estaLogueado(): boolean {
    return this.getUsuario() !== null;
  }

  // Cierra la sesión
  logout(): void {
    localStorage.removeItem(this.KEY);
  }
}
