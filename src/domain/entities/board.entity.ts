import { Entity, PrimaryColumn, OneToOne, JoinColumn, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Project } from "./project.entity";
import { Sprint } from "./sprint.entity";

@Entity("boards")
export class Board extends BaseEntity {
  // Shared PK to enforce 1:1 relationship with the project
  // Each project should has 1 board, and each board should relate to 1 project.
  // Future Work: should add an Id for the board when offer multiple board feat  for each project
  @PrimaryColumn()
  projectId!: string;

  // NOTE: Currently this field may doesn't make sense,
  // but I am build a schema that has the ability to allow multiple board for each project
  @Column({ length })
  name!: string;

  @OneToMany(() => Sprint, (sprint) => sprint.board)
  sprints!: Sprint[];

  @OneToOne(() => Project, { onDelete: "CASCADE" })
  @JoinColumn({ name: "projectId" }) // Shared PK-FK
  project!: Project;
}
