import { DataSource } from "typeorm";
import { User } from "../../domain/entities/user.entity";
import { Project } from "../../domain/entities/project.entity";
import { BoardColumn } from "../../domain/entities/board-column.entity";
import { Status } from "../../domain/entities/status.entity";
import { Sprint } from "../../domain/entities/sprint.entity";
import { Issue } from "../../domain/entities/issue.entity";
import { Epic } from "../../domain/entities/epic.entity";
import { Board } from "../../domain/entities/board.entity";
import { ProjectMember } from "../../domain/entities/project-members.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "saba@1234",
  database: "sprintify",
  synchronize: true, // dev only! disable in prod
  // logging: true, // comment this line in prod
  logging: ['error', 'warn'], // comment out in prod
  entities: [
    Board,
    BoardColumn,
    Epic,
    Issue,
    ProjectMember,
    Project,
    Sprint,
    Status,
    User,
  ],
});
