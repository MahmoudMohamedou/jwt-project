import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient({
  log: [{ level: "query", emit: "event" }, "error", "info", "warn"],
});

prismaClient.$on("query", (e) => {
  console.log("-------start---------");
  console.log("Query: " + e.query);
  console.log("Params: " + e.params);
  console.log("Duration: " + e.duration + "ms");
  console.log("-------end---------");
});

export const context = { prismaClient };
