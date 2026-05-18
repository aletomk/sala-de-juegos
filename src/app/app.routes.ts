import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { QuienSoy } from './pages/quien-soy/quien-soy';

/**
 * Definición de rutas principales de la aplicación.
 * Cada ruta mapea una URL a un componente específico.
 * El sistema de rutas de Angular renderiza el componente
 * correspondiente dentro del <router-outlet> del app.html
 */
export const routes: Routes = [
  // Ruta raíz: redirige automáticamente a /home
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  
  // Ruta principal con los accesos a los juegos
  { path: 'home', component: Home },
  
  // Ruta de inicio de sesión
  { path: 'login', component: Login },
  
  // Ruta de registro de nuevos usuarios
  { path: 'registro', component: Registro },
  
  // Ruta de presentación del alumno y descripción del juego propio
  { path: 'quien-soy', component: QuienSoy },
  
  // Ruta comodín: cualquier URL no definida redirige a home
  { path: '**', redirectTo: 'home' }
];