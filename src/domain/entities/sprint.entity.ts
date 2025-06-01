import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { BaseEntity, Project, Issue } from ".";
@Entity("sprints")
export class Sprint extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 25 })
  name!: string;

  @Column({ type: "date" })
  startDate!: Date;

  @Column({ type: "date" })
  endDate!: Date;

  @Column()
  projectId!: string;

  @Column({ default: false })
  isActive!: boolean;

  @Column({ default: false })
  isComplete!: boolean;

  @ManyToOne(() => Project, { onDelete: "CASCADE" })
  @JoinColumn({ name: "projectId", referencedColumnName: "id" })
  project!: Project;

  @OneToMany(() => Issue, (issue) => issue.sprint)
  issues!: Issue[];
}
