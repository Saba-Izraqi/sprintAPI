import swaggerJSDoc from 'swagger-jsdoc';
import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sprint API - Sprintify',
      version: '1.0.0',
      description: 'A comprehensive API for project management and sprint tracking',
      contact: {
        name: 'API Support',
        email: 'support@sprintify.com',
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000/api/v1',
        description: 'Development server',
      },
      {
        url: 'https://api.sprintify.com/api/v1',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token',
        },
      },
      schemas: {
        // User Schemas
        RegisterUserDto: {
          type: 'object',
          required: ['fullName', 'email', 'password'],
          properties: {
            fullName: {
              type: 'string',
              example: 'John Doe',
              description: 'Full name of the user',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john.doe@example.com',
              description: 'Email address of the user',
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'password123',
              description: 'Password for the user account',
            },
          },
        },
        LoginUserDto: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'john.doe@example.com',
            },
            password: {
              type: 'string',
              example: 'password123',
            },
          },
        },
        UserResponseDto: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            fullName: {
              type: 'string',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              example: 'john.doe@example.com',
            },
            isEmailVerified: {
              type: 'boolean',
              example: false,
            },
            image: {
              type: 'string',
              example: '/avatars/john.png',
              description: 'User profile image URL',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
            deletedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
          },
        },
        
        // Project Schemas
        CreateProjectDto: {
          type: 'object',
          required: ['name', 'key', 'description'],
          properties: {
            name: {
              type: 'string',
              example: 'My Awesome Project',
              description: 'Name of the project',
            },
            key: {
              type: 'string',
              example: 'MAP',
              description: 'Unique key for the project (2-5 characters)',
            },
            description: {
              type: 'string',
              example: 'This is an awesome project for managing tasks',
              description: 'Description of the project',
            },
          },
        },
        UpdateProjectDto: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'Updated Project Name',
            },
            description: {
              type: 'string',
              example: 'Updated project description',
            },
          },
        },
        ProjectResponseDto: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            name: {
              type: 'string',
              example: 'My Awesome Project',
            },
            keyPrefix: {
              type: 'string',
              example: 'MAP',
              description: 'Project key prefix',
            },
            createdBy: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
              description: 'ID of the user who created the project',
            },
            activeSprintId: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
              description: 'ID of the currently active sprint',
              nullable: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
            deletedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
          },
        },

        // Issue Schemas
        CreateIssueDto: {
          type: 'object',
          required: ['title', 'type', 'priority'],
          properties: {
            title: {
              type: 'string',
              example: 'Fix login bug',
              description: 'Title of the issue',
            },
            description: {
              type: 'string',
              example: 'Users cannot login with valid credentials',
              description: 'Detailed description of the issue',
            },            type: {
              type: 'string',
              enum: ['bug', 'story', 'task'],
              example: 'bug',
              description: 'Type of the issue',
            },priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              example: 'medium',
              description: 'Priority level of the issue',
            },
            assigneeId: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
              description: 'ID of the assigned user',
            },
            epicId: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
              description: 'ID of the parent epic',
            },
            sprintId: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
              description: 'ID of the sprint',
            },
            estimatedHours: {
              type: 'number',
              example: 8,
              description: 'Estimated hours to complete',
            },
          },
        },
        UpdateIssueDto: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              example: 'Updated issue title',
            },
            description: {
              type: 'string',
              example: 'Updated issue description',
            },            type: {
              type: 'string',
              enum: ['bug', 'story', 'task'],
              example: 'task',
            },priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              example: 'medium',
            },
            assigneeId: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            statusId: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            sprintId: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            estimatedHours: {
              type: 'number',
              example: 10,
            },
            loggedHours: {
              type: 'number',
              example: 5,
            },
          },
        },
        IssueResponseDto: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            key: {
              type: 'string',
              example: 'MAP-123',
              description: 'Unique key for the issue',
            },
            title: {
              type: 'string',
              example: 'Fix login bug',
            },
            description: {
              type: 'string',
              example: 'Users cannot login with valid credentials',
            },
            storyPoint: {
              type: 'number',
              example: 5,
            },
            statusId: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
              nullable: true,
            },
            assignee: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
              nullable: true,
            },
            epicId: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
              nullable: true,
            },
            sprintId: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
              nullable: true,
            },
            projectId: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },            type: {
              type: 'string',
              enum: ['story', 'bug', 'task'],
              example: 'story',
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              example: 'medium',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
            deletedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            assigneeUser: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                fullName: { type: 'string', example: 'John Doe' },
                email: { type: 'string', example: 'john.doe@example.com' },
                image: { type: 'string', nullable: true },
              },
              nullable: true,
            },
            status: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string', example: 'In Progress' },
                type: { type: 'integer', example: 1 },
              },
              nullable: true,
            },
            project: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string', example: 'My Awesome Project' },
                keyPrefix: { type: 'string', example: 'MAP' },
              },
              nullable: true,
            },
            epic: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                title: { type: 'string', example: 'User Management Epic' },
                key: { type: 'string', example: 'MAP-EPIC-1' },
              },
              nullable: true,
            },
            sprint: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string', example: 'Sprint 1' },
              },
              nullable: true,
            },
          },
        },

        // Epic Schemas
        CreateEpicDto: {
          type: 'object',
          required: ['name', 'description'],
          properties: {
            name: {
              type: 'string',
              example: 'User Authentication Epic',
              description: 'Name of the epic',
            },
            description: {
              type: 'string',
              example: 'Implement complete user authentication system',
              description: 'Description of the epic',
            },
            startDate: {
              type: 'string',
              format: 'date',
              example: '2024-01-01',
              description: 'Start date of the epic',
            },
            endDate: {
              type: 'string',
              format: 'date',
              example: '2024-03-01',
              description: 'End date of the epic',
            },
          },
        },
        UpdateEpicDto: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'Updated Epic Name',
            },
            description: {
              type: 'string',
              example: 'Updated epic description',
            },
            startDate: {
              type: 'string',
              format: 'date',
              example: '2024-01-15',
            },
            endDate: {
              type: 'string',
              format: 'date',
              example: '2024-03-15',
            },
          },
        },        EpicResponseDto: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            key: {
              type: 'string',
              example: 'MAP-EPIC-1',
              description: 'Unique key for the epic',
            },
            title: {
              type: 'string',
              example: 'User Authentication Epic',
            },
            description: {
              type: 'string',
              example: 'Implement complete user authentication system',
            },
            assignee: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
              description: 'ID of the assigned user',
              nullable: true,
            },
            projectId: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
              description: 'ID of the project this epic belongs to',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
            deletedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
          },
        },

        // Sprint Schemas
        CreateSprintDto: {
          type: 'object',
          required: ['name', 'startDate', 'endDate'],
          properties: {
            name: {
              type: 'string',
              example: 'Sprint 1 - Foundation Setup',
            },
            startDate: {
              type: 'string',
              format: 'date',
              example: '2024-03-01',
            },
            endDate: {
              type: 'string',
              format: 'date',
              example: '2024-03-14',
            },
          },
        },
        UpdateSprintDto: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              maxLength: 25,
              example: 'Updated Sprint Name',
              description: 'Updated name of the sprint',
            },
            startDate: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z',
              description: 'Updated start date',
            },
            endDate: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-14T23:59:59.999Z',
              description: 'Updated end date',
            },
            isActive: {
              type: 'boolean',
              example: true,
              description: 'Whether the sprint is active',
            },
            isArchived: {
              type: 'boolean',
              example: false,
              description: 'Whether the sprint is archived',
            },
          },
        },
        SprintResponseDto: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
              description: 'Unique identifier of the sprint',
            },
            name: {
              type: 'string',
              example: 'Sprint 1 - Foundation Setup',
              description: 'Name of the sprint',
            },
            startDate: {
              type: 'string',
              format: 'date-time',
              example: '2024-03-01T00:00:00.000Z',
              description: 'Start date of the sprint',
            },
            endDate: {
              type: 'string',
              format: 'date-time',
              example: '2024-03-14T23:59:59.999Z',
              description: 'End date of the sprint',
            },
            isActive: {
              type: 'boolean',
              example: true,
              description: 'Whether the sprint is currently active',
            },
            isArchived: {
              type: 'boolean',
              example: false,
              description: 'Whether the sprint is archived',
            },
            isCompleted: {
              type: 'boolean',
              example: false,
              description: 'Whether the sprint is completed',
            },
            projectId: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
              description: 'ID of the project this sprint belongs to',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z',
              description: 'When the sprint was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z',
              description: 'When the sprint was last updated',
            },
            deletedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'When the sprint was deleted (if soft deleted)',
            },
          },
        },

        // Board Column Schemas
        CreateBoardColumnDto: {
          type: 'object',
          required: ['name', 'order'],
          properties: {
            name: {
              type: 'string',
              example: 'In Progress',
              description: 'Name of the board column',
            },
            order: {
              type: 'number',
              example: 2,
              description: 'Position of the column in the board',
            },
            projectId: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
              description: 'ID of the project',
            },
          },
        },
        UpdateBoardColumnDto: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'Updated Column Name',
            },
            order: {
              type: 'number',
              example: 3,
            },
            projectId: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
          },
        },
        BoardColumnResponseDto: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            name: {
              type: 'string',
              example: 'In Progress',
            },
            order: {
              type: 'number',
              example: 2,
            },
            projectId: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
            deletedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
          },
        },

        // Status Schemas
        CreateStatusDto: {
          type: 'object',
          required: ['name', 'type'],
          properties: {
            name: {
              type: 'string',
              example: 'In Progress',
              description: 'Name of the status',
            },
            type: {
              type: 'integer',
              enum: [0, 1, 2],
              example: 1,
              description: 'Type of status (0: BACKLOG, 1: IN_PROGRESS, 2: DONE)',
            },
            columnId: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
              description: 'ID of the board column (optional)',
            },
          },
        },
        UpdateStatusDto: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'Updated Status Name',
            },
            type: {
              type: 'integer',
              enum: [0, 1, 2],
              example: 2,
              description: 'Type of status (0: BACKLOG, 1: IN_PROGRESS, 2: DONE)',
            },
            columnId: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
              description: 'ID of the board column (optional)',
            },
          },
        },
        StatusResponseDto: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            name: {
              type: 'string',
              example: 'In Progress',
            },
            type: {
              type: 'integer',
              enum: [0, 1, 2],
              example: 1,
              description: 'Type of status (0: BACKLOG, 1: IN_PROGRESS, 2: DONE)',
            },
            columnId: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
              nullable: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
            deletedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
          },
        },

        // Project Member Schemas
        CreateProjectMemberDto: {
          type: 'object',
          required: ['userId', 'projectId', 'permission'],
          properties: {
            userId: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
              description: 'ID of the user to add as member',
            },
            projectId: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
              description: 'ID of the project',
            },
            permission: {
              type: 'integer',
              enum: [0, 1, 2],
              example: 0,
              description: 'Permission level (0: MEMBER, 1: MODERATOR, 2: OWNER)',
            },
          },
        },
        UpdateProjectMemberDto: {
          type: 'object',
          properties: {
            permission: {
              type: 'integer',
              enum: [0, 1, 2],
              example: 1,
              description: 'Permission level (0: MEMBER, 1: MODERATOR, 2: OWNER)',
            },
          },
        },
        ProjectMemberResponseDto: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            permission: {
              type: 'integer',
              enum: [0, 1, 2],
              example: 0,
              description: 'Permission level (0: MEMBER, 1: MODERATOR, 2: OWNER)',
            },
            userId: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            projectId: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
            deletedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            user: {
              $ref: '#/components/schemas/UserResponseDto',
            },
          },        },        // Response wrapper schemas that match actual controller responses
        
        // User responses
        UsersResponse: {
          type: 'object',
          properties: {
            users: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/UserResponseDto',
              },
            },
          },
        },

        // Project responses
        ProjectsResponse: {
          type: 'object',
          properties: {
            projects: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/ProjectResponseDto',
              },
            },
          },
        },

        // Issue responses
        IssuesResponse: {
          type: 'object',
          properties: {
            issues: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/IssueResponseDto',
              },
            },
          },
        },

        // Epic responses
        EpicsResponse: {
          type: 'object',
          properties: {
            epics: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/EpicResponseDto',
              },
            },
          },
        },

        // Sprint responses
        SprintsResponse: {
          type: 'object',
          properties: {
            sprints: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/SprintResponseDto',
              },
            },
          },
        },

        // Status responses
        StatusesResponse: {
          type: 'object',
          properties: {
            statuses: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/StatusResponseDto',
              },
            },
          },
        },

        // Board Column responses
        ColumnsResponse: {
          type: 'object',
          properties: {
            columns: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/BoardColumnResponseDto',
              },
            },
          },
        },

        // Project Member responses
        ProjectMembersResponse: {
          type: 'object',
          properties: {
            project_members: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/ProjectMemberResponseDto',
              },
            },
          },
        },

        // Error Response Schema
        ErrorResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'An error occurred',
            },
            status: {
              type: 'number',
              example: 400,
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  property: { type: 'string' },
                  constraints: { type: 'object' },
                },
              },
            },
          },
        },        // Auth Response Schema (matches actual login/register responses)
        AuthResponse: {
          type: 'object',
          properties: {
            users: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/UserResponseDto',
              },
            },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              description: 'JWT access token',
            },
            emailVerificationToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              description: 'Email verification token (only on registration)',
            },
          },
          required: ['users', 'token'],
        },

        // Email Verification Response
        EmailVerificationResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            users: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/UserResponseDto',
              },
            },
          },
        },

        // Password Reset Response
        PasswordResetResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Password reset email sent successfully',
            },
            success: {
              type: 'boolean',
              example: true,
            },
          },
        },

        // Pagination Schema
        PaginationMeta: {
          type: 'object',
          properties: {
            page: {
              type: 'number',
              example: 1,
              description: 'Current page number',
            },
            limit: {
              type: 'number',
              example: 20,
              description: 'Number of items per page',
            },
            total: {
              type: 'number',
              example: 100,
              description: 'Total number of items',
            },
            totalPages: {
              type: 'number',
              example: 5,
              description: 'Total number of pages',
            },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Data retrieved successfully',
            },
            data: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
            meta: {
              $ref: '#/components/schemas/PaginationMeta',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints',
      },
      {
        name: 'Users',
        description: 'User management endpoints',
      },
      {
        name: 'Projects',
        description: 'Project management endpoints',
      },
      {
        name: 'Issues',
        description: 'Issue/Task management endpoints',
      },
      {
        name: 'Epics',
        description: 'Epic management endpoints',
      },
      {
        name: 'Sprints',
        description: 'Sprint management endpoints',
      },
      {
        name: 'Board Columns',
        description: 'Board column management endpoints',
      },
      {
        name: 'Statuses',
        description: 'Status management endpoints',
      },      {
        name: 'Project Members',
        description: 'Project member management endpoints',
      },
    ],
  },  apis: [
    './src/API/controllers/*.ts',
    './src/API/routes/*.ts',
    './src/API/swagger/paths/*.ts',
    './dist/API/controllers/*.js',
    './dist/API/routes/*.js',
    './dist/API/swagger/paths/*.js',
  ],
};

const specs = swaggerJSDoc(options);

export const setupSwagger = (app: Application): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Sprint API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
    },
  }));

  // Serve the JSON spec at /api-docs.json
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  console.info('📖 Swagger documentation available at /api-docs');
  console.info('📄 Swagger JSON spec available at /api-docs.json');
};

export { specs };
