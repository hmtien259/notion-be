import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { DocumentEntity } from "./document.entity";

@Entity({ name: "document_contents" })
export class DocumentContentEntity {
  @PrimaryColumn("text")
  id!: string;

  @Column({ type: "text", unique: true })
  documentId!: string;

  @Column({ type: "simple-json" })
  content!: Record<string, unknown>;

  @Column({ type: "integer", default: 1 })
  version!: number;

  @Column({ type: "integer", default: 1 })
  schemaVersion!: number;

  @OneToOne(() => DocumentEntity, (document) => document.contentRecord, { onDelete: "CASCADE" })
  @JoinColumn({ name: "documentId" })
  document!: DocumentEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

