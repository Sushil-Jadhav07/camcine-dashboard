# Camcine Backend API Documentation

> Frontend Integration Documentation for Camcine OTT Platform API  
> Base URL: `/api/v1`  
> Authentication: JWT Bearer Token

---

# Table of Contents

1. Authentication
2. Content Management
3. Episodes Management
4. Upload APIs
5. Cast Management
6. User Management
7. Common Response Structure
8. Frontend Integration Notes

---

# Common Response Structure

## Success Response

```json
{
  "success": true,
  "message": "Optional message",
  "data": {}
}
```

## Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

---

# Authentication APIs

## Register User

### Endpoint

```http
POST /auth/register
```

### Request Body

```json
{
  "email": "john.doe@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+919876543210",
  "password": "secret123",
  "role": "viewer",
  "age": 25
}
```

### Success Response

```json
{
  "success": true,
  "message": "Registered successfully",
  "data": {}
}
```

### Error Codes

| Status | Description |
|---|---|
| 409 | Email already registered |
| 422 | Validation failed |

---

## Login User

### Endpoint

```http
POST /auth/login
```

### Request Body

```json
{
  "email": "john.doe@example.com",
  "password": "secret123"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token",
    "user": {}
  }
}
```

---

## Get Logged In User

### Endpoint

```http
GET /auth/me
```

### Headers

```http
Authorization: Bearer <token>
```

---

## Forgot Password

### Endpoint

```http
POST /auth/forgot-password
```

---

## Change Password

### Endpoint

```http
POST /auth/change-password
```

---

# Content APIs

## Get Content Statistics

### Endpoint

```http
GET /content/stats
```

---

## Get All Content

### Endpoint

```http
GET /content
```

### Query Parameters

| Parameter | Type | Description |
|---|---|---|
| page | number | Page number |
| limit | number | Max 50 |
| type | string | movie, show, short_film, song, news |
| language | string | Filter by language |
| region | string | Filter by region |
| country | string | Filter movie country |
| genre | string | Filter by genre |
| is_free | boolean | Free/Paid |
| search | string | Search title/description |
| year | number | Release year |
| rating | string | U, UA, A, S |
| sort | string | newest, oldest, title, price_low, price_high |

---

## Create Content

### Endpoint

```http
POST /content
```

### Request Body

```json
{
  "title": "Dangal",
  "type": "movie",
  "description": "A story of a wrestler and his daughters.",
  "language": "Hindi",
  "country": "India",
  "genre": ["Drama", "Sports"],
  "director": "Nitesh Tiwari",
  "release_year": 2016,
  "rating": "U",
  "is_free": false,
  "price_tvod": 49,
  "duration_seconds": 9420
}
```

---

## Get Single Content

### Endpoint

```http
GET /content/{id}
```

---

## Update Content

### Endpoint

```http
PUT /content/{id}
```

---

## Delete Content

### Endpoint

```http
DELETE /content/{id}
```

---

## Update Content Status

### Endpoint

```http
PATCH /content/{id}/status
```

---

# Episode APIs

## Get Episodes

### Endpoint

```http
GET /content/{id}/episodes
```

---

## Add Episode

### Endpoint

```http
POST /content/{id}/episodes
```

---

## Get Single Episode

### Endpoint

```http
GET /content/{id}/episodes/{episodeId}
```

---

## Update Episode

### Endpoint

```http
PUT /content/{id}/episodes/{episodeId}
```

---

## Delete Episode

### Endpoint

```http
DELETE /content/{id}/episodes/{episodeId}
```

---

# Upload APIs

## Upload Image

### Endpoint

```http
POST /upload/image
```

### Content-Type

```http
multipart/form-data
```

---

## Upload Video

### Endpoint

```http
POST /upload/video
```

---

## Upload Trailer

### Endpoint

```http
POST /upload/trailer
```

---

## Upload Audio

### Endpoint

```http
POST /upload/audio
```

---

## Upload Lyrics

### Endpoint

```http
POST /upload/lyrics
```

---

## Get My Uploads

### Endpoint

```http
GET /upload/my-uploads
```

---

## Delete Upload

### Endpoint

```http
DELETE /upload/{id}
```

---

# Cast APIs

## Get Cast

### Endpoint

```http
GET /content/{id}/cast
```

---

## Add Cast Member

### Endpoint

```http
POST /content/{id}/cast
```

---

## Bulk Add Cast

### Endpoint

```http
POST /content/{id}/cast/bulk
```

---

## Update Cast Member

### Endpoint

```http
PUT /content/{id}/cast/{castId}
```

---

## Delete Cast Member

### Endpoint

```http
DELETE /content/{id}/cast/{castId}
```

---

# User APIs

## Get Users

### Endpoint

```http
GET /users
```

---

## Get User By ID

### Endpoint

```http
GET /users/{id}
```

---

## Update User

### Endpoint

```http
PUT /users/{id}
```

---

## Delete User

### Endpoint

```http
DELETE /users/{id}
```

---

# Frontend Integration Notes

## Authentication

Store JWT token securely:

```js
localStorage.setItem("token", token);
```

Attach token in headers:

```js
headers: {
  Authorization: `Bearer ${token}`
}
```

---

## Recommended Frontend Structure

```bash
services/
├── auth.service.js
├── content.service.js
├── upload.service.js
├── cast.service.js
└── user.service.js
```

---

## Recommended Axios Setup

```js
import axios from "axios";

const api = axios.create({
  baseURL: "YOUR_API_BASE_URL"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
```

---

# Notes

- All IDs are UUIDs
- Upload APIs use `multipart/form-data`
- Protected routes require JWT token
- Admin-only routes should be hidden in frontend for non-admin users
- Pagination exists for content, uploads, and users APIs
- Streaming URLs support HLS and DASH formats
