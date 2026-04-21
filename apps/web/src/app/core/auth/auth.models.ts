export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: 'ADMIN' | 'OPERATOR' | 'SUPPORT' | 'CUSTOMER';
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface BootstrapPayload extends LoginPayload {
  displayName: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}
