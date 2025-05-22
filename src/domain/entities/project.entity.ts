import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from "typeorm";
import { BaseEntity, Board, ProjectMember, User } from ".";
@Entity("projects")
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 5 })
  keyPrefix!: string;

  @OneToOne(() => Board, (board) => board.project)
  board!: Board;

  @ManyToOne(() => User, { onDelete: "SET NULL", nullable: false })
  @JoinColumn({ name: "createdBy" })
  createdBy?: User;

  @OneToMany(() => ProjectMember, (member) => member.project)
  members!: ProjectMember[];
}
