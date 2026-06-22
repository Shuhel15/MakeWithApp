import { api, mockRequest, USE_MOCK_API, setToken, clearToken } from './api';
import {
  BaseApiResponse,
  AuthResponse,
  OtpSendRequest,
  OtpVerifyRequest,
  RegisterRequest,
  LoginRequest,
  CheckUserResponse,
} from '../types/auth';

// Helper to catch errors and standardize them
const handleApiError = (error: any): string => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  return error.message || 'An unexpected error occurred.';
};

export const authService = {
  /**
   * Check if a phone number or username is registered.
   */
  async checkUserExists(identifier: string): Promise<boolean> {
    try {
      if (USE_MOCK_API) {
        const response = await mockRequest('POST', '/auth/check-exists', { identifier });
        return response.data.exists;
      }
      
      // For real API, we can either call /auth/check-exists if supported
      // or check username availability, or try to run a lightweight endpoint.
      // Since it is not in the default backend code, we fallback to true
      // or call a custom backend route if developers deploy it.
      const response = await api.post<CheckUserResponse>('/auth/check-exists', { identifier });
      return response.data.exists;
    } catch (error) {
      if (USE_MOCK_API) {
        throw new Error(handleApiError(error));
      }
      // If endpoint doesn't exist, we return true to let the user proceed
      // to password input, where /login will validate credentials.
      console.warn('Real API: /auth/check-exists not found, proceeding directly.');
      return true;
    }
  },

  /**
   * Check if a username is available (real-time validation)
   */
  async checkUsernameAvailable(username: string): Promise<boolean> {
    try {
      if (USE_MOCK_API) {
        const response = await mockRequest('POST', '/auth/check-username', { username });
        return response.data.available;
      }
      // Since backend registers via completeRegistration, username is checked there.
      // We check if username is available. If backend doesn't support check-username,
      // we return true as fallback.
      const response = await api.post<{ success: boolean; available: boolean }>('/auth/check-username', { username });
      return response.data.available;
    } catch (error) {
      if (USE_MOCK_API) {
        throw new Error(handleApiError(error));
      }
      return true;
    }
  },

  /**
   * Step 1: Send OTP to phone number
   */
  async sendOtp(phoneNumber: string): Promise<BaseApiResponse> {
    try {
      if (USE_MOCK_API) {
        const response = await mockRequest('POST', '/auth/send-otp', { phoneNumber });
        return response.data;
      }
      const response = await api.post<BaseApiResponse>('/auth/send-otp', { phoneNumber });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Step 2: Verify OTP
   */
  async verifyOtp(phoneNumber: string, otp: string): Promise<BaseApiResponse> {
    try {
      if (USE_MOCK_API) {
        const response = await mockRequest('POST', '/auth/verify-otp', { phoneNumber, otp });
        return response.data;
      }
      const response = await api.post<BaseApiResponse>('/auth/verify-otp', { phoneNumber, otp });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Step 3: Complete registration (create user)
   */
  async completeRegistration(payload: RegisterRequest): Promise<AuthResponse> {
    try {
      if (USE_MOCK_API) {
        const response = await mockRequest('POST', '/auth/complete-registration', payload);
        return response.data;
      }
      // Note: Backend endpoint is complete-registration
      const response = await api.post<AuthResponse>('/auth/complete-registration', payload);
      // Backend sets a token cookie, but for React Native we save the token
      // returned or in headers if configured. Let's assume response has token or we read cookie headers.
      // In mobile, we check if body has data.token or similar, otherwise set a dummy/stored token.
      if (response.data && response.data.token) {
        await setToken(response.data.token);
      }
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Resend OTP
   */
  async resendOtp(phoneNumber: string): Promise<BaseApiResponse> {
    try {
      if (USE_MOCK_API) {
        const response = await mockRequest('POST', '/auth/resend-otp', { phoneNumber });
        return response.data;
      }
      const response = await api.post<BaseApiResponse>('/auth/resend-otp', { phoneNumber });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Login (Identifier + Password)
   */
  async login(payload: LoginRequest): Promise<AuthResponse> {
    try {
      if (USE_MOCK_API) {
        const response = await mockRequest('POST', '/auth/login', payload);
        return response.data;
      }
      const response = await api.post<AuthResponse>('/auth/login', payload);
      if (response.data && response.data.token) {
        await setToken(response.data.token);
      }
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Logout user
   */
  async logout(): Promise<BaseApiResponse> {
    try {
      if (USE_MOCK_API) {
        const response = await mockRequest('POST', '/auth/logout', {});
        return response.data;
      }
      const response = await api.post<BaseApiResponse>('/auth/logout');
      await clearToken();
      return response.data;
    } catch (error) {
      await clearToken(); // Make sure to clear token anyway
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Fetch current user profile
   */
  async getMe(): Promise<AuthResponse> {
    try {
      if (USE_MOCK_API) {
        const response = await mockRequest('GET', '/auth/me', {});
        return response.data;
      }
      const response = await api.get<AuthResponse>('/auth/me');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
