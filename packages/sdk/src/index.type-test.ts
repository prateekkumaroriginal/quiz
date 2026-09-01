import type { GetQuestionsOutputWithAnswers } from "@prateekkumaroriginal/quiz-contracts";
import {
  getQuestions,
  type Category,
  type Difficulty,
  type GetQuestionsError,
  type GetQuestionsInput,
  type GetQuestionsOutput,
  type GetQuestionsOutputWithAnswers as PublicGetQuestionsOutputWithAnswers,
  type Question,
  type QuestionWithAnswer,
  type QuizSdkConfig,
} from "./index.js";

type PublicContractTypes = {
  category: Category;
  difficulty: Difficulty;
  error: GetQuestionsError;
  input: GetQuestionsInput;
  output: GetQuestionsOutput;
  outputWithAnswers: PublicGetQuestionsOutputWithAnswers;
  question: Question;
  questionWithAnswer: QuestionWithAnswer;
};

declare const publicContractTypes: PublicContractTypes;
void publicContractTypes;

declare const config: QuizSdkConfig;

const verifyAnswerBearingReturnType = async () => {
  const output = await getQuestions(
    {
      category: "science",
      count: 1,
      includeAnswer: true,
    },
    config,
  );

  const outputWithAnswers: GetQuestionsOutputWithAnswers = output;

  void outputWithAnswers.questions[0]?.correctChoiceIndex;
};

void verifyAnswerBearingReturnType;
