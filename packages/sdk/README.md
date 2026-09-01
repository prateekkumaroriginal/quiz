# Quiz SDK

A TypeScript SDK for fetching runtime-validated quiz questions.

## Install

```bash
pnpm add @prateekkumaroriginal/quiz-sdk
```

## Fetch questions

```ts
import { getQuestions } from "@prateekkumaroriginal/quiz-sdk";

const output = await getQuestions(
  {
    category: "science",
    count: 5,
    difficulty: "easy",
  },
  {
    baseUrl: "https://api.example.com",
    fetch,
  },
);

console.log(output.questions);
```

Replace `https://api.example.com` with the URL of your Quiz API.

## Include answers

```ts
const output = await getQuestions(
  {
    category: "science",
    count: 5,
    includeAnswer: true,
  },
  {
    baseUrl: "https://api.example.com",
    fetch,
  },
);

console.log(output.questions[0]?.correctChoiceIndex);
```

When `includeAnswer` is `true`, TypeScript includes `correctChoiceIndex` in the returned question type. Otherwise, the response does not contain answers.
