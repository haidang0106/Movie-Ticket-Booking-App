# Authentication API Documentation

This document describes the Authentication endpoints for the Movie Ticket Booking App backend. The system uses JSON Web Tokens (JWT) for authentication and a Redis-backed mechanism for OTP handling and token blacklisting.

**Base URL**: `/api/auth`

---

## 1. Register Account

**Endpoint**: `POST /register`

**Purpose**: Initiates the registration process. Normalizes the email, creates a 6-digit OTP, stores its hash in Redis, and sends the OTP to the user's email. Does not create the account yet.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response**:
```json
{
  "code": 1101,
  "message": "OTP sent to your email",
  "data": {
    "email": "user@example.com"
  }
}
```

**Common Errors**:
- `400` / `1001`: User existed
- `429` / `4290`: Too many requests. Please try again later.
- `400` / `1003`: Invalid data (validation error)

---

## 2. Verify OTP

**Endpoint**: `POST /verify-otp`

**Purpose**: Verifies the OTP sent via email to finalize registration. Once successful, creates the Account and Customer records.

**Request Body**:
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Success Response**:
```json
{
  "code": 1100,
  "message": "User created successfully",
  "data": {
    "accountId": 1,
    "customerId": 1,
    "email": "user@example.com"
  }
}
```

**Common Errors**:
- `400` / `1002`: Invalid or expired OTP

---

## 3. Login

**Endpoint**: `POST /login`

**Purpose**: Authenticates a user and returns short-lived access and long-lived refresh tokens. Requires the account to be verified (OTP verified).

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response**:
```json
{
  "code": 2000,
  "message": "Login success",
  "data": {
    "accountId": 1,
    "customerId": 1,
    "accountType": "CUSTOMER",
    "accessToken": "ey...",
    "refreshToken": "ey..."
  }
}
```

**Common Errors**:
- `404` / `1000`: User not existed
- `403` / `1004`: Account is not verified
- `401` / `3000`: Unauthenticated (wrong credentials)

---

## 4. Refresh Token

**Endpoint**: `POST /refresh-token`

**Purpose**: Obtains a new `accessToken` and a new `refreshToken`. The old `refreshToken` is immediately blacklisted.

**Request Body**:
```json
{
  "refreshToken": "ey..."
}
```

**Success Response**:
```json
{
  "code": 1000,
  "message": "Success",
  "data": {
    "accessToken": "ey...new",
    "refreshToken": "ey...new"
  }
}
```

**Common Errors**:
- `401` / `3000`: Unauthenticated (invalid, expired, or blacklisted refresh token)

---

## 5. Logout

**Endpoint**: `POST /logout`

**Purpose**: Logs the user out by blacklisting both their current `accessToken` and `refreshToken`.
**Headers**: `Authorization: Bearer <accessToken>`

**Request Body**:
```json
{
  "refreshToken": "ey..." // (Optional)
}
```

**Success Response**:
```json
{
  "code": 1000,
  "message": "Success",
  "data": {
    "success": true
  }
}
```

**Common Errors**:
- `401` / `3000`: Unauthenticated (invalid or already blacklisted access token)

---

## 6. Forgot Password

**Endpoint**: `POST /forgot-password`

**Purpose**: Initiates password recovery by sending an OTP. Prevents account enumeration by returning success regardless of whether the email exists.

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Success Response**:
```json
{
  "code": 1101,
  "message": "OTP sent to your email",
  "data": {
    "success": true
  }
}
```

**Common Errors**:
- `429` / `4290`: Too many requests. Please try again later.

---

## 7. Reset Password

**Endpoint**: `POST /reset-password`

**Purpose**: Completes password recovery using the OTP and saves the new password.

**Request Body**:
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "newsecurepassword123"
}
```

**Success Response**:
```json
{
  "code": 1102,
  "message": "Password reset successfully",
  "data": {
    "success": true
  }
}
```

**Common Errors**:
- `400` / `1002`: Invalid or expired OTP

---

## 8. Change Password

**Endpoint**: `POST /change-password`

**Purpose**: Allows an authenticated user to change their password. Logs them out immediately by blacklisting tokens.
**Headers**: `Authorization: Bearer <accessToken>`

**Request Body**:
```json
{
  "oldPassword": "securepassword123",
  "newPassword": "newsecurepassword123",
  "refreshToken": "ey..." // (Optional)
}
```

**Success Response**:
```json
{
  "code": 1103,
  "message": "Password changed successfully",
  "data": {
    "success": true
  }
}
```

**Common Errors**:
- `400` / `1005`: Invalid old password
