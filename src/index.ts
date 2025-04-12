import "reflect-metadata";
import { AppDataSource } from "./infrastructure/data-source";
import startServer from "./API";
import { ensureDatabaseExists } from "./infrastructure/init-db";

(async () => {
  await ensureDatabaseExists({
    dbName: "sprintify",
    user: "postgres",
    password: "saba@1234",
  });

  await AppDataSource.initialize();
  console.success("📦 DB connected & schema synced");
  startServer(4000);
})();
