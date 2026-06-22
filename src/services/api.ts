import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Standard local backend development URL fallbacks
// For Android emulator: 10.0.2.2 is mapped to host machine's localhost
const DEFAULT_URL = process.env.EXPO_PUBLIC_API_URL || 
                    process.env.REACT_NATIVE_API_URL || 
                    'http://10.81.206.236:5000';

const BASE_URL = DEFAULT_URL;
const TOKEN_KEY = 'auth_token_makewith';

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure JWT token loading from SecureStore (or localStorage on web)
const getToken = async (): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Error reading token', error);
    return null;
  }
};

export const setToken = async (token: string): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
  } catch (error) {
    console.error('Error setting token', error);
  }
};

export const clearToken = async (): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem(TOKEN_KEY);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  } catch (error) {
    console.error('Error clearing token', error);
  }
};

// Request interceptor to attach JWT token
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// MOCK API FLAG
// Set to true to run everything using the client-side mock service database
export const USE_MOCK_API = false;

// Mock database to simulate server-side state
interface MockUser {
  id: string;
  username: string;
  name: string;
  phoneNumber: string;
  role: string;
  passwordHash: string;
}

const mockUsers: MockUser[] = [
  {
    id: 'user_01',
    username: '@shubham',
    name: 'Shubham Singh',
    phoneNumber: '+919876543210',
    role: 'user',
    passwordHash: 'password123',
  },
  {
    id: 'user_02',
    username: '@makewither',
    name: 'MakeWith Developer',
    phoneNumber: '+15551234567',
    role: 'admin',
    passwordHash: 'adminpassword',
  },
];

let currentUserSession: MockUser | null = null;
const activeOtps: Record<string, { otp: string; expiresAt: number; attempts: number; isVerified: boolean }> = {};

