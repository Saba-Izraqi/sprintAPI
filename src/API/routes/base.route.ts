// src/API/routes/BaseRoute.ts
import { Router } from "express";

export abstract class BaseRoute {
  public router: Router;
  public abstract path: string;

  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  protected abstract initRoutes(): void;
}
