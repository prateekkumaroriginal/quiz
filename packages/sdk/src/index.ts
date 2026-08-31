import {
  GetQuestionsError,
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

  let resp: Response;
  try {
    resp = await config.fetch(url);
  } catch (cause) {
    throw new Error(`Could not reach quiz API`, { cause });
  }

  if (!resp.ok) {
    const data: unknown = await resp.json();
    const parsedError = GetQuestionsError(data);

    if (parsedError instanceof ArkErrors) {
      throw new Error(`Quiz API request failed with status ${resp.status}`);
    }

    throw new QuizApiError(resp.status, parsedError);
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

export class QuizApiError extends Error {
  readonly status: number;
  readonly code: GetQuestionsError["code"];

  constructor(status: number, error: GetQuestionsError) {
    super(error.message);
    this.name = "QuizApiError";
    this.status = status;
    this.code = error.code;
  }
}
