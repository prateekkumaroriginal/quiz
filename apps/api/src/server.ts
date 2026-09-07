import { serve } from "@hono/node-server";
import { app } from "./app.js";
import process from "node:process";
import { closeDatabase } from "./db/client.js";

const server = serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT ?? 3000),
  },
  (info) => {
    console.log(`Quiz API listening at port: ${info.port}`);
  },
);

const shutdown = () => {
  server.close(async () => {
    await closeDatabase();
  });
};

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
