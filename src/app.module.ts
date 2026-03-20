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
      useFactory: (configService: ConfigService) => ({
        type: "postgres" as const,
        host: configService.getOrThrow<string>("database.host"),
        port: configService.getOrThrow<number>("database.port"),
        database: configService.getOrThrow<string>("database.name"),
        username: configService.getOrThrow<string>("database.user"),
        password: configService.getOrThrow<string>("database.password"),
        ssl: configService.get<boolean>("database.ssl") ? { rejectUnauthorized: false } : false,
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UsersModule,
    WorkspacesModule,
    DocumentsModule,
  ],
})
export class AppModule {}
