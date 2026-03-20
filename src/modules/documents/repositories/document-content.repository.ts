import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DocumentContentEntity } from "../entities/document-content.entity";

@Injectable()
export class DocumentContentRepository {
  constructor(
    @InjectRepository(DocumentContentEntity)
    private readonly repository: Repository<DocumentContentEntity>,
  ) {}

  create(data: Partial<DocumentContentEntity>) {
    return this.repository.create(data);
  }

  save(documentContent: DocumentContentEntity) {
    return this.repository.save(documentContent);
  }
}

