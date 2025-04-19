import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";
import { Board } from "./board.entity";
import { ProjectMember } from "./project-members.entity";

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

  @ManyToOne(() => User, {  nullable: false })
  @JoinColumn({ name: "createdByUserId" })
  createdBy!: User; 

  @OneToMany(() => ProjectMember, (member) => member.project)
  members!: ProjectMember[];
}
