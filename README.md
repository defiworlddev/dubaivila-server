# Dubai Villas Server

Simple Node.js server for handling authentication and real estate requests.

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Create `.env` file:
```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/dubaivilas

# Twilio WhatsApp Configuration
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Admin Configuration
ADMIN_PHONE_NUMBERS=+971501234567,+971501234568
```

**Note**: For WhatsApp verification to work, you need to:
1. Sign up for a Twilio account at https://www.twilio.com
2. Get your Account SID and Auth Token from the Twilio Console
3. Set up a WhatsApp Sandbox (for testing) or get a WhatsApp Business API number (for production)
4. For sandbox testing, join the sandbox by sending the join code to the Twilio WhatsApp number
5. Add the environment variables to your `.env` file

If Twilio credentials are not configured, the service will fall back to console logging (development mode only).

## Running

Development mode (with hot reload):
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication

#### POST `/api/auth/send-verification`
Send verification code to phone number.

Request:
```json
{
  "phoneNumber": "+971501234567"
}
```

Response:
```json
{
  "message": "Verification code sent to WhatsApp",
  "code": "123456" // Only in development mode
}
```

#### POST `/api/auth/verify`
Verify phone number with code.

Request:
```json
{
  "phoneNumber": "+971501234567",
  "code": "123456"
}
```

Response:
```json
{
  "user": {
    "id": "user_1234567890",
    "phoneNumber": "+971501234567",
    "isNewUser": true,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

#### POST `/api/auth/complete-registration`
Complete user registration with name.

Request:
```json
{
  "userId": "user_1234567890",
  "name": "John Doe"
}
```

Response:
```json
{
  "user": {
    "id": "user_1234567890",
    "phoneNumber": "+971501234567",
    "name": "John Doe",
    "isNewUser": false,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### Real Estate Requests

All estate endpoints require authentication via `x-user-id` header.

#### GET `/api/estate/requests`
Get all requests for the authenticated user.

Headers:
```
x-user-id: user_1234567890
```

Response:
```json
{
  "requests": [
    {
      "id": "req_1234567890",
      "userId": "user_1234567890",
      "propertyType": "Villa",
      "location": "Dubai Marina",
      "budget": "5000000",
      "bedrooms": "4",
      "bathrooms": "3",
      "additionalRequirements": "Pool required",
      "status": "pending",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST `/api/estate/requests`
Create a new estate request.

Headers:
```
x-user-id: user_1234567890
```

Request:
```json
{
  "propertyType": "Villa",
  "location": "Dubai Marina",
  "budget": "5000000",
  "bedrooms": "4",
  "bathrooms": "3",
  "additionalRequirements": "Pool required"
}
```

Response:
```json
{
  "request": {
    "id": "req_1234567890",
    "userId": "user_1234567890",
    "propertyType": "Villa",
    "location": "Dubai Marina",
    "budget": "5000000",
    "bedrooms": "4",
    "bathrooms": "3",
    "additionalRequirements": "Pool required",
    "status": "pending",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

#### PATCH `/api/estate/requests/:id/status`
Update request status.

Headers:
```
x-user-id: user_1234567890
```

Request:
```json
{
  "status": "in_progress"
}
```

Response:
```json
{
  "request": {
    "id": "req_1234567890",
    "status": "in_progress",
    ...
  }
}
```

### Admin API

All admin endpoints require authentication via `x-phone-number` header with an admin phone number.

#### POST `/api/admin/send-verification`
Send verification code to admin phone number.

Request:
```json
{
  "phoneNumber": "+971501234567"
}
```

Response:
```json
{
  "message": "Verification code sent to WhatsApp",
  "code": "123456" // Only in development mode
}
```

#### POST `/api/admin/auth`
Authenticate admin with phone number and verification code.

Request:
```json
{
  "phoneNumber": "+971501234567",
  "code": "123456"
}
```

Response:
```json
{
  "user": {
    "id": "user_1234567890",
    "phoneNumber": "+971501234567",
    "isNewUser": false,
    "isAgent": false,
    "isApproved": false,
    "createdAt": "2025-01-01T00:00:00.000Z"
  },
  "isAdmin": true
}
```

#### GET `/api/admin/users`
Get all users (requires admin authentication).

Headers:
```
x-phone-number: +971501234567
```

Response:
```json
{
  "users": [
    {
      "id": "user_1234567890",
      "phoneNumber": "+971501234567",
      "name": "John Doe",
      "isNewUser": false,
      "isAgent": false,
      "isApproved": false,
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET `/api/admin/agents/pending`
Get all pending agents awaiting approval (requires admin authentication).

Headers:
```
x-phone-number: +971501234567
```

Response:
```json
{
  "agents": [
    {
      "id": "user_1234567890",
      "phoneNumber": "+971501234567",
      "name": "Agent Name",
      "isAgent": true,
      "isApproved": false,
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST `/api/admin/agents/:userId/approve`
Approve an agent (requires admin authentication).

Headers:
```
x-phone-number: +971501234567
```

Response:
```json
{
  "user": {
    "id": "user_1234567890",
    "phoneNumber": "+971501234567",
    "name": "Agent Name",
    "isAgent": true,
    "isApproved": true,
    "createdAt": "2025-01-01T00:00:00.000Z"
  },
  "message": "Agent approved successfully"
}
```

## Architecture

- **Models**: Type definitions for User and EstateRequest
- **Repositories**: Data access layer (in-memory storage)
- **Services**: Business logic layer
- **Routes**: API endpoints
- **Middleware**: Authentication middleware

