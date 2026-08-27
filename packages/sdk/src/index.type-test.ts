import type { GetQuestionsOutputWithAnswers } from "@quiz/contracts";
import { getQuestions, type QuizSdkConfig } from "./index.js";

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
