// src/API/routes/project.route.ts

import { Router } from "express";
import { container } from "tsyringe";
import { BaseRoute } from "./base.route"; // Adjust path as necessary
import { ProjectController } from "../controllers/project.controller"; // Adjust path as necessary
import { authenticate } from "../middlewares/auth.middleware"; // Adjust path as necessary

export class ProjectRoutes extends BaseRoute {
  public path = "/projects"; // Base path for all project-related routes

  protected initRoutes(): void {
    const controller = container.resolve(ProjectController);

    // POST /projects - Create a new project
    // All routes here will be protected by the 'authenticate' middleware
    this.router.post(
        '/',
        authenticate,
        controller.createProject.bind(controller)
    );

    // GET /projects - Get all projects
    this.router.get(
        '/',
        authenticate,
        controller.getAllProjects.bind(controller)
    );

    // GET /projects/user/:userId - Get projects for a specific user
    // Note: :userId will be available in req.params.userId
    this.router.get(
        '/user/:userId',
        authenticate,
        controller.getUserProjects.bind(controller)
    );
    // Alternative for "get projects for the logged-in user":
    // If you wanted a route like GET /projects/mine to get projects for the *authenticated* user,
    // you'd need to modify getUserProjects to pull the userId from the token (e.g., req.body.id after authenticate)
    // and have a route like:
    // this.router.get('/mine', authenticate, controller.getAuthenticatedUserProjects.bind(controller));

    // GET /projects/:id - Get a specific project by its ID
    this.router.get(
        '/:id',
        authenticate,
        controller.getProject.bind(controller)
    );

    // PUT /projects/:id - Update a specific project by its ID
    this.router.put(
        '/:id',
        authenticate,
        controller.updateProject.bind(controller)
    );

    // DELETE /projects/:id - Delete a specific project by its ID
    this.router.delete(
        '/:id',
        authenticate,
        controller.deleteProject.bind(controller)
    );
  }
}