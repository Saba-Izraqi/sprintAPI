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
  port: 5001,
  username: "postgres",
  password: "20032003",
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
