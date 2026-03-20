import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";
import { WorkspaceEntity } from "./entities/workspace.entity";
import { WorkspaceRepository } from "./repositories/workspace.repository";
import { WorkspaceBootstrapService } from "./services/workspace-bootstrap.service";

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceEntity]), UsersModule],
  providers: [WorkspaceRepository, WorkspaceBootstrapService],
  exports: [WorkspaceRepository, TypeOrmModule],
})
export class WorkspacesModule {}
