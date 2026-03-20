import { IsObject, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateDocumentContentDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  icon?: string;

  @IsOptional()
  @IsString()
  coverStyle?: string;

  @IsObject()
  content!: Record<string, unknown>;
}

