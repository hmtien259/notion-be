import { Injectable, OnModuleInit } from "@nestjs/common";
import { UserRepository } from "../../users/repositories/user.repository";
import { DEFAULT_USER_ID, DEFAULT_WORKSPACE_ID } from "../constants/default-workspace.constants";
import { WorkspaceRepository } from "../repositories/workspace.repository";

@Injectable()
export class WorkspaceBootstrapService implements OnModuleInit {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly workspaceRepository: WorkspaceRepository,
  ) {}

  async onModuleInit() {
    let owner = await this.userRepository.findByEmail("owner@notion-hmt.local");

    if (!owner) {
      owner = await this.userRepository.create({
        id: DEFAULT_USER_ID,
        email: "owner@notion-hmt.local",
        displayName: "Workspace Owner",
      });
    }

    const existingWorkspace = await this.workspaceRepository.findById(DEFAULT_WORKSPACE_ID);

    if (!existingWorkspace) {
      await this.workspaceRepository.create({
        id: DEFAULT_WORKSPACE_ID,
        name: "Notion HMT",
        slug: "notion-hmt",
        ownerId: owner.id,
      });
    }
  }
}
