/**
 * Interfaces para los resultados de los juegos.
 * Se usan para tipar los datos que se guardan en Supabase
 */

/**
 * Interface para el resultado del juego Ahorcado
 * que se guarda en la base de datos.
 */
export interface ResultadoAhorcado {
  usuarioEmail: string;
  palabra: string;
  letrasUsadas: number;
  gano: boolean;
  tiempoSegundos: number;
  fecha?: string;
}

/**
 * Interface para el resultado del juego Mayor o Menor
 * que se guarda en la base de datos.
 */
export interface ResultadoMayorMenor {
  usuarioEmail: string;
  cartasAcertadas: number;
  fecha?: string;
}

/**
 * Interface para los mensajes del chat en tiempo real.
 */
export interface MensajeChat {
  id?: number;
  usuarioEmail: string;
  mensaje: string;
  created_at?: string;
}