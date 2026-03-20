import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WorkspaceEntity } from "../entities/workspace.entity";

@Injectable()
export class WorkspaceRepository {
  constructor(
    @InjectRepository(WorkspaceEntity)
    private readonly repository: Repository<WorkspaceEntity>,
  ) {}

  findById(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  findBySlug(slug: string) {
    return this.repository.findOne({ where: { slug } });
  }

  create(data: Partial<WorkspaceEntity>) {
    return this.repository.save(this.repository.create(data));
  }
}

