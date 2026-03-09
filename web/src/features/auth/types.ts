export interface LoginCredentials {
  email: string;
  password: string;
}

/** Backend login response. accessToken/refreshToken are optional until JWT is enabled. */
export interface LoginResponse {
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: LoginResponse["user"] | null;
}
