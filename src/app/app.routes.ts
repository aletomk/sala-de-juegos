import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { QuienSoy } from './pages/quien-soy/quien-soy';
import { authGuard } from './guards/auth-guard';

/**
 * Definición de rutas principales de la aplicación.
 * 
 * Sprint 1: Rutas básicas sin restricciones de acceso.
 * Sprint 2: Se agregaron guards de ruta con canActivate.
 * Las rutas de juegos y resultados requieren autenticación.
 * Login y Registro son rutas públicas accesibles sin sesión.
 * 
 * canActivate: [authGuard] → intercepta la navegación y verifica
 * si hay una sesión activa antes de renderizar el componente.
 * Si no hay sesión redirige automáticamente al Login.
 */
export const routes: Routes = [
  // Ruta raíz: redirige automáticamente a /home
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Rutas públicas - accesibles sin autenticación
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'quien-soy', component: QuienSoy },

  // Rutas privadas - requieren autenticación
  // Los componentes de juegos se agregan en Sprint 3 y 4
  // Por ahora apuntan a Home como placeholder
  { path: 'ahorcado', canActivate: [authGuard], loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'mayor-menor', canActivate: [authGuard], loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'preguntados', canActivate: [authGuard], loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'logo-quiz', canActivate: [authGuard], loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'resultados', canActivate: [authGuard], loadComponent: () => import('./pages/home/home').then(m => m.Home) },

  // Ruta comodín: cualquier URL no definida redirige a home
  { path: '**', redirectTo: 'home' }
];