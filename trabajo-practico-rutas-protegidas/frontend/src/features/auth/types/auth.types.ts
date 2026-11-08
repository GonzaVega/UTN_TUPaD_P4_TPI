export interface UsuarioAuth {
  id: number
  email: string
  nombre: string
  apellido: string
  celular?: string | null
  roles: string[]
}

export interface LoginFormData {
  username: string
  password: string
}

export interface RegisterFormData {
  nombre: string
  apellido: string
  email: string
  celular?: string
  password: string
}

export interface UsuarioAdminItem {
  id: number
  email: string
  nombre: string
  apellido: string
  celular?: string | null
  created_at: string
  deleted_at?: string | null
  roles: string[]
}

