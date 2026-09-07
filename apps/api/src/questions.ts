import type {
  GetQuestionsInput,
  QuestionWithAnswer,
} from "@prateekkumaroriginal/quiz-contracts";
import { db } from "./db/client.js";
import { choicesTable, questionsTable } from "./db/schema.js";
import { and, asc, eq, inArray } from "drizzle-orm";

export const findQuestions = async (
  input: GetQuestionsInput,
): Promise<QuestionWithAnswer[]> => {
  const questions = await db
    .select()
    .from(questionsTable)
    .where(
      and(
        eq(questionsTable.category, input.category),
        input.difficulty === undefined
          ? undefined
          : eq(questionsTable.difficulty, input.difficulty),
      ),
    )
    .orderBy(asc(questionsTable.id))
    .limit(input.count);

  if (questions.length === 0) {
    return [];
  }

  const choices = await db
    .select()
    .from(choicesTable)
    .where(
      inArray(
        choicesTable.questionId,
        questions.map((q) => q.id),
      ),
    )
    .orderBy(asc(choicesTable.questionId), asc(choicesTable.position));

  return questions.map((question) => {
    const questionChoices = choices.filter(
      (choice) => choice.questionId === question.id,
    );

    const correctChoiceIndex = questionChoices.findIndex(
      (choice) => choice.isCorrect,
    );

    return {
      ...question,
      choices: questionChoices.map((choice) => choice.text),
      correctChoiceIndex,
    };
  });
};
