import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
  Unique,
  OneToMany,
} from "typeorm";
import { BaseEntity, Project, User } from ".";
import { ProjectPermission } from "../enums/types";

@Entity("project_members")
@Unique(["user", "project"]) // Prevent duplicate memberships
export class ProjectMember extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "int", default: ProjectPermission.MEMBER })
  permission!: ProjectPermission;
  
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

  @OneToMany(() => ProjectMember, (member) => member.user)
  projectMemberships!: ProjectMember[];
}
