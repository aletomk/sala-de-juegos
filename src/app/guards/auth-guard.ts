import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Supabase } from '../services/supabase';

/**
 * Guard de autenticación funcional (Angular 21).
 * Protege las rutas que requieren que el usuario esté logueado.
 * 
 * Si el usuario tiene sesión activa → permite el acceso a la ruta.
 * Si no tiene sesión → redirige al Login automáticamente.
 * 
 * Se usa la forma funcional (CanActivateFn) que es el estándar
 * de Angular 21, reemplazando las clases que implementaban CanActivate.
 */
export const authGuard: CanActivateFn = async () => {
  const supabaseService = inject(Supabase);
  const router = inject(Router);

  // Obtenemos el usuario actual de Supabase
  const usuario = await supabaseService.getUsuarioActual();

  if (usuario) {
    // Hay sesión activa, permitimos el acceso
    return true;
  }

  // No hay sesión, redirigimos al login
  router.navigate(['/login']);
  return false;
};