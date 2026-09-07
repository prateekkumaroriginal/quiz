import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { config } from "dotenv";
import process from "node:process";
import { choicesTable, questionsTable } from "./db/schema.js";
import { eq } from "drizzle-orm";

config({ path: new URL("../.env", import.meta.url), quiet: true });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required for database integration tests");
}

const { app } = await import("./app.js");
const { closeDatabase, db } = await import("./db/client.js");

const fixtureId = "00000000-0000-4000-8000-000000000099";

describe("database-backed quiz API", () => {
  beforeAll(async () => {
    await db.transaction(async (tx) => {
      await tx
        .delete(questionsTable)
        .where(eq(questionsTable.id, fixtureId));

      await tx.insert(questionsTable).values({
        id: fixtureId,
        prompt: "Which planet is known as the Red Planet?",
        category: "geography",
        difficulty: "hard",
      });

      await tx.insert(choicesTable).values([
        {
          questionId: fixtureId,
          position: 0,
          text: "Venus",
          isCorrect: false,
        },
        {
          questionId: fixtureId,
          position: 1,
          text: "Mars",
          isCorrect: true,
        },
      ]);
    });
  });

  afterAll(async () => {
    await db.delete(questionsTable).where(eq(questionsTable.id, fixtureId));
    await closeDatabase();
  });

  it("returns questions read from PostgreSQL", async () => {
    const response = await app.request(
      "/questions?category=geography&difficulty=hard&count=1&includeAnswer=true",
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      questions: [
        {
          id: fixtureId,
          prompt: "Which planet is known as the Red Planet?",
          category: "geography",
          difficulty: "hard",
          choices: ["Venus", "Mars"],
          correctChoiceIndex: 1,
        },
      ],
    });
  });
});
