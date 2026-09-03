import { describe, expect, it } from "vitest";
import { app } from "./app.js";

describe("quiz API", () => {
  it("reports that the API is healthy", async () => {
    const response = await app.request("/health");

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ status: "ok" });
  });

  it("routes valid question requests", async () => {
    const response = await app.request(
      "/questions?category=science&count=1",
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      questions: [{ category: "science" }],
    });
  });

  it("allows a browser on another origin to read question responses", async () => {
    const response = await app.request(
      "/questions?category=science&count=1",
      {
        headers: { Origin: "https://quiz-client.example" },
      },
    );

    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });
});
