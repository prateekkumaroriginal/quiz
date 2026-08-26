import { Category, GetQuestionsInput } from "@quiz/contracts";
import { ArkErrors, type } from "arktype";
import { questions } from "./questions.js";

const GetQuestionsQuery = type({
  count: "string.integer.parse",
  category: Category,
  "includeAnswer?": type("'true' | 'false'").pipe((value) => value === "true"),
}).to(GetQuestionsInput);

export const handleRequest = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const count = url.searchParams.get("count");
  const includeAnswer = url.searchParams.get("includeAnswer");

  const input = GetQuestionsQuery({
    category,
    count,
    ...(includeAnswer !== null && { includeAnswer }),
  });

  if (input instanceof ArkErrors) {
    return new Response(null, {
      status: 400,
    });
  }

  const selectedQuestions = questions
    .filter((q) => q.category === input.category)
    .slice(0, input.count);

  const responseQuestions = input.includeAnswer
    ? selectedQuestions
    : selectedQuestions.map(({ correctChoiceIndex, ...q }) => q);

  return Response.json({ questions: responseQuestions }, { status: 200 });
};
