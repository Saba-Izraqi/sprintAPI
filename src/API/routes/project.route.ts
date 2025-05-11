// src/API/routes/project.route.ts

import { container } from "tsyringe";
import { BaseRoute } from "./base.route"; 
import { ProjectController } from "../controllers/project.controller"; 
import { authenticate } from "../middlewares/auth.middleware"; 

export class ProjectRoutes extends BaseRoute {
  public path = "/projects"; 

  protected initRoutes(): void {
    const controller = container.resolve(ProjectController);

  
    this.router.post(
        '/', 
        authenticate,
        controller.createProject.bind(controller)
    );

    this.router.get(
        '/',
        authenticate,
        controller.getAllProjects.bind(controller)
    );

    
    this.router.get(
        '/user/:userId',
        authenticate,
        controller.getUserProjects.bind(controller)
    );
   
    this.router.get(
        '/:id',
        authenticate,
        controller.getProject.bind(controller)
    );

    this.router.put(
        '/:id',
        authenticate,
        controller.updateProject.bind(controller)
    );

  
    this.router.delete(
        '/:id',
        authenticate,
        controller.deleteProject.bind(controller)
    );
  }
}