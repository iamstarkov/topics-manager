import { addMaxPerPage } from "./api";

describe("api", () => {
  test("adds maximum per_page to the relative url", () => {
    expect(addMaxPerPage("/endpoint")).toBe("/endpoint?per_page=100");
  });

  test("adds maximum per_page to the relative url with a query parameter", () => {
    expect(addMaxPerPage("/endpoint?sort=asc")).toBe(
      "/endpoint?sort=asc&per_page=100"
    );
  });

  test("adds maximum per_page to the absolute url", () => {
    expect(addMaxPerPage("https://example.com/endpoint")).toBe(
      "https://example.com/endpoint?per_page=100"
    );
  });

  test("adds maximum per_page to the absolute url with a query parameter", () => {
    expect(addMaxPerPage("https://example.com/endpoint?sort=asc")).toBe(
      "https://example.com/endpoint?sort=asc&per_page=100"
    );
  });
});
