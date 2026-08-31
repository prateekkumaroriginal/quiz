import {
  Category,
  Difficulty,
  type GetQuestionsError,
  GetQuestionsInput,
} from "@quiz/contracts";
import { ArkErrors, type } from "arktype";
import { questions } from "./questions.js";

const GetQuestionsQuery = type({
  count: "string.integer.parse",
  category: Category,
  "difficulty?": Difficulty,
  "includeAnswer?": type("'true' | 'false'").pipe((value) => value === "true"),
}).to(GetQuestionsInput);

export const handleRequest = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const count = url.searchParams.get("count");
  const includeAnswer = url.searchParams.get("includeAnswer");
  const difficulty = url.searchParams.get("difficulty");

  const input = GetQuestionsQuery({
    category,
    count,
    ...(includeAnswer !== null && { includeAnswer }),
    ...(difficulty !== null && { difficulty }),
  });

  if (input instanceof ArkErrors) {
    return Response.json(
      {
        code: "INVALID_REQUEST",
        message: "The request parameters are invalid",
      } satisfies GetQuestionsError,
      {
        status: 400,
      },
    );
  }

  const selectedQuestions = questions
    .filter(
      (q) =>
        q.category === input.category &&
        (input.difficulty === undefined || input.difficulty === q.difficulty),
    )
    .slice(0, input.count);

  const responseQuestions = input.includeAnswer
    ? selectedQuestions
    : selectedQuestions.map(({ correctChoiceIndex, ...q }) => q);

  return Response.json({ questions: responseQuestions }, { status: 200 });
};
