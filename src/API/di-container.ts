import 'reflect-metadata';
import { container } from 'tsyringe';
import { ProjectRepository } from '../infrastructure/database/repos/ProjectRepo';
import { IProjectRepository } from '../domain/IRepos/IProhectRepo';
import { ProjectService } from '../app/services/project.service';
import { ProjectController } from '../API/controllers/project.controller';

export function registerDependencies() {
  // Register repositories
  container.register<IProjectRepository>('IProjectRepository', {
    useClass: ProjectRepository
  });

  // Register services
  container.register(ProjectService, ProjectService);

  // Register controllers
  container.register(ProjectController, ProjectController);
}