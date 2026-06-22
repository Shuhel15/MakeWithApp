# API Integration Notes

## Project

MakeWith Mobile Application

Frontend Authentication Flow Integration

---

## API Configuration

The application uses Axios for backend communication.

### API Base URL

```txt
http://YOUR_BACKEND_IP:5000/api/auth
```

Example:

```txt
http://10.81.206.236:5000/api/auth
```

---

## Axios Configuration

File:

```txt
src/services/api.ts
```

Implementation:

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://YOUR_BACKEND_IP:5000/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
```

---

# Authentication APIs

## 1. Send OTP

### Endpoint

```http
POST /send-otp
```

### Request Body

```json
{
  "phoneNumber": "+919876543210"
}
```

### Success Response

```json
{
  "success": true,
  "message": "OTP sent successfully."
}
```

### Purpose

Used during user registration to send a one-time password to the user's phone number.

---

## 2. Verify OTP

### Endpoint

```http
POST /verify-otp
```

### Request Body

```json
{
  "phoneNumber": "+919876543210",
  "otp": "123456"
}
```

### Success Response

```json
{
  "success": true,
  "message": "OTP verified successfully."
}
```

### Purpose

Verifies the OTP entered by the user before registration is completed.

---

## 3. Complete Registration

### Endpoint

```http
POST /complete-registration
```

### Request Body

```json
{
  "phoneNumber": "+919876543210",
  "username": "shuhel",
  "name": "Shuhel Ahmed",
  "password": "password123"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Account created successfully."
}
```

### Purpose

Creates a new user account after successful OTP verification.

---

## 4. Login

### Endpoint

```http
POST /login
```

### Request Body

```json
{
  "identifier": "+919876543210",
  "password": "password123"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Logged in successfully."
}
```

### Purpose

Authenticates existing users using phone number or username and password.

---

## Frontend Service Layer

File:

```txt
src/services/authService.ts
```

Functions Implemented:

* sendOtp()
* verifyOtp()
* completeRegistration()
* login()

---

## Error Handling

The frontend handles the following API states:

### OTP

* OTP Sent Successfully
* Invalid OTP
* Expired OTP
* Network Error

### Registration

* Username Already Exists
* Invalid Password
* Missing Fields

### Login

* Invalid Credentials
* Account Not Found
* Network Error

---

## Authentication Flow

### New User

Signup Screen

↓

Send OTP API

↓

Verify OTP API

↓

Complete Registration API

↓

Profile Setup

↓

Home Screen

---

### Existing User

Login Screen

↓

Login API

↓

Home Screen

---

## Notes

* Axios is used for all HTTP requests.
* Authentication state is maintained after successful login.
* API requests include proper loading states and error handling.
* All authentication APIs are integrated through a centralized service layer.

---

## Security & Dev Features Added

* **Secure Token Storage**: Leverages `expo-secure-store` to keep JWT safe on native devices and `localStorage` on web.
* **Existence Helpers**: Added `/check-exists` and `/check-username` to dynamically verify usernames and phone numbers without needing full authorization credentials.
* **Development OTP Code**: In development mode, OTP is logged to console and returned in response as `devOtp` for instant debugging and visual testing.

## Future Improvements

* Refresh Token Support
* Forgot Password Flow
* Social Login Integration

---

End of API Integration Documentation.
