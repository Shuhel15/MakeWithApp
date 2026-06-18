# Component Documentation

## Project: MakeWith Mobile Application

This document describes the reusable UI components used throughout the authentication flow.

---

# 1. CustomButton

## Purpose

Reusable button component used across Login, Signup, OTP Verification, Profile Onboarding, and Profile Setup screens.

## Features

* Loading State
* Disabled State
* Custom Title
* Consistent Styling
* Reusable Across Screens

## Props

| Prop    | Type       | Description             |
| ------- | ---------- | ----------------------- |
| title   | string     | Button text             |
| onPress | () => void | Button click handler    |
| loading | boolean    | Shows loading indicator |

## Example

```tsx
<CustomButton
  title="Continue"
  onPress={handleContinue}
  loading={loading}
/>
```

---

# 2. CustomInput

## Purpose

Reusable input field component used for phone number, username, full name, and password inputs.

## Features

* Custom Placeholder
* Keyboard Types
* Password Support
* Error Display
* Consistent Design

## Props

| Prop            | Type                |
| --------------- | ------------------- |
| value           | string              |
| onChangeText    | (text:string)=>void |
| placeholder     | string              |
| secureTextEntry | boolean             |
| keyboardType    | KeyboardType        |

## Example

```tsx
<CustomInput
  placeholder="Enter Username"
  value={username}
  onChangeText={setUsername}
/>
```

---

# 3. OtpInput

## Purpose

Handles OTP verification input.

## Features

* 6 Digit OTP Entry
* Auto Focus
* Auto Navigation Between Boxes
* Numeric Keyboard
* Validation Support

## Example

```tsx
<OtpInput
  value={otp}
  onChange={setOtp}
/>
```

---

# 4. ProfileImagePicker

## Purpose

Allows users to select or upload profile images during onboarding.

## Features

* Image Upload
* Gallery Access
* Image Preview
* Skip Support

## Example

```tsx
<ProfileImagePicker
  image={profileImage}
  onPickImage={handleImagePick}
/>
```

---

# 5. LoadingOverlay

## Purpose

Displays loading state while API requests are in progress.

## Features

* Full Screen Loader
* API Request Feedback
* Prevents Multiple Requests

## Example

```tsx
<LoadingOverlay visible={loading} />
```

---

# Authentication Screens Using Components

## LoginScreen

Uses:

* CustomInput
* CustomButton

---

## SignupScreen

Uses:

* CustomInput
* CustomButton

---

## OtpVerificationScreen

Uses:

* OtpInput
* CustomButton

---

## ProfileOnboardingScreen

Uses:

* CustomInput
* CustomButton

---

## ProfileSetupScreen

Uses:

* ProfileImagePicker
* CustomButton

---

# Design Principles

The component system was designed with the following goals:

* Reusability
* Consistency
* Scalability
* Maintainability
* Mobile Responsiveness
* Production-Ready Architecture

---

# Technology Stack

* React Native (Expo)
* TypeScript
* React Navigation
* Axios
* Expo Image Picker
* React Native Safe Area Context

---

# Future Improvements

* Form Validation Component
* Toast Notification Component
* Theme Provider
* Global Loading Manager
* Reusable Modal System

---

End of Documentation.

