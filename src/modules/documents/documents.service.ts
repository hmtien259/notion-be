import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "crypto";
import { DEFAULT_USER_ID } from "../workspaces/constants/default-workspace.constants";
import { WorkspaceRepository } from "../workspaces/repositories/workspace.repository";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { UpdateDocumentContentDto } from "./dto/update-document-content.dto";
import { UpdateDocumentDto } from "./dto/update-document.dto";
import { DocumentContentEntity } from "./entities/document-content.entity";
import { DocumentEntity } from "./entities/document.entity";
import { createEmptyDocumentContent, extractPreviewFromContent } from "./lib/document-content.util";
import { buildDocumentTree } from "./lib/document-tree.util";
import { DocumentContentRepository } from "./repositories/document-content.repository";
import { DocumentRepository } from "./repositories/document.repository";

@Injectable()
export class DocumentsService {
  constructor(
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly documentRepository: DocumentRepository,
    private readonly documentContentRepository: DocumentContentRepository,
  ) {}

  async getDocumentTree(workspaceId: string) {
    await this.ensureWorkspaceExists(workspaceId);
    const documents = await this.documentRepository.findTreeByWorkspace(workspaceId);
    return buildDocumentTree(documents);
  }

  async getDocumentById(documentId: string) {
    const document = await this.findDocumentOrThrow(documentId);

    return {
      id: document.id,
      workspaceId: document.workspaceId,
      parentId: document.parentId,
      title: document.title,
      icon: document.icon,
      coverStyle: document.coverStyle,
      preview: document.preview,
      content: document.contentRecord.content,
      contentVersion: document.contentRecord.version,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }

  async createRootDocument(workspaceId: string, dto: CreateDocumentDto) {
    await this.ensureWorkspaceExists(workspaceId);
    return this.createDocument(workspaceId, null, dto);
  }

  async createChildDocument(parentId: string, dto: CreateDocumentDto) {
    const parentDocument = await this.findDocumentOrThrow(parentId);
    return this.createDocument(parentDocument.workspaceId, parentDocument.id, dto);
  }

  async updateDocument(documentId: string, dto: UpdateDocumentDto) {
    const document = await this.findDocumentOrThrow(documentId);

    if (dto.title) {
      document.title = dto.title.trim();
    }

    if (dto.icon) {
      document.icon = dto.icon.trim();
    }

    if (dto.coverStyle !== undefined) {
      document.coverStyle = dto.coverStyle;
    }

    const savedDocument = await this.documentRepository.save(document);
    return this.getDocumentById(savedDocument.id);
  }

  async updateDocumentContent(documentId: string, dto: UpdateDocumentContentDto) {
    const document = await this.findDocumentOrThrow(documentId);

    if (dto.title) {
      document.title = dto.title.trim();
    }

    if (dto.icon) {
      document.icon = dto.icon.trim();
    }

    if (dto.coverStyle !== undefined) {
      document.coverStyle = dto.coverStyle;
    }

    document.preview = extractPreviewFromContent(dto.content);
    document.updatedById = DEFAULT_USER_ID;

    const contentRecord = document.contentRecord;
    contentRecord.content = dto.content;
    contentRecord.version += 1;

    await this.documentContentRepository.save(contentRecord);
    await this.documentRepository.save(document);

    return this.getDocumentById(document.id);
  }

  async archiveDocument(documentId: string) {
    const rootDocument = await this.findDocumentOrThrow(documentId);
    const allDocuments = await this.documentRepository.findTreeByWorkspace(rootDocument.workspaceId);
    const archiveIds = new Set<string>([rootDocument.id]);
    let changed = true;

    while (changed) {
      changed = false;

      allDocuments.forEach((document) => {
        if (document.parentId && archiveIds.has(document.parentId) && !archiveIds.has(document.id)) {
          archiveIds.add(document.id);
          changed = true;
        }
      });
    }

    await Promise.all(
      allDocuments
        .filter((document) => archiveIds.has(document.id))
        .map((document) => {
          document.archivedAt = new Date();
          document.updatedById = DEFAULT_USER_ID;
          return this.documentRepository.save(document);
        }),
    );

    return {
      archivedIds: [...archiveIds],
    };
  }

  private async createDocument(workspaceId: string, parentId: string | null, dto: CreateDocumentDto) {
    const title = dto.title?.trim() || "Untitled";
    const icon = dto.icon?.trim() || title.slice(0, 2).toUpperCase();
    const coverStyle = dto.coverStyle ?? null;
    const content = createEmptyDocumentContent();
    const documentId = randomUUID();
    const position = await this.documentRepository.nextPosition(workspaceId, parentId);

    const document = this.documentRepository.create({
      id: documentId,
      workspaceId,
      parentId,
      title,
      icon,
      coverStyle,
      preview: extractPreviewFromContent(content),
      position,
      createdById: DEFAULT_USER_ID,
      updatedById: DEFAULT_USER_ID,
      archivedAt: null,
    });

    const contentRecord = this.documentContentRepository.create({
      id: randomUUID(),
      documentId,
      content,
      version: 1,
      schemaVersion: 1,
    });

    document.contentRecord = contentRecord as DocumentContentEntity;

    await this.documentRepository.save(document);
    await this.documentContentRepository.save(contentRecord);

    return this.getDocumentById(documentId);
  }

  private async ensureWorkspaceExists(workspaceId: string) {
    const workspace = await this.workspaceRepository.findById(workspaceId);

    if (!workspace) {
      throw new NotFoundException("Workspace not found");
    }

    return workspace;
  }

  private async findDocumentOrThrow(documentId: string) {
    const document = await this.documentRepository.findById(documentId);

    if (!document) {
      throw new NotFoundException("Document not found");
    }

    return document;
  }
}

