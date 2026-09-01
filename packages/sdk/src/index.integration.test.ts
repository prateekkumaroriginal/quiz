import { handleRequest } from "@prateekkumaroriginal/quiz-api";
import { describe, expect, it } from "vitest";
import { getQuestions } from "./index.js";

describe("quiz SDK and API integration", () => {
  it("gets filtered answer-bearing questions through the HTTP contract", async () => {
    const apiFetch: typeof fetch = async (input, init) =>
      handleRequest(new Request(input, init));

    const output = await getQuestions(
      {
        category: "science",
        count: 1,
        difficulty: "easy",
        includeAnswer: true,
      },
      {
        baseUrl: "https://quiz.example",
        fetch: apiFetch,
      },
    );

    expect(output).toEqual({
      questions: [
        {
          id: "2",
          prompt: "Which sense organ helps to see?",
          category: "science",
          choices: ["ears", "eyes"],
          correctChoiceIndex: 1,
          difficulty: "easy",
        },
      ],
    });
  });
});
