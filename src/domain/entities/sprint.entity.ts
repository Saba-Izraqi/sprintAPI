import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { Board } from "./board.entity";

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
  boardProjectId!: string;

  @ManyToOne(() => Board, { onDelete: "CASCADE" })
  @JoinColumn({ name: "boardProjectId", referencedColumnName: "projectId" })
  board!: Board;
}
