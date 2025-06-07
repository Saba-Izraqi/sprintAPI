# Sprint API - Swagger Documentation

This directory contains the comprehensive Swagger/OpenAPI documentation for the Sprint API.

## 📁 Structure

```
swagger/
├── swagger.config.ts       # Main Swagger configuration
├── generated-api-docs.json # Generated API documentation (auto-generated)
└── paths/                  # API endpoint documentation
    ├── auth.ts            # Authentication endpoints
    ├── projects.ts        # Project management endpoints
    ├── issues.ts          # Issue/Task management endpoints
    ├── epics.ts           # Epic management endpoints
    └── board-columns.ts   # Board column endpoints
```

## 🚀 Getting Started

### Viewing the Documentation

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Open your browser and navigate to:**
   ```
   http://localhost:4000/api-docs
   ```

3. **To get the raw JSON specification:**
   ```
   http://localhost:4000/api-docs.json
   ```

### Generating Documentation

To generate the static JSON documentation file:

```bash
npm run generate-swagger
# or
npm run docs
```

This will create/update the `generated-api-docs.json` file.

## 📖 API Overview

### Authentication
- **POST** `/api/v1/user/register` - Register a new user
- **POST** `/api/v1/user/login` - Login user
- **POST** `/api/v1/user/verify-email` - Verify user email
- **POST** `/api/v1/user/forget-password` - Request password reset
- **POST** `/api/v1/user/password-reset` - Reset password

### Projects
- **POST** `/api/v1/project` - Create project
- **GET** `/api/v1/project` - Get user projects
- **PATCH** `/api/v1/project` - Update project
- **DELETE** `/api/v1/project/{id}` - Delete project

### Issues
- **POST** `/api/v1/{projectId}/issues` - Create issue
- **GET** `/api/v1/{projectId}/issues` - Get project issues
- **GET** `/api/v1/{projectId}/issues/{id}` - Get issue details
- **PUT** `/api/v1/{projectId}/issues/{id}` - Update issue
- **DELETE** `/api/v1/{projectId}/issues/{id}` - Delete issue
- **GET** `/api/v1/issues/my-assigned` - Get assigned issues
- **GET** `/api/v1/sprints/{sprintId}/issues` - Get sprint issues
- **GET** `/api/v1/epics/{epicId}/issues` - Get epic issues

### Epics
- **POST** `/api/v1/{projectId}/epic` - Create epic
- **GET** `/api/v1/{projectId}/epic` - Get project epics
- **GET** `/api/v1/{projectId}/epic/{id}` - Get epic details
- **PATCH** `/api/v1/{projectId}/epic/{id}` - Update epic
- **DELETE** `/api/v1/{projectId}/epic/{id}` - Delete epic
- **GET** `/api/v1/{projectId}/epic/{epicId}/issues` - Get epic issues

### Board Columns
- **POST** `/api/v1/board-column` - Create board column
- **GET** `/api/v1/board-column/{projectId}` - Get project columns
- **PATCH** `/api/v1/board-column/{id}` - Update column
- **DELETE** `/api/v1/board-column/{id}` - Delete column

## 🔐 Authentication

Most endpoints require authentication via JWT Bearer token:

```
Authorization: Bearer <your-jwt-token>
```

To get a token:
1. Register a new user or login
2. Use the returned token in subsequent requests

## 📊 Response Formats

### Success Response
```json
{
  "message": "Operation completed successfully",
  "data": { /* response data */ },
  "success": true
}
```

### Error Response
```json
{
  "message": "Error description",
  "status": 400,
  "errors": [
    {
      "property": "fieldName",
      "constraints": { /* validation errors */ }
    }
  ]
}
```

### Paginated Response
```json
{
  "message": "Data retrieved successfully",
  "data": [ /* array of items */ ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## 🛠️ Development

### Adding New Endpoints

1. **Create controller method** with proper JSDoc comments
2. **Add route** in the appropriate route file
3. **Document the endpoint** in the corresponding path file under `paths/`
4. **Add schemas** if needed in `swagger.config.ts`
5. **Regenerate documentation** with `npm run docs`

### Example Controller Documentation

```typescript
/**
 * @swagger
 * /api/v1/example:
 *   post:
 *     summary: Example endpoint
 *     tags: [Examples]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExampleDto'
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
```

## 📝 Notes

- The documentation is automatically generated from JSDoc comments and schemas
- All schemas are defined in `swagger.config.ts`
- Path documentation is organized by feature in the `paths/` directory
- The server includes CORS headers for cross-origin requests
- Authentication is required for most endpoints except registration and login

## 🐛 Troubleshooting

### Common Issues

1. **Documentation not updating:**
   - Run `npm run generate-swagger` to regenerate
   - Restart the server

2. **Endpoint not showing:**
   - Check if the path is documented in the appropriate file
   - Ensure the controller method has proper JSDoc comments
   - Verify the route is registered

3. **Schema errors:**
   - Check schema definitions in `swagger.config.ts`
   - Ensure all referenced schemas exist
   - Validate JSON syntax

For more help, check the [Swagger/OpenAPI documentation](https://swagger.io/docs/).
