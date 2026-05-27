import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // <-- Importamos RouterOutlet

@Component({
  selector: 'app-root',
  imports: [RouterOutlet], // <-- Lo inyectamos aquí
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('reviews-frontend');
}