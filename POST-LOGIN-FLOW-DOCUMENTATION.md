# 🔐 Post-Login User Flow & API Approach

## 📋 Overview
This document describes the comprehensive approach and flow after a user successfully logs into the Sprint API system, including authentication, authorization, and API interaction patterns.

## 🚀 Login Process & Token Generation

### 1. User Login Flow
```typescript
POST /api/v1/user/login
{
  "email": "user@example.com",
  "password": "userPassword"
}
```

### 2. Successful Login Response
```typescript
{
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "fullName": "User Name",
    "isEmailVerified": true,
    // ... other user properties
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // JWT Access Token
  "success": true
}
```

### 3. JWT Token Structure
The generated token contains:
```typescript
interface ITokenPayload {
  id: string;              // User ID
  email: string;           // User email
  isEmailVerified: boolean; // Email verification status
  tokenType: "ACCESS";     // Token type (ACCESS, REFRESH, etc.)
  iat?: number;           // Issued at timestamp
  exp?: number;           // Expiration timestamp
}
```

## 🔑 Authentication & Authorization Approach

### 1. Token-Based Authentication
All protected endpoints require the JWT token in the Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Authentication Middleware Flow
```typescript
// 1. Extract token from Authorization header
const token = req.header("Authorization")?.split(" ")[1];

// 2. Verify JWT token
const decoded = jwt.verify(token, "secretKey") as JwtPayload;

// 3. Attach user data to request
req.body = { ...req.body, ...decoded };
(req as any).user = decoded;

// 4. Continue to next middleware/controller
next();
```

### 3. Multi-Layer Security
The API implements multiple authorization layers:

#### **Token Type Restrictions**
```typescript
// Only ACCESS tokens allowed for most operations
restrictTokens(Token.ACCESS)

// Special tokens for specific operations
restrictTokens(Token.EMAIL_VERIFICATION) // Email verification
restrictTokens(Token.RESET_PASSWORD)     // Password reset
```

#### **Permission-Based Access Control**
```typescript
// Project-level permissions
restrictTo(ProjectPermission.ADMINISTRATOR) // Admin-only operations
restrictTo(ProjectPermission.MEMBER)        // Member-level access
```

## 🏗️ API Interaction Patterns After Login

### 1. User Profile Management
Once logged in, users can manage their profile:

```typescript
// Get user profile
GET /api/v1/user/profile
Headers: { Authorization: "Bearer <token>" }

// Update profile with file upload
PUT /api/v1/user/update-profile
Headers: { 
  Authorization: "Bearer <token>",
  Content-Type: "multipart/form-data"
}
Body: FormData with fullName, profilePhoto
```

### 2. Project Operations
Users can create and manage projects:

```typescript
// Create new project
POST /api/v1/project
Headers: { Authorization: "Bearer <token>" }
Body: {
  "name": "Project Name",
  "description": "Project Description", 
  "keyPrefix": "PROJ" // 1-5 letters
}

// Get user's projects
GET /api/v1/project
Headers: { Authorization: "Bearer <token>" }
```

### 3. Issue Management with Priority
The core feature - managing issues with priority levels:

```typescript
// Create issue with priority
POST /api/v1/{projectId}/issues
Headers: { Authorization: "Bearer <token>" }
Body: {
  "title": "Issue Title",
  "description": "Issue Description",
  "priority": "high", // "high" | "medium" | "low" (default: "medium")
  "storyPoint": 5,
  "assignee": "optional-user-id",
  "epicId": "optional-epic-id",
  "sprintId": "optional-sprint-id"
}

// Get all issues with priority data
GET /api/v1/{projectId}/issues
Headers: { Authorization: "Bearer <token>" }

// Update issue priority
PUT /api/v1/{projectId}/issues/{issueId}
Headers: { Authorization: "Bearer <token>" }
Body: {
  "priority": "low" // Change priority level
}
```

### 4. Sprint & Epic Management
Users can organize work into sprints and epics:

```typescript
// Create sprint
POST /api/v1/{projectId}/sprints
Headers: { Authorization: "Bearer <token>" }
Body: {
  "name": "Sprint 1",
  "goal": "Sprint objective",
  "startDate": "2025-06-10T00:00:00Z",
  "endDate": "2025-06-24T00:00:00Z"
}

// Create epic
POST /api/v1/{projectId}/epic
Headers: { Authorization: "Bearer <token>" }
Body: {
  "title": "Epic Title",
  "description": "Epic Description"
}
```

