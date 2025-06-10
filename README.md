# Sprintify API

A REST API for sprint/agile project management with comprehensive user profile management.

## Features

### User Management
- User registration and authentication
- JWT-based authentication
- Profile management with photo upload
- Secure password reset flow

### Sprint Management
- Create and manage sprints
- Associate issues with sprints
- Track sprint progress

### Project Management
- Create and manage projects
- Epic creation and management
- Assign team members to projects

## User Profile Feature

The API provides a complete user profile management system:

### Profile Retrieval Endpoint

**GET /api/v1/user/profile**

This endpoint allows users to retrieve their profile information:
- User ID
- Email address
- Full name
- Profile photo URL
- Email verification status

Features:
- Secure authentication using JWT
- Returns complete profile data of the authenticated user

Example usage:
```javascript
const response = await fetch('/api/v1/user/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const profileData = await response.json();
// profileData contains user information
```

### Profile Update Endpoint

**PUT /api/v1/user/update-profile**

This endpoint allows users to update their profile information including:
- Full name
- Profile photo

Features:
- Secure authentication using JWT
- Cloud storage for profile photos using Cloudinary
- Image optimization (resizing, compression)
- File validation for uploaded images

Example usage:
```javascript
// Update profile with formData
const formData = new FormData();
formData.append('fullName', 'Updated Name');
formData.append('profilePhoto', fileInput.files[0]);

const response = await fetch('/api/v1/user/update-profile', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

## Setup & Installation

1. Clone the repository
2. Run `npm install`
3. Set up environment variables
4. Run `npm run dev` to start the development server

## Testing

To implement tests for this API, consider using frameworks like Jest or Mocha with Supertest.