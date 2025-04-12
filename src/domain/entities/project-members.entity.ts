import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
  Unique,
  OneToMany,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";
import { Project } from "./project.entity";

export enum ProjectPermission {
  MEMBER = 0,
  MODERATOR = 1,
  ADMINISTRATOR = 2,
}

@Entity("project_members")
@Unique(["user", "project"]) // Prevent duplicate memberships
export class ProjectMember extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user.projectMemberships, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user!: User;

  @ManyToOne(() => Project, (project) => project.members, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "projectId" })
  project!: Project;

  @Column({ type: "int", default: ProjectPermission.MEMBER })
  permission!: ProjectPermission;

  @OneToMany(() => ProjectMember, (member) => member.user)
  projectMemberships!: ProjectMember[];
}
