import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
  Unique,
} from "typeorm";
import { BaseEntity, Board, ProjectMember, User } from ".";
@Entity("projects")
@Unique(["keyPrefix", "createdBy"])
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 10 })
  keyPrefix!: string;

  @OneToOne(() => Board, (board) => board.project)
  board!: Board;

  @ManyToOne(() => User, { onDelete: "SET NULL", nullable: false })
  @JoinColumn({ name: "createdBy" })
  createdBy?: User;

  @OneToMany(() => ProjectMember, (member) => member.project)
  members!: ProjectMember[];
}