import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from "typeorm";
import { Issue } from ".";
import { RelatedIssueType } from "../enums/types";

@Entity("related_issues")
export class RelatedIssue {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Issue, (issue) => issue.outgoingRelations, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "sourceIssueId" })
  sourceIssue!: Issue;

  @ManyToOne(() => Issue, (issue) => issue.incomingRelations, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "targetIssueId" })
  targetIssue!: Issue;

  @Column({ type: "enum", enum: RelatedIssueType })
  type!: RelatedIssueType;
}
