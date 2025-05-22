import { DataSource } from "typeorm";
import {
  Board,
  BoardColumn,
  Epic,
  Issue,
  Project,
  ProjectMember,
  Sprint,
  Status,
  User,
} from "../../domain/entities";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "root",
  database: "sprintify",
  synchronize: true, // dev only! disable in prod
  logging: ["error", "warn"], // comment out in prod
  entities: [
    Board,
    BoardColumn,
    Epic,
    Issue,
    Project,
    ProjectMember,
    Sprint,
    Status,
    User,
  ],
});
