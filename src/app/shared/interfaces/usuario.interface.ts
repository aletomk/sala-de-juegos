/**
 * Interface que representa un usuario de GitHub.
 * Tipifica la respuesta de la API de GitHub para
 * reemplazar el uso de signal<any> en QuienSoy.
 */
export interface UsuarioGitHub {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
}

/**
 * Interface que representa un usuario registrado
 * en la aplicación y guardado en Supabase.
 */
export interface Usuario {
  id?: number;
  authId: string;
  nombre: string;
  apellido: string;
  edad: number;
  email: string;
}

/**
 * Interface que representa la sesión de Supabase Auth.
 * Tipifica el usuario autenticado para reemplazar signal<any>.
 */
export interface UsuarioAuth {
  id: string;
  email: string;
}