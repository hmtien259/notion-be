import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { UpdateDocumentContentDto } from "./dto/update-document-content.dto";
import { UpdateDocumentDto } from "./dto/update-document.dto";
import { DocumentsService } from "./documents.service";

@Controller()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get("workspaces/:workspaceId/documents/tree")
  getDocumentTree(@Param("workspaceId") workspaceId: string) {
    return this.documentsService.getDocumentTree(workspaceId);
  }

  @Get("documents/:documentId")
  getDocumentById(@Param("documentId") documentId: string) {
    return this.documentsService.getDocumentById(documentId);
  }

  @Post("workspaces/:workspaceId/documents")
  createRootDocument(
    @Param("workspaceId") workspaceId: string,
    @Body() dto: CreateDocumentDto,
  ) {
    return this.documentsService.createRootDocument(workspaceId, dto);
  }

  @Post("documents/:documentId/children")
  createChildDocument(
    @Param("documentId") documentId: string,
    @Body() dto: CreateDocumentDto,
  ) {
    return this.documentsService.createChildDocument(documentId, dto);
  }

  @Patch("documents/:documentId")
  updateDocument(
    @Param("documentId") documentId: string,
    @Body() dto: UpdateDocumentDto,
  ) {
    return this.documentsService.updateDocument(documentId, dto);
  }

  @Patch("documents/:documentId/content")
  updateDocumentContent(
    @Param("documentId") documentId: string,
    @Body() dto: UpdateDocumentContentDto,
  ) {
    return this.documentsService.updateDocumentContent(documentId, dto);
  }

  @Delete("documents/:documentId")
  archiveDocument(@Param("documentId") documentId: string) {
    return this.documentsService.archiveDocument(documentId);
  }
}

