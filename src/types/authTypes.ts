export interface SignupPayload {
    email: string;
    password: string;
    confirmPassword: string;
    username: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
}

export interface PasswordRequestResponse {
    email: string;
    resetToken: string;
}

export interface PasswordResetPayload {
    password: string;
    confirmPassword: string;
    resetToken: string;
}