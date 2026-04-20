import "dotenv/config";
import { buildApp } from "./app.js";
import { env } from "./config/env.js";

async function main() {
  const app = buildApp();
  try {
    await app.listen({ port: Number(env.PORT), host: "0.0.0.0" });
    app.log.info(`Server listening on port ${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
