import { User } from './user';

export interface BaseApiResponse {
  success: boolean;
  message?: string;
}

export interface AuthResponse extends BaseApiResponse {
  data?: {
    user: User;
  };
}

export interface OtpSendRequest {
  phoneNumber: string;
}

export interface OtpVerifyRequest {
  phoneNumber: string;
  otp: string;
}

export interface RegisterRequest {
  phoneNumber: string;
  username: string;
  name: string;
  password?: string;
}

export interface LoginRequest {
  identifier: string; // Phone number or username
  password?: string;
}
export interface CheckUserResponse extends BaseApiResponse {
  exists: boolean;
}
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
export type RootStackParamList = {
  Login: undefined;
  Password: { identifier: string };
  Signup: undefined;
  OtpVerification: { phoneNumber: string };
  ProfileOnboarding: { phoneNumber: string };
  ProfileSetup: { user: User };
  Home: undefined;
};
