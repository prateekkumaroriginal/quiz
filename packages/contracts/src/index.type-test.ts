import type {
  Difficulty,
  GetQuestionsInput,
  GetQuestionsOutputWithAnswers,
  Question,
  QuestionWithAnswer,
} from "./index.js";


let d: Difficulty = "easy";

// @ts-expect-error
d = "impossible";

let q1: GetQuestionsInput = {
    count: 1,
    category: "science"
}

// @ts-expect-error
let q2: GetQuestionsInput = {
    category: "science"
}

const outputWithAnswers: GetQuestionsOutputWithAnswers = {
  questions: [
    {
      id: "1",
      category: "science",
      difficulty: "easy",
      prompt: "What color is the sky?",
      choices: ["Blue", "Green"],
      correctChoiceIndex: 0,
    },
  ],
};

void outputWithAnswers;

declare const questionWithAnswer: QuestionWithAnswer;

// @ts-expect-error an answer-bearing question is not answer-free
const answerFreeQuestion: Question = questionWithAnswer;

void answerFreeQuestion;
