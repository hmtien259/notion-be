import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkspacesModule } from "../workspaces/workspaces.module";
import { DocumentContentEntity } from "./entities/document-content.entity";
import { DocumentEntity } from "./entities/document.entity";
import { DocumentContentRepository } from "./repositories/document-content.repository";
import { DocumentRepository } from "./repositories/document.repository";
import { DocumentsController } from "./documents.controller";
import { DocumentsService } from "./documents.service";

@Module({
  imports: [TypeOrmModule.forFeature([DocumentEntity, DocumentContentEntity]), WorkspacesModule],
  controllers: [DocumentsController],
  providers: [DocumentRepository, DocumentContentRepository, DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
