interface EnvInput {
  PORT?: string;
  DATABASE_PATH?: string;
  NODE_ENV?: string;
}

export function validateEnvironment(config: EnvInput) {
  const port = Number(config.PORT ?? 4000);

  if (Number.isNaN(port) || port <= 0) {
    throw new Error("PORT must be a positive number");
  }

  return {
    PORT: String(port),
    DATABASE_PATH: config.DATABASE_PATH ?? "./data/notion-hmt.sqlite",
    NODE_ENV: config.NODE_ENV ?? "development",
  };
}

