import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { QuienSoy } from './pages/quien-soy/quien-soy';
import { Login } from './features/auth/login/login';
import { Registro } from './features/auth/registro/registro';
import { authGuard } from './shared/guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Rutas públicas
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'quien-soy', component: QuienSoy },

  // Rutas privadas
  { path: 'ahorcado', canActivate: [authGuard], loadComponent: () => import('./features/juegos/ahorcado/ahorcado').then(m => m.Ahorcado) },
  { path: 'mayor-menor', canActivate: [authGuard], loadComponent: () => import('./features/juegos/mayor-menor/mayor-menor').then(m => m.MayorMenor) },
  { path: 'chat', canActivate: [authGuard], loadComponent: () => import('./features/chat/chat').then(m => m.Chat) },
  { path: 'logo-quiz', canActivate: [authGuard], loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'resultados', canActivate: [authGuard], loadComponent: () => import('./pages/home/home').then(m => m.Home) },

  { path: '**', redirectTo: 'home' }
];