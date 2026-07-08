import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@/features/auth/types'

export const authApi = {
  register: async (payload: RegisterRequest): Promise<RegisterResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Generamos un ID único basado en el email para que no comparta datos
    const mockId = `user_${btoa(payload.email).substring(0, 8)}`;
    const userData = {
      id: mockId,
      email: payload.email,
      name: 'Usuario Mock',
    };

    // Guardamos en localStorage para que getLatestTransactions() lo encuentre bajo la llave 'user'
    localStorage.setItem('user', JSON.stringify(userData));

    return {
      token: `fake-jwt-${mockId}`,
      refresh_token: 'fake-refresh-token-ovniwallet',
      user: userData,
    } as unknown as RegisterResponse
  },

  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    // CORRECCIÓN CLAVE: El ID ya no es estático. Ahora cambia según el correo ingresado.
    // Si entras con juan@mail.com tendrá un ID, y si entras con pedro@mail.com tendrá otro.
    const mockId = `user_${btoa(credentials.email).substring(0, 8)}`;
    const userData = {
      id: mockId,
      email: credentials.email,
      name: credentials.email.split('@')[0], // Nombre dinámico basado en su correo
    };

    // Forzamos la actualización de la sesión en el almacenamiento para nuestros mocks
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Sincronizamos la llave global de la ventana inmediatamente al entrar
    (window as any).__ovniUserKey = credentials.email;

    return {
      token: `fake-jwt-${mockId}`,
      refresh_token: 'fake-refresh-token-ovniwallet',
      user: userData,
    } as unknown as LoginResponse
  },

  refresh: async (refreshToken: string): Promise<LoginResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      token: 'fake-jwt-token-ovniwallet',
      refresh_token: refreshToken,
      user: {
        id: 'user-mock-123',
        email: 'santiago@ovni.com',
        name: 'Santiago Dev',
      },
    } as unknown as LoginResponse
  },

  logout: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    
    // CORRECCIÓN CLAVE PARA EL CIERRE DE SESIÓN:
    // 1. Borramos la sesión del almacenamiento
    localStorage.removeItem('user');
    localStorage.removeItem('auth_user');
    
    // 2. Destruimos la llave mágica de la ventana para que el siguiente usuario empiece de cero
    delete (window as any).__ovniUserKey;
  },
}