import {
  GetQuestionsOutput,
  GetQuestionsOutputWithAnswers,
  type GetQuestionsInput,
} from "@quiz/contracts";
import { ArkErrors } from "arktype";

export type QuizSdkConfig = {
  baseUrl: string;
  fetch: typeof globalThis.fetch;
};

type GetQuestionsWithAnswersInput = GetQuestionsInput & {
  includeAnswer: true;
};

type GetQuestionsWithoutAnswersInput = GetQuestionsInput & {
  includeAnswer?: false;
};

export function getQuestions(
  input: GetQuestionsWithAnswersInput,
  config: QuizSdkConfig,
): Promise<GetQuestionsOutputWithAnswers>;

export function getQuestions(
  input: GetQuestionsWithoutAnswersInput,
  config: QuizSdkConfig,
): Promise<GetQuestionsOutput>;

export function getQuestions(
  input: GetQuestionsInput,
  config: QuizSdkConfig,
): Promise<GetQuestionsOutput | GetQuestionsOutputWithAnswers>;

export async function getQuestions(
  input: GetQuestionsInput,
  config: QuizSdkConfig,
) {
  const url = new URL("/questions", config.baseUrl);
  url.searchParams.set("category", input.category);
  url.searchParams.set("count", String(input.count));
  if (input.difficulty !== undefined) {
    url.searchParams.set("difficulty", input.difficulty);
  }
  if (input.includeAnswer !== undefined) {
    url.searchParams.set("includeAnswer", String(input.includeAnswer));
  }

  const resp = await config.fetch(url);
  if (!resp.ok) {
    throw new Error(`Quiz API request failed with status ${resp.status}`);
  }

  const data: unknown = await resp.json();

  const output: GetQuestionsOutput | GetQuestionsOutputWithAnswers | ArkErrors =
    input.includeAnswer
      ? GetQuestionsOutputWithAnswers(data)
      : GetQuestionsOutput(data);

  if (output instanceof ArkErrors) {
    throw new Error("Invalid quiz API response");
  }

  return output;
}
