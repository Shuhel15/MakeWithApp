# MakeWith Mobile Application

## Frontend Development Internship Task

This project is a React Native mobile application developed using Expo and TypeScript. The application implements the complete authentication flow for the MakeWith platform, including user registration, OTP verification, login, profile onboarding, and profile setup.

---

## Technology Stack

- React Native (Expo)
- TypeScript
- React Navigation
- Axios
- Expo Image Picker
- React Native Safe Area Context

---

## Features

### New User Flow

- Signup using Phone Number
- OTP Verification
- Profile Onboarding
- Profile Setup
- Home Screen Navigation

### Existing User Flow

- Login using Username or Phone Number
- Password Authentication
- Home Screen Navigation

---

## Screens Implemented

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

---

## Project Structure

```txt
src/
├── components/
│   ├── CustomButton.tsx
│   ├── CustomInput.tsx
│   ├── OtpInput.tsx
│   ├── ProfileImagePicker.tsx
│   └── LoadingOverlay.tsx
│
├── constants/
│
├── navigation/
│   └── AppNavigator.tsx
│
├── screens/
│   ├── LoginScreen.tsx
│   ├── SignupScreen.tsx
│   ├── OtpVerificationScreen.tsx
│   ├── PasswordScreen.tsx
│   ├── ProfileOnboardingScreen.tsx
│   ├── ProfileSetupScreen.tsx
│   └── DummyHomeScreen.tsx
│
├── services/
│   ├── api.ts
│   └── authService.ts
│
└── types/
```

---

## Authentication Flow

### New User

Signup

↓

OTP Verification

↓

Profile Onboarding

↓

Profile Setup

↓

Home Screen

---

### Existing User

Login

↓

Password Screen

↓

Home Screen

---

## API Integration

Integrated APIs:

- Send OTP
- Verify OTP
- Complete Registration
- Login

All API calls are managed through Axios service functions.

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
```

### Install Dependencies

```bash
npm install
```

### Start Project

```bash
npx expo start
```

---

## Run on Device

1. Install Expo Go.
2. Start the development server.
3. Scan the QR code.
4. Launch the application.

---

## Documentation

Additional documentation is available in:

```txt
docs/
├── ComponentDocumentation.md
├── SetupInstructions.md
└── ApiIntegrationNotes.md
```

---

## Screenshots

Project screenshots are available in:

```txt
screenshots/
```

---

## Author

Shuhel Ahmed

Frontend Developer Intern Assignment

MakeWith Mobile Application
