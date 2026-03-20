import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";
import { WorkspaceEntity } from "../../workspaces/entities/workspace.entity";
import { DocumentContentEntity } from "./document-content.entity";

@Entity({ name: "documents" })
export class DocumentEntity {
  @PrimaryColumn("text")
  id!: string;

  @Column({ type: "text" })
  workspaceId!: string;

  @Column({ type: "text", nullable: true })
  parentId!: string | null;

  @Column({ type: "text" })
  title!: string;

  @Column({ type: "text", default: "PG" })
  icon!: string;

  @Column({ type: "text", nullable: true })
  coverStyle!: string | null;

  @Column({ type: "text", default: "Empty document" })
  preview!: string;

  @Column({ type: "integer", default: 0 })
  position!: number;

  @Column({ type: "text" })
  createdById!: string;

  @Column({ type: "text" })
  updatedById!: string;

  @Column({ type: "datetime", nullable: true })
  archivedAt!: Date | null;

  @ManyToOne(() => WorkspaceEntity, (workspace) => workspace.documents, { onDelete: "CASCADE" })
  @JoinColumn({ name: "workspaceId" })
  workspace!: WorkspaceEntity;

  @ManyToOne(() => DocumentEntity, (document) => document.children, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "parentId" })
  parent!: DocumentEntity | null;

  @OneToMany(() => DocumentEntity, (document) => document.parent)
  children!: DocumentEntity[];

  @OneToOne(() => DocumentContentEntity, (documentContent) => documentContent.document, {
    cascade: true,
  })
  contentRecord!: DocumentContentEntity;

  @ManyToOne(() => UserEntity, (user) => user.createdDocuments, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "createdById" })
  createdBy!: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.updatedDocuments, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "updatedById" })
  updatedBy!: UserEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

