import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { BaseEntity, ProjectMember, Sprint, User } from ".";
@Entity("projects")
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 5 })
  keyPrefix!: string;

  @ManyToOne(() => User, { onDelete: "SET NULL", nullable: false })
  @JoinColumn({ name: "createdBy" })
  createdBy?: User;

  @OneToMany(() => ProjectMember, (member) => member.project)
  members!: ProjectMember[];

  @OneToMany(() => Sprint, (sprint) => sprint.project)
  sprints!: Sprint[];
}
