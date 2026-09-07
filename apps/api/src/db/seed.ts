import "dotenv/config";
import { eq } from "drizzle-orm";
import { closeDatabase, db } from "./client.js";
import { choicesTable, questionsTable } from "./schema.js";

const questionId = "00000000-0000-4000-8000-000000000002";

try {
  await db.transaction(async (tx) => {
    await tx
      .insert(questionsTable)
      .values({
        id: questionId,
        prompt: "Which sense organ helps to see?",
        category: "science",
        difficulty: "easy",
      })
      .onConflictDoUpdate({
        target: questionsTable.id,
        set: {
          prompt: "Which sense organ helps to see?",
          category: "science",
          difficulty: "easy",
        },
      });

    await tx
      .delete(choicesTable)
      .where(eq(choicesTable.questionId, questionId));

    await tx.insert(choicesTable).values([
      {
        questionId,
        position: 0,
        text: "ears",
        isCorrect: false,
      },
      {
        questionId,
        position: 1,
        text: "eyes",
        isCorrect: true,
      },
    ]);
  });

  console.log("Database seeded");
} finally {
  await closeDatabase();
}
