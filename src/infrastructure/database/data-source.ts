import { DataSource } from "typeorm";
import {
  BoardColumn,
  Epic,
  Issue,
  Project,
  ProjectMember,
  RelatedIssue,
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
    BoardColumn,
    Epic,
    Issue,
    Project,
    ProjectMember,
    RelatedIssue,
    Sprint,
    Status,
    User,
  ],
});