// Simple client-side mock router to simulate server endpoints
export const mockRequest = async (method: string, path: string, data: any): Promise<any> => {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  console.log(`[Mock API] ${method} ${path}`, data);

  // Sign up flow
  // 1. send-otp
  if (path === '/auth/send-otp') {
    const { phoneNumber } = data;
    if (!phoneNumber) {
      throw { response: { status: 400, data: { message: 'Phone number is required.' } } };
    }
    const e164Regex = /^\+[1-9]\d{6,14}$/;
    if (!e164Regex.test(phoneNumber)) {
      throw { response: { status: 400, data: { message: 'Phone number must be in E.164 format (e.g. +919876543210).' } } };
    }
    const existing = mockUsers.find((u) => u.phoneNumber === phoneNumber);
    if (existing) {
      throw { response: { status: 400, data: { message: 'Phone number is already registered. Please log in.' } } };
    }

    // Generate simulated OTP (always '123456' for simplicity, but we track expiration)
    const code = '123456';
    activeOtps[phoneNumber] = {
      otp: code,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      attempts: 0,
      isVerified: false,
    };

    return {
      status: 200,
      data: {
        success: true,
        message: `OTP sent to ${phoneNumber.slice(0, 3)}****${phoneNumber.slice(-3)}. (Code is 123456)`,
      },
    };
  }

  // 2. verify-otp
  if (path === '/auth/verify-otp') {
    const { phoneNumber, otp } = data;
    if (!phoneNumber || !otp) {
      throw { response: { status: 400, data: { message: 'Phone number and OTP are required.' } } };
    }
    const record = activeOtps[phoneNumber];
    if (!record) {
      throw { response: { status: 404, data: { message: 'OTP expired or not found. Please request a new one.' } } };
    }
    if (Date.now() > record.expiresAt) {
      delete activeOtps[phoneNumber];
      throw { response: { status: 410, data: { message: 'OTP has expired. Please request a new one.' } } };
    }
    if (record.attempts >= 3) {
      delete activeOtps[phoneNumber];
      throw { response: { status: 429, data: { message: 'Too many incorrect OTP attempts. Please request a new OTP.' } } };
    }
    if (otp !== record.otp) {
      record.attempts += 1;
      throw { response: { status: 401, data: { message: `Incorrect OTP. ${3 - record.attempts} attempt(s) remaining.` } } };
    }

    record.isVerified = true;
    return {
      status: 200,
      data: {
        success: true,
        message: 'OTP verified successfully. Proceed to complete registration.',
      },
    };
  }

  // 3. resend-otp
  if (path === '/auth/resend-otp') {
    const { phoneNumber } = data;
    if (!phoneNumber) {
      throw { response: { status: 400, data: { message: 'Phone number is required.' } } };
    }
    const existing = mockUsers.find((u) => u.phoneNumber === phoneNumber);
    if (existing) {
      throw { response: { status: 409, data: { message: 'This phone number is already registered. Please log in.' } } };
    }

    const code = '123456';
    activeOtps[phoneNumber] = {
      otp: code,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0,
      isVerified: false,
    };

    return {
      status: 200,
      data: {
        success: true,
        message: `A new OTP has been sent to ${phoneNumber.slice(0, 3)}****${phoneNumber.slice(-3)}. (Code is 123456)`,
      },
    };
  }

  // 4. complete-registration
  if (path === '/auth/complete-registration') {
    const { phoneNumber, username, name, password } = data;
    if (!phoneNumber || !username || !name || !password) {
      throw { response: { status: 400, data: { message: 'Phone number, username, full name, and password are all required.' } } };
    }
    if (password.length < 8) {
      throw { response: { status: 400, data: { message: 'Password must be at least 8 characters.' } } };
    }

    const record = activeOtps[phoneNumber];
    if (!record || !record.isVerified) {
      throw { response: { status: 403, data: { message: 'Phone number not verified. Please complete OTP verification first.' } } };
    }

    const cleanUsername = username.replace(/^@/, '').toLowerCase().trim();
    const existingUser = mockUsers.find((u) => u.username === `@${cleanUsername}`);
    if (existingUser) {
      throw { response: { status: 409, data: { message: 'This username is already taken. Please choose another.' } } };
    }

    const newUser: MockUser = {
      id: `user_${Date.now()}`,
      username: `@${cleanUsername}`,
      name: name.trim(),
      phoneNumber,
      role: 'user',
      passwordHash: password,
    };

    mockUsers.push(newUser);
    delete activeOtps[phoneNumber];
    currentUserSession = newUser;
    await setToken('mock_jwt_token_' + newUser.id);

    return {
      status: 201,
      data: {
        success: true,
        message: 'Account created successfully. Welcome to Makewith! 🎉',
        data: {
          user: {
            id: newUser.id,
            username: newUser.username,
            name: newUser.name,
            phoneNumber: newUser.phoneNumber,
            role: newUser.role,
          },
        },
      },
    };
  }

  // 5. login
  if (path === '/auth/login') {
    const { identifier, password } = data;
    if (!identifier || !password) {
      throw { response: { status: 400, data: { message: 'Identifier and password are required.' } } };
    }

    const isPhone = /^\+[1-9]\d{6,14}$/.test(identifier);
    let userFound: MockUser | undefined;

    if (isPhone) {
      userFound = mockUsers.find((u) => u.phoneNumber === identifier);
    } else {
      const cleanUsername = identifier.replace(/^@/, '').toLowerCase().trim();
      userFound = mockUsers.find((u) => u.username.replace(/^@/, '') === cleanUsername);
    }

    if (!userFound || userFound.passwordHash !== password) {
      throw { response: { status: 401, data: { message: 'Invalid credentials.' } } };
    }

    currentUserSession = userFound;
    await setToken('mock_jwt_token_' + userFound.id);

    return {
      status: 200,
      data: {
        success: true,
        message: 'Logged in successfully.',
        data: {
          user: {
            id: userFound.id,
            username: userFound.username,
            name: userFound.name,
            phoneNumber: userFound.phoneNumber,
            role: userFound.role,
          },
        },
      },
    };
  }

  // 6. logout
  if (path === '/auth/logout') {
    currentUserSession = null;
    await clearToken();
    return {
      status: 200,
      data: {
        success: true,
        message: 'Logged out successfully.',
      },
    };
  }

  // 7. me
  if (path === '/auth/me') {
    if (!currentUserSession) {
      throw { response: { status: 404, data: { message: 'User not found.' } } };
    }
    return {
      status: 200,
      data: {
        success: true,
        data: {
          user: {
            id: currentUserSession.id,
            username: currentUserSession.username,
            name: currentUserSession.name,
            phoneNumber: currentUserSession.phoneNumber,
            role: currentUserSession.role,
          },
        },
      },
    };
  }

  // 8. Custom Existence Check (simulate checking for Login Step 1)
  if (path === '/auth/check-exists') {
    const { identifier } = data;
    if (!identifier) {
      throw { response: { status: 400, data: { message: 'Identifier is required.' } } };
    }

    const isPhone = /^\+[1-9]\d{6,14}$/.test(identifier);
    let exists = false;

    if (isPhone) {
      exists = mockUsers.some((u) => u.phoneNumber === identifier);
    } else {
      const cleanUsername = identifier.replace(/^@/, '').toLowerCase().trim();
      exists = mockUsers.some((u) => u.username.replace(/^@/, '') === cleanUsername);
    }

    return {
      status: 200,
      data: {
        success: true,
        exists,
      },
    };
  }

  // 9. Custom Username availability check (Profile Onboarding Screen)
  if (path === '/auth/check-username') {
    const { username } = data;
    if (!username) {
      throw { response: { status: 400, data: { message: 'Username is required.' } } };
    }
    const cleanUsername = username.replace(/^@/, '').toLowerCase().trim();
    const isTaken = mockUsers.some((u) => u.username.replace(/^@/, '') === cleanUsername);

    return {
      status: 200,
      data: {
        success: true,
        available: !isTaken,
      },
    };
  }

  throw { response: { status: 404, data: { message: 'Endpoint not found in mock service.' } } };
};
