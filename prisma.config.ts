// // Load .env into process.env when running Prisma commands (migrations, seed, etc.)
// import "dotenv/config";
import { defineConfig, env } from "prisma/config";


type Env = {
  DATABASE_URL: string
}
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env<Env>('DATABASE_URL'),
  },
});
