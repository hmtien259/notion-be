import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { configuration } from "./config/configuration";
import { validateEnvironment } from "./config/env.validation";
import { UsersModule } from "./modules/users/users.module";
import { WorkspacesModule } from "./modules/workspaces/workspaces.module";
import { DocumentsModule } from "./modules/documents/documents.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
      load: [configuration],
      validate: validateEnvironment,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databasePath = configService.getOrThrow<string>("databasePath");
        mkdirSync(dirname(databasePath), { recursive: true });

        return {
          type: "sqlite" as const,
          database: databasePath,
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    UsersModule,
    WorkspacesModule,
    DocumentsModule,
  ],
})
export class AppModule {}
