import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { DetalleComponent } from './components/detalle/detalle.component';
import { SubirComponent } from './components/subir/subir.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'categorias', component: CategoriasComponent },
  { path: 'detalle/:id', component: DetalleComponent },
  { path: 'subir', component: SubirComponent },
  { path: '**', redirectTo: 'login' }
];