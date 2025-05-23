// src/API/AppServer.ts
import "./loggerOverwrite";
import express, { Application } from "express";
import { BaseRoute } from "./routes/base.route";
import { glob } from "glob";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";
import cors from "cors";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";

export class AppServer {
  public app: Application;
  private readonly apiPrefix = "/api/v1";

  constructor() {
    this.app = express();
    this.setupMiddleware();
  }
  private setupMiddleware() {
    // Enable CORS for all routes
    this.app.use(cors());
    
    // Parse JSON bodies
    this.app.use(express.json());
    
    // Parse URL-encoded bodies
    this.app.use(express.urlencoded({ extended: true }));
    
    // Serve static files from the uploads directory
    this.app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
  }

  private setupSwagger() {
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  private async setupRoutes() {
    this.app.get("/health-check", (_, res) => {
      res.send({ status: "ok" });
    });

    const routeFiles = await glob(
      path.resolve(__dirname, "routes/*.ts").replace(/\\/g, "/")
    );

    for (const filePath of routeFiles) {
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
  private setupErrorHandling() {
    // Register 404 handler for routes that don't exist
    this.app.use(notFoundHandler);
    
    // Global error handler - should be the last middleware
    this.app.use(errorHandler);
  }

  public async listen(port: number) {
    await this.setupRoutes();
    this.setupSwagger();
    // Setup error handling middleware after all routes
    this.setupErrorHandling();
    
    this.app.listen(port, () =>
      console.info(`🚀 Server running at http://localhost:${port}`)
    );
  }
}
