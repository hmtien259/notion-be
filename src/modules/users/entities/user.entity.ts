import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { WorkspaceEntity } from "../../workspaces/entities/workspace.entity";
import { DocumentEntity } from "../../documents/entities/document.entity";

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryColumn("text")
  id!: string;

  @Column({ type: "text", unique: true })
  email!: string;

  @Column({ type: "text" })
  displayName!: string;

  @OneToMany(() => WorkspaceEntity, (workspace) => workspace.owner)
  ownedWorkspaces!: WorkspaceEntity[];

  @OneToMany(() => DocumentEntity, (document) => document.createdBy)
  createdDocuments!: DocumentEntity[];

  @OneToMany(() => DocumentEntity, (document) => document.updatedBy)
  updatedDocuments!: DocumentEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
