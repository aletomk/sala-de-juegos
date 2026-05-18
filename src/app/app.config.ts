import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

/**
 * Configuración global de la aplicación Angular.
 * En Angular 21 standalone no existen NgModules,
 * por lo que los providers globales se registran acá.
 * 
 * provideRouter → habilita el sistema de rutas con las rutas definidas
 * provideHttpClient → habilita el cliente HTTP para consumir APIs externas
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
};