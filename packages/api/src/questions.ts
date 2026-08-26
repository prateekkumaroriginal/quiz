import type { QuestionWithAnswer } from "@quiz/contracts";

export const questions = [
  {
    id: "2",
    prompt: "Which sense organ helps to see?",
    category: "science",
    choices: ["ears", "eyes"],
    correctChoiceIndex: 1,
    difficulty: "easy",
  },
] satisfies QuestionWithAnswer[];
