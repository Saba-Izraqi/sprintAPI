import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { BaseEntity, Status } from ".";

@Entity("columns")
export class BoardColumn extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 25 })
  name!: string;

  @Column({ type: "int" })
  order!: number;

  @OneToMany(() => Status, (status) => status.column, { cascade: true })
  statuses!: Status[];
}
