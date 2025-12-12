export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterResponse {
    message: string | null;
    user: { id: string | number; user_name: string; email: string };
}

export interface RegisterRequest extends LoginRequest {
    username: string;
    fullname: string;
}

export interface LoginResponse extends RegisterResponse {
    token: string;
}

export type AuthResponse = LoginResponse | RegisterResponse;
