export function configuration() {
  return {
    nodeEnv: process.env.NODE_ENV ?? "development",
    port: Number(process.env.PORT ?? 4000),
    databasePath: process.env.DATABASE_PATH ?? "./data/notion-hmt.sqlite",
  };
}

