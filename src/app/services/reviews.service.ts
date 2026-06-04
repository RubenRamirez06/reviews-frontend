// src/app/services/reviews.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  // URL de tu servidor en Railway
  private url = 'https://reviews-backend-production-6ce6.up.railway.app/index.php';

  constructor(private http: HttpClient) {}

  private post(objeto: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.url, JSON.stringify(objeto), { headers });
  }

  // ── USUARIOS ────────────────────────────────────────────────────
  login(email: string, password: string): Observable<any> {
    return this.post({ servicio: 'login', email, password });
  }

  registro(nombre: string, email: string, password: string): Observable<any> {
    return this.post({ servicio: 'registro', nombre, email, password });
  }

  // ── PLATAFORMAS ─────────────────────────────────────────────────
  getPlataformas(): Observable<any[]> {
    return this.post({ servicio: 'plataformas' });
  }

  // ── CONTENIDOS ──────────────────────────────────────────────────
  getContenidos(tipo: string, id_plataforma: number): Observable<any[]> {
    return this.post({ servicio: 'contenidos', tipo, id_plataforma });
  }

  getContenidoID(id: number): Observable<any> {
    return this.post({ servicio: 'selContenidoID', id });
  }

  anadeContenido(datos: any): Observable<any[]> {
    return this.post({ servicio: 'anadeContenido', ...datos });
  }

  eliminaContenido(id: number, tipo: string, id_plataforma: number): Observable<any[]> {
    return this.post({ servicio: 'eliminaContenido', id, tipo, id_plataforma });
  }

  modificaContenido(datos: any): Observable<any[]> {
    return this.post({ servicio: 'modificaContenido', ...datos });
  }

  // ── OPINIONES ───────────────────────────────────────────────────
  getOpiniones(id_contenido: number): Observable<any[]> {
    return this.post({ servicio: 'opiniones', id_contenido });
  }

  anadeOpinion(datos: any): Observable<any[]> {
    return this.post({ servicio: 'anadeOpinion', ...datos });
  }

  eliminaOpinion(id: number, id_contenido: number): Observable<any[]> {
    return this.post({ servicio: 'eliminaOpinion', id, id_contenido });
  }

  modificaOpinion(datos: any): Observable<any[]> {
    return this.post({ servicio: 'modificaOpinion', ...datos });
  }
}
