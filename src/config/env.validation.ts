interface EnvInput {
  PORT?: string;
  NODE_ENV?: string;
  DB_HOST?: string;
  DB_PORT?: string;
  DB_NAME?: string;
  DB_USER?: string;
  DB_PASSWORD?: string;
  DB_SSL?: string;
}

export function validateEnvironment(config: EnvInput) {
  const port = Number(config.PORT ?? 4000);
  const databasePort = Number(config.DB_PORT ?? 5432);

  if (Number.isNaN(port) || port <= 0) {
    throw new Error("PORT must be a positive number");
  }

  if (Number.isNaN(databasePort) || databasePort <= 0) {
    throw new Error("DB_PORT must be a positive number");
  }

  return {
    PORT: String(port),
    NODE_ENV: config.NODE_ENV ?? "development",
    DB_HOST: config.DB_HOST ?? "localhost",
    DB_PORT: String(databasePort),
    DB_NAME: config.DB_NAME ?? "notion_hmt",
    DB_USER: config.DB_USER ?? "postgres",
    DB_PASSWORD: config.DB_PASSWORD ?? "postgres",
    DB_SSL: config.DB_SSL ?? "false",
  };
}


