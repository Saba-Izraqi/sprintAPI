// src/API/AppServer.ts
import "./loggerOverwrite";
import express, { Application } from "express";
import { BaseRoute } from "./routes/base.route";
import { glob } from "glob";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";
import { container } from "tsyringe";
import { UserRoutes } from "./routes/user.routes";
import { ProjectRoutes } from "./routes/project.route"; // Add this import
import { registerDependencies } from './di-container';
export class AppServer {
  public app: Application;
  private readonly apiPrefix = "/api/v1";

  constructor() {
    this.app = express();
    this.setupMiddleware();
    registerDependencies();
    this.registerDependencies(); // Add this line
  }

  private setupMiddleware() {
    this.app.use(express.json());
  }

  private setupSwagger() {
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  private registerDependencies() {
    // Register your route classes
    container.register(UserRoutes, UserRoutes);
    container.register(ProjectRoutes, ProjectRoutes); // Add this line
  }

  private async setupRoutes() {
    this.app.get("/health-check", (_, res) => {
      res.send({ status: "ok" });
    });

    // Explicitly register known routes first
    const userRoutes = container.resolve(UserRoutes);
    this.app.use(`${this.apiPrefix}${userRoutes.path}`, userRoutes.router);

    const projectRoutes = container.resolve(ProjectRoutes); // Add this block
    this.app.use(`${this.apiPrefix}${projectRoutes.path}`, projectRoutes.router);

    // Then load any additional routes dynamically
    const routeFiles = await glob(
      path.resolve(__dirname, "routes/*.ts").replace(/\\/g, "/")
    );

    for (const filePath of routeFiles) {
      // Skip already registered routes
      if (filePath.includes("user.routes.ts") || filePath.includes("project.routes.ts")) {
        continue;
      }

      const module = await import(filePath);
      for (const exportedName in module) {
        const RouteClass = module[exportedName];
        if (
          typeof RouteClass === "function" &&
          Object.getPrototypeOf(RouteClass).name === "BaseRoute"
        ) {
          const routeInstance: BaseRoute = new RouteClass();
          this.app.use(
            `${this.apiPrefix}${routeInstance.path}`,
            routeInstance.router
          );
          console.success(`Loaded route: ${routeInstance.path}`);
        }
      }
    }
  }

  public async listen(port: number) {
    await this.setupRoutes();
    this.setupSwagger();
    this.app.listen(port, () =>
      console.info(`🚀 Server running at http://localhost:${port}`)
    );
  }
}