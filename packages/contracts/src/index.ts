import { type } from "arktype";

export const Category = type("'science' | 'history' | 'geography'");
export type Category = typeof Category.infer;

export const Difficulty = type("'easy' | 'medium' | 'hard'");
export type Difficulty = typeof Difficulty.infer;

export const QuestionWithAnswer = type({
  "+": "reject",
  id: "string",
  category: Category,
  difficulty: Difficulty,
  prompt: "string",
  choices: "string[] >= 2",
  correctChoiceIndex: "number.integer >= 0",
}).narrow((q, ctx) =>
  q.correctChoiceIndex < q.choices.length
  ? true
  : ctx.mustBe("have a correctChoiceIndex within choices"),
);
export type QuestionWithAnswer = typeof QuestionWithAnswer.infer;

export const Question = QuestionWithAnswer.omit("correctChoiceIndex");
export type Question = typeof Question.infer;

export const GetQuestionsInput = type({
  category: Category,
  "difficulty?": Difficulty,
  count: "1 <= number.integer <= 50",
  includeAnswers: "boolean?"
});
export type GetQuestionsInput = typeof GetQuestionsInput.infer;

export const GetQuestionsOutput = type({
  questions: Question.array()
});
export type GetQuestionsOutput = typeof GetQuestionsOutput.infer;

export const GetQuestionsOutputWithAnswers = GetQuestionsOutput.merge({
  questions: QuestionWithAnswer.array(),
});

export type GetQuestionsOutputWithAnswers = typeof GetQuestionsOutputWithAnswers.infer;