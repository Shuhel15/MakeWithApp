# Setup Instructions

## Project Overview

MakeWith is a React Native mobile application built using Expo and TypeScript. This project implements the complete authentication flow including Login, Signup, OTP Verification, Profile Onboarding, Profile Setup, and Home Screen.

---

## Technology Stack

* React Native (Expo)
* TypeScript
* React Navigation
* Axios
* Expo Image Picker
* React Native Safe Area Context

---

## Prerequisites

Before running the project, ensure the following are installed:

* Node.js (Latest LTS Version)
* npm
* Git
* Expo Go Application (Android/iOS)

---

## Clone Repository

```bash
git clone <repository-url>
cd MakeWith
```

---

## Install Dependencies

```bash
npm install
```

---

## Start Development Server

```bash
npx expo start
```

---

## Run on Mobile Device

1. Install Expo Go from Play Store or App Store.
2. Start the Expo development server.
3. Scan the QR code displayed in the terminal/browser.
4. The application will launch automatically on the device.

---

## Project Structure

```txt
src/
├── components/
├── constants/
├── navigation/
├── screens/
├── services/
└── types/
```

---

## Authentication Flow

### New User Flow

Signup Screen
→ OTP Verification
→ Profile Onboarding
→ Profile Setup
→ Home Screen

### Existing User Flow

Login Screen
→ Password Screen
→ Home Screen

---

## Available Commands

Start Development Server:

```bash
npx expo start
```

Run Android:

```bash
npx expo run:android
```

Run Web:

```bash
npx expo start --web
```

---

## Build Notes

* Mobile-first responsive design.
* Supports light mode and dark mode.
* Authentication APIs integrated through Axios service layer.
* Reusable component architecture implemented.

---

## Author

Frontend Developer Intern Assignment

Project: MakeWith Mobile Application
