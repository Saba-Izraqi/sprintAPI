// src/API/AppServer.ts
import "./loggerOverwrite";
import express, { Application } from "express";
import { BaseRoute } from "./routes/base.route";
import { glob } from "glob";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";

export class AppServer {
  public app: Application;
  private readonly apiPrefix = "/api/v1";

  constructor() {
    this.app = express();
    this.setupMiddleware();
  }

  private setupMiddleware() {
    this.app.use(express.json());
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

  public async listen(port: number) {
    await this.setupRoutes();
    this.setupSwagger();
    this.app.listen(port, () =>
      console.info(`🚀 Server running at http://localhost:${port}`)
    );
  }
}
