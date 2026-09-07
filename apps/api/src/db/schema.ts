import {
  categoryValues,
  difficultyValues,
} from "@prateekkumaroriginal/quiz-contracts";
import { sql } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  text,
  uuid,
  integer,
  boolean,
  unique,
  check,
} from "drizzle-orm/pg-core";

export const categoryEnum = pgEnum("question_category", categoryValues);
export const difficultyEnum = pgEnum("question_difficulty", difficultyValues);

export const questionsTable = pgTable("questions", {
  id: uuid().defaultRandom().primaryKey(),
  prompt: text().notNull(),
  category: categoryEnum().notNull(),
  difficulty: difficultyEnum().notNull(),
});

export const choicesTable = pgTable(
  "choices",
  {
    id: uuid().defaultRandom().primaryKey(),
    questionId: uuid("question_id")
      .notNull()
      .references(() => questionsTable.id, { onDelete: "cascade" }),
    position: integer().notNull(),
    text: text().notNull(),
    isCorrect: boolean("is_correct").notNull().default(false),
  },
  (table) => [
    unique().on(table.questionId, table.position),
    check("choices_position_non_negative", sql`${table.position} >= 0`),
  ],
);
