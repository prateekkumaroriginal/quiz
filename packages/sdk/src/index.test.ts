import { describe, expect, it, vi } from "vitest";
import { getQuestions, QuizApiError } from "./index.js";

describe("getQuestions", () => {
  it("requests questions using the supplied options", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
      Response.json({ questions: [] }),
    );

    await getQuestions(
      {
        category: "science",
        count: 2,
      },
      {
        baseUrl: "https://quiz.example",
        fetch: fetchMock,
      },
    );

    expect(fetchMock).toHaveBeenCalledOnce();

    const request = new Request(fetchMock.mock.calls[0]![0]);
    const url = new URL(request.url);

    expect(request.method).toBe("GET");
    expect(url.origin).toBe("https://quiz.example");
    expect(url.pathname).toBe("/questions");
    expect(url.searchParams.get("category")).toBe("science");
    expect(url.searchParams.get("count")).toBe("2");
  });

  it("serializes optional request options", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
      Response.json({ questions: [] }),
    );

    await getQuestions(
      {
        category: "science",
        count: 2,
        difficulty: "hard",
        includeAnswer: true,
      },
      {
        baseUrl: "https://quiz.example",
        fetch: fetchMock,
      },
    );

    const request = new Request(fetchMock.mock.calls[0]![0]);
    const url = new URL(request.url);

    expect(url.searchParams.get("difficulty")).toBe("hard");
    expect(url.searchParams.get("includeAnswer")).toBe("true");
  });

  it("validates and returns an answer-bearing response when requested", async () => {
    const responseBody = {
      questions: [
        {
          id: "1",
          category: "science",
          difficulty: "easy",
          prompt: "How many colors are there in a rainbow?",
          choices: ["Seven", "Eight"],
          correctChoiceIndex: 0,
        },
      ],
    };
    const fetchMock = vi.fn<typeof fetch>(async () =>
      Response.json(responseBody),
    );

    const output = await getQuestions(
      {
        category: "science",
        count: 1,
        includeAnswer: true,
      },
      {
        baseUrl: "https://quiz.example",
        fetch: fetchMock,
      },
    );

    expect(output).toEqual(responseBody);
    expect(output.questions[0]).toHaveProperty("correctChoiceIndex", 0);
  });

  it("rejects a malformed API response", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
      Response.json({ questions: "not-an-array" }),
    );

    const result = getQuestions(
      {
        category: "science",
        count: 2,
      },
      {
        baseUrl: "https://quiz.example",
        fetch: fetchMock,
      },
    );

    await expect(result).rejects.toThrow("Invalid quiz API response");
  });

  it("rejects an unsuccessful HTTP response", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
      Response.json({ questions: [] }, { status: 503 }),
    );

    const result = getQuestions(
      {
        category: "science",
        count: 2,
      },
      {
        baseUrl: "https://quiz.example",
        fetch: fetchMock,
      },
    );

    await expect(result).rejects.toThrow(
      "Quiz API request failed with status 503",
    );
  });

  it("throws a typed API error from a contract error response", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
      Response.json(
        {
          code: "INVALID_REQUEST",
          message: "The request parameters are invalid",
        },
        { status: 400 },
      ),
    );

    const result = getQuestions(
      {
        category: "science",
        count: 2,
      },
      {
        baseUrl: "https://quiz.example",
        fetch: fetchMock,
      },
    );

    await expect(result).rejects.toBeInstanceOf(QuizApiError);
    await expect(result).rejects.toMatchObject({
      status: 400,
      code: "INVALID_REQUEST",
      message: "The request parameters are invalid",
    });
  });

  it("translates a network failure and preserves its cause", async () => {
    const networkError = new Error("socket disconnected");
    const fetchMock = vi.fn<typeof fetch>(async () => {
      throw networkError;
    });

    const result = getQuestions(
      {
        category: "science",
        count: 2,
      },
      {
        baseUrl: "https://quiz.example",
        fetch: fetchMock,
      },
    );

    await expect(result).rejects.toMatchObject({
      message: "Could not reach quiz API",
      cause: networkError,
    });
  });

});
