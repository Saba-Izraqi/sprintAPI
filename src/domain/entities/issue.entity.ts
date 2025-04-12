import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { Board } from "./board.entity";
import { User } from "./user.entity";
import { Epic } from "./epic.entity";
import { Sprint } from "./sprint.entity";
import { Status } from "./status.entity";

@Entity("issues")
export class Issue extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  key!: string;

  @Column({ length: 250 })
  title!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "int" })
  storyPoint!: number;

  @Column({ nullable: true })
  statusId!: string;

  @Column({ nullable: true })
  assignee!: string;

  @Column({ nullable: true })
  epicId!: string;

  @Column({ nullable: true })
  sprintId!: string;

  @Column()
  boardProjectId!: string;

  @ManyToOne(() => User, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "assignee", referencedColumnName: "id" })
  assigneeUser!: User;

  @ManyToOne(() => Board, { onDelete: "CASCADE", nullable: false })
  @JoinColumn({ name: "boardProjectId", referencedColumnName: "projectId" })
  board!: Board;

  @ManyToOne(() => Epic, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "epicId" })
  epic!: Epic;

  @ManyToOne(() => Sprint, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "sprintId" })
  sprint!: Sprint;

  @ManyToOne(() => Status, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "statusId" })
  status!: Status;
}