## 🔄 Request Processing Flow

### 1. Typical API Request Flow
```
Client Request → Authentication Middleware → Token Validation → 
Permission Check → Data Validation → Controller → Service → 
Database → Response Processing → Client Response
```

### 2. Detailed Middleware Chain
For protected endpoints, requests go through:

1. **Authentication Middleware** (`authenticate`)
   - Extracts and verifies JWT token
   - Attaches user data to request object
   - Returns 401 if token invalid/missing

2. **Token Type Restriction** (`restrictTokens`)
   - Validates token type (ACCESS, REFRESH, etc.)
   - Ensures appropriate token for operation
   - Returns 403 if wrong token type

3. **Permission Middleware** (`restrictTo`) [Optional]
   - Checks user permissions for resource
   - Validates project membership/roles
   - Returns 403 if insufficient permissions

4. **Validation Middleware** (`validateDTO`)
   - Validates request body against DTOs
   - Sanitizes and transforms input data
   - Returns 400 if validation fails

5. **Controller Logic**
   - Accesses user data via `(req as any).user?.id`
   - Processes business logic
   - Calls appropriate service methods

## 📊 User Context & Data Access

### 1. Accessing User Information
In controllers, user information is available as:

```typescript
async create(req: Request, res: Response, next: NextFunction) {
  // Get authenticated user ID
  const userId = (req as any).user?.id;
  const userEmail = (req as any).user?.email;
  
  // Use user context for operations
  const project = await this.projectService.create({
    ...projectData,
    createdBy: userId // Associate with current user
  });
}
```

### 2. User-Scoped Operations
Most operations are automatically scoped to the authenticated user:

- **Projects**: Users see only their projects or projects they're members of
- **Issues**: Filtered by project membership and permissions
- **Sprints/Epics**: Scoped to user's accessible projects
- **Profile**: Users can only access/modify their own profile

## 🛡️ Security Features

### 1. Token Security
- **JWT Signatures**: Tokens are cryptographically signed
- **Expiration**: Tokens have expiration timestamps
- **Type-Specific**: Different token types for different operations

### 2. Request Security
- **CORS Protection**: Cross-origin request filtering
- **Input Validation**: All inputs validated against schemas
- **SQL Injection Prevention**: ORM-based database access
- **File Upload Security**: Validated file types and sizes

### 3. Permission Model
- **Project-Based**: Access controlled at project level
- **Role-Based**: Administrator vs Member permissions
- **Resource-Specific**: Fine-grained access control

## 🎯 Priority Feature Integration

### 1. Priority System Usage
After login, users can leverage the priority system:

```typescript
// Create high-priority critical bug
POST /api/v1/{projectId}/issues
{
  "title": "Critical Security Vulnerability",
  "priority": "high",
  "storyPoint": 13
}

// Create medium-priority feature (default)
POST /api/v1/{projectId}/issues
{
  "title": "User Dashboard Enhancement"
  // priority defaults to "medium"
}

// Filter issues by priority
GET /api/v1/{projectId}/issues?priority=high
```

### 2. Priority-Based Workflows
- **High Priority**: Critical bugs, urgent features
- **Medium Priority**: Standard features, improvements  
- **Low Priority**: Nice-to-have features, minor enhancements

## 📱 Client-Side Integration

### 1. Token Management
```javascript
// Store token after login
localStorage.setItem('authToken', response.data.token);

// Include in subsequent requests
const apiCall = axios.create({
  baseURL: 'http://localhost:4000/api/v1',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  }
});
```

### 2. Error Handling
```javascript
// Handle authentication errors
apiCall.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 🚀 Production-Ready Features

### ✅ **Complete Authentication System**
- Secure login/logout functionality
- JWT-based session management
- Multi-token type support
- Password reset capabilities

### ✅ **Comprehensive Authorization**
- Role-based access control
- Project-level permissions
- Resource-specific restrictions
- Token type validation

### ✅ **Priority-Enabled Issue Management**
- Three-tier priority system (high/medium/low)
- Default priority handling
- Priority-based filtering and sorting
- Type-safe priority validation

### ✅ **Professional API Design**
- RESTful endpoint structure
- Comprehensive Swagger documentation
- Type-safe request/response handling
- Consistent error messaging

---

This approach ensures secure, scalable, and user-friendly API interactions after login, with the priority feature seamlessly integrated into the sprint management workflow.
