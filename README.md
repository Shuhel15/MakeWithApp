# MakeWith Mobile Application

## Frontend Development Internship Task

This project is a React Native mobile application built using Expo and TypeScript. It implements a complete authentication flow including signup, OTP verification, login, profile onboarding, and setup.

---

## Tech Stack

- React Native (Expo)
- TypeScript
- React Navigation
- Axios
- Expo Image Picker
- React Native Safe Area Context

---

## Features

### New User Flow
- Phone number signup  
- OTP verification  
- Profile onboarding  
- Profile setup  
- Home screen navigation  

### Existing User Flow
- Login via username or phone  
- Password authentication  
- Home screen navigation  

---

## Screens

### Authentication
- Login Screen  
- Signup Screen  
- OTP Verification Screen  
- Password Screen  

### User Setup
- Profile Onboarding Screen  
- Profile Setup Screen  

### Home
- Dummy Home Screen  

## Project Structure
```text
src/
├── components/
│   ├── CustomButton.tsx
│   ├── CustomInput.tsx
│   ├── OtpInput.tsx
│   ├── ProfileImagePicker.tsx
│   └── LoadingOverlay.tsx

├── navigation/
│   └── AppNavigator.tsx

├── screens/
│   ├── LoginScreen.tsx
│   ├── SignupScreen.tsx
│   ├── OtpVerificationScreen.tsx
│   ├── PasswordScreen.tsx
│   ├── ProfileOnboardingScreen.tsx
│   ├── ProfileSetupScreen.tsx
│   └── DummyHomeScreen.tsx

├── services/
│   ├── api.ts
│   └── authService.ts

└── types/
```
## Authentication Flow

### New User
Signup → OTP Verification → Onboarding → Setup → Home

### Existing User
Login → Password → Home

---

## API Integration

- Send OTP  
- Verify OTP  
- Register user  
- Login user  

All API calls are handled using Axios services.

---

## Setup Instructions

```bash
npm install
npx expo start
Run App
Install Expo Go
Run project
Scan QR code
Start using app
Author

Shuhel Ahmed
Frontend Developer Intern