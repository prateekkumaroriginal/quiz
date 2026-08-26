import {
  GetQuestionsOutput,
  GetQuestionsOutputWithAnswers,
} from "@quiz/contracts";
import { ArkErrors } from "arktype";
import { describe, expect, it } from "vitest";
import { handleRequest } from "./index.js";

describe("handleRequest", () => {
  it("returns 400 when category is missing", async () => {
    const request = new Request(
      "http://localhost/questions?count=1",
    );

    const response = await handleRequest(request);

    expect(response.status).toBe(400);
  });

  it("returns 200 when the request input is valid", async () => {
    const request = new Request(
      "http://localhost/questions?category=science&count=1",
    );

    const response = await handleRequest(request);

    expect(response.status).toBe(200);
  });

  it("returns 400 when count is not a plain integer string", async () => {
    const request = new Request(
      "http://localhost/questions?category=science&count=1e1",
    );

    const response = await handleRequest(request);

    expect(response.status).toBe(400);
  });

  it("returns the requested answer-free questions as JSON", async () => {
    const request = new Request(
      "http://localhost/questions?category=science&count=1",
    );

    const response = await handleRequest(request);
    const body: unknown = await response.json();
    const output = GetQuestionsOutput(body);

    if (output instanceof ArkErrors) {
      throw new Error(output.summary);
    }

    expect(output.questions).toHaveLength(1);
    expect(output.questions[0]?.category).toBe("science");
    expect(output.questions[0]).not.toHaveProperty("correctChoiceIndex");
  });

  it("includes answers when includeAnswer is true", async () => {
    const request = new Request(
      "http://localhost/questions?category=science&count=1&includeAnswer=true",
    );

    const response = await handleRequest(request);
    const body: unknown = await response.json();
    const output = GetQuestionsOutputWithAnswers(body);

    if (output instanceof ArkErrors) {
      throw new Error(output.summary);
    }

    expect(output.questions).toHaveLength(1);
    expect(output.questions[0]?.correctChoiceIndex).toBe(1);
  });
});
