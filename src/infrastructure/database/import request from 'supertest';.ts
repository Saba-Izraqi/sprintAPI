import request from 'supertest';
import express from 'express';
import { container } from 'tsyringe';
import { UserRoutes } from '../API/routes/user.routes';
import { ProjectRoutes } from '../API/routes/project.route';
import { IssueRoutes } from '../API/routes/issue.route';

// filepath: back/sprintAPI/src/test/routes.test.ts

describe('API Routes Tests', () => {
  let app: express.Application;
  let accessToken: string;
  
  beforeAll(() => {
    // Setup express app
    app = express();
    app.use(express.json());
    
    // Register routes
    const userRoutes = new UserRoutes();
    const projectRoutes = new ProjectRoutes();
    const issueRoutes = new IssueRoutes();
    
    app.use(userRoutes.path, userRoutes.router);
    app.use('/projects', projectRoutes.router);
    app.use('/issues', issueRoutes.router);
  });

  describe('User Routes', () => {
    it('should register a new user', async () => {
      const userData = {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: "Password123!",
        confirmPassword: "Password123!"
      };
      
      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', userData.email);
    });

    it('should login a user', async () => {
      const loginData = {
        email: "test@example.com",
        password: "Password123!"
      };
      
      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      
      accessToken = response.body.token;
    });

    it('should request password reset', async () => {
      const resetData = {
        email: "test@example.com"
      };
      
      const response = await request(app)
        .post('/auth/forget-password')
        .send(resetData)
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Password reset email sent');
    });
  });

  describe('Project Routes', () => {
    it('should create a new project', async () => {
      const projectData = {
        name: "Test Project",
        description: "A project created for testing",
        key: "TP"
      };
      
      const response = await request(app)
        .post('/projects')
        .send(projectData)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', projectData.name);
      expect(response.body).toHaveProperty('key', projectData.key);
    });
    
    it('should add a member to a project', async () => {
      const memberData = {
        userId: 2,
        role: "DEVELOPER"
      };
      
      const response = await request(app)
        .post('/projects/1/members')
        .send(memberData)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('projectId', 1);
      expect(response.body).toHaveProperty('userId', memberData.userId);
      expect(response.body).toHaveProperty('role', memberData.role);
    });
  });

  describe('Issue Routes', () => {
    it('should create a new issue', async () => {
      const issueData = {
        title: "Test Issue",
        description: "This is a test issue",
        projectId: 1,
        statusId: 1,
        priority: "MEDIUM",
        assigneeId: 1,
        storyPoints: 3
      };
      
      const response = await request(app)
        .post('/issues')
        .send(issueData)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', issueData.title);
      expect(response.body).toHaveProperty('projectId', issueData.projectId);
    });
    
    it('should add issue to a sprint', async () => {
      const sprintAssignData = {
        sprintId: 1
      };
      
      const response = await request(app)
        .post('/issues/1/sprint')
        .send(sprintAssignData)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('sprintId', sprintAssignData.sprintId);
    });
  });

  describe('Sprint Routes', () => {
    it('should create a new sprint', async () => {
      const sprintData = {
        name: "Sprint 1",
        goal: "Complete core features",
        projectId: 1,
        startDate: "2023-07-01",
        endDate: "2023-07-14"
      };
      
      const response = await request(app)
        .post('/sprints')
        .send(sprintData)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', sprintData.name);
      expect(response.body).toHaveProperty('projectId', sprintData.projectId);
    });
  });

  describe('Epic Routes', () => {
    it('should create a new epic', async () => {
      const epicData = {
        title: "User Authentication",
        description: "All features related to user auth",
        projectId: 1
      };
      
      const response = await request(app)
        .post('/epics')
        .send(epicData)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', epicData.title);
      expect(response.body).toHaveProperty('projectId', epicData.projectId);
    });
  });
});