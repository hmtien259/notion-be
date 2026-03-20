import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";
import { DocumentEntity } from "../../documents/entities/document.entity";

@Entity({ name: "workspaces" })
export class WorkspaceEntity {
  @PrimaryColumn("text")
  id!: string;

  @Column({ type: "text" })
  name!: string;

  @Column({ type: "text", unique: true })
  slug!: string;

  @Column({ type: "text" })
  ownerId!: string;

  @ManyToOne(() => UserEntity, (user) => user.ownedWorkspaces, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "ownerId" })
  owner!: UserEntity;

  @OneToMany(() => DocumentEntity, (document) => document.workspace)
  documents!: DocumentEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
