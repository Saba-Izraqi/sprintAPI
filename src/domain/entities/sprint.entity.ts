import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { BaseEntity, Project } from ".";
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
  @Column({ default: false })
  isActive!: boolean;
  @Column({default: false})
  isArchived!: boolean;
  @Column()
  projectId!: string;

  @ManyToOne(() => Project, { onDelete: "CASCADE" })
  @JoinColumn({ name: "projectId", referencedColumnName: "id" })
  project!: Project;
}
