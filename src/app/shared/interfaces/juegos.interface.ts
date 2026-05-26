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

/**
 * Interface para el resultado del juego Preguntados.
 */
export interface ResultadoPreguntados {
  usuarioEmail: string;
  preguntasCorrectas: number;
  totalPreguntas: number;
  fecha?: string;
}

/**
 * Interface para el resultado del Logo Quiz Automotriz.
 */
export interface ResultadoLogoQuiz {
  usuarioEmail: string;
  puntaje: number;
  nivelAlcanzado: string;
  fecha?: string;
}

/**
 * Interface para una pregunta de la API de Preguntados.
 */
export interface PreguntaTrivia {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  category: string;
  opciones?: string[];
}