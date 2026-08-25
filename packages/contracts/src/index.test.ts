import { type } from "arktype";
import { describe, expect, it } from "vitest";

import {
  Category,
  Difficulty,
  GetQuestionsInput,
  GetQuestionsOutput,
  GetQuestionsOutputWithAnswers,
  Question,
  QuestionWithAnswer,
} from "./index.js";


describe("Category", () => {
  it("accepts a valid category", () => {
    expect(Category("science")).toBe("science");
  });

  it("rejects an invalid category", () => {
    expect(Category("sports")).toBeInstanceOf(type.errors);
  });
});

describe("Difficulty", () => {
  it("accepts a valid difficulty", () => {
    expect(Difficulty("medium")).toBe("medium");
  });

  it("rejects an invalid difficulty", () => {
    expect(Difficulty("impossible")).toBeInstanceOf(type.errors);
  });
});

describe("GetQuestionsInput", () => {
  it("accepts a valid request without difficulty", () => {
    const input = {
      category: "science",
      count: 10,
    };

    expect(GetQuestionsInput(input)).toEqual(input);
  });

  it("accepts a valid request with difficulty", () => {
    const input = {
      category: "history",
      difficulty: "hard",
      count: 5,
    };

    expect(GetQuestionsInput(input)).toEqual(input);
  });

  it("rejects a count below the allowed range", () => {
    const result = GetQuestionsInput({
      category: "science",
      count: 0,
    });

    expect(result).toBeInstanceOf(type.errors);
  });

  it("rejects a fractional count", () => {
    const result = GetQuestionsInput({
      category: "science",
      count: 1.5,
    });

    expect(result).toBeInstanceOf(type.errors);
  });

  it("rejects a non-boolean includeAnswers", () => {
    const result = GetQuestionsInput({
      category: "science",
      count: 5,
      includeAnswers: "yes",
    });

    expect(result).toBeInstanceOf(type.errors);
  });
});

describe("QuestionWithAnswer", () => {
  it("rejects a question with fewer than two choices", () => {
    const question = {
      id: "1",
      category: "science",
      difficulty: "easy",
      prompt: "How many colors are there in a rainbow?",
      choices: ["7"],
      correctChoiceIndex: 0,
    };

    expect(QuestionWithAnswer(question)).toBeInstanceOf(type.errors);
  });

  it("rejects a correctChoiceIndex outside choices", () => {
    const question = {
      id: "1",
      category: "science",
      difficulty: "easy",
      prompt: "How many colors are there in a rainbow?",
      choices: ["3", "7"],
      correctChoiceIndex: 2,
    };

    expect(QuestionWithAnswer(question)).toBeInstanceOf(type.errors);
  });
});

describe("QuestionWithoutAnswer", () => {
  it("rejects an included answer", () => {
    const question = {
      id: "1",
      category: "science",
      difficulty: "easy",
      prompt: "What color is the sky?",
      choices: ["Blue", "Green"],
      correctChoiceIndex: 0,
    };

    expect(Question(question)).toBeInstanceOf(type.errors);
  });
});

describe("GetQuestionsOutput", () => {
  it("accepts an answer-free questions response", () => {
    const output = {
      questions: [
        {
          id: "1",
          category: "science",
          difficulty: "easy",
          prompt: "What color is the sky?",
          choices: ["Blue", "Green"],
        },
      ],
    };

    expect(GetQuestionsOutput(output)).toEqual(output);
  });
});

describe("GetQuestionsOutputWithAnswers", () => {
  it("accepts a questions response containing answers", () => {
    const output = {
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

    expect(GetQuestionsOutputWithAnswers(output)).toEqual(output);
  });
});
