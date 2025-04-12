import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { BoardColumn } from "./board-column.entity";

export enum StatusType {
  BACKLOG = 0,
  IN_PROGRESS = 1,
  DONE = 2,
}

@Entity("status")
export class Status extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ type: "int", default: StatusType.IN_PROGRESS })
  type!: StatusType;

  @ManyToOne(() => BoardColumn, (column) => column.statuses, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "column_id" })
  column?: BoardColumn;
}
