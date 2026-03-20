import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { DocumentEntity } from "../entities/document.entity";

@Injectable()
export class DocumentRepository {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly repository: Repository<DocumentEntity>,
  ) {}

  findTreeByWorkspace(workspaceId: string) {
    return this.repository.find({
      where: {
        workspaceId,
        archivedAt: IsNull(),
      },
      relations: {
        contentRecord: true,
      },
      order: {
        position: "ASC",
        createdAt: "ASC",
      },
    });
  }

  findById(id: string) {
    return this.repository.findOne({
      where: {
        id,
        archivedAt: IsNull(),
      },
      relations: {
        contentRecord: true,
      },
    });
  }

  async nextPosition(workspaceId: string, parentId: string | null) {
    const count = await this.repository.count({
      where: {
        workspaceId,
        parentId: parentId ?? IsNull(),
        archivedAt: IsNull(),
      },
    });

    return count;
  }

  create(data: Partial<DocumentEntity>) {
    return this.repository.create(data);
  }

  save(document: DocumentEntity) {
    return this.repository.save(document);
  }
}
