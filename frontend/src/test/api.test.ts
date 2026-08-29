import { describe, it, expect, beforeEach } from "vitest";
import { cache } from "../services/api";

describe("RequestCache Utility", () => {
  beforeEach(() => {
    cache.clear();
  });

  it("should store and retrieve cached items", () => {
    cache.set("/test-url", { data: "testData" });
    const cached = cache.get("/test-url");
    expect(cached).toEqual({ data: "testData" });
  });

  it("should return null for non-existent cache keys", () => {
    const cached = cache.get("/non-existent");
    expect(cached).toBeNull();
  });

  it("should clear stored cache items", () => {
    cache.set("/test-url", { data: "testData" });
    cache.clear();
    expect(cache.get("/test-url")).toBeNull();
  });
});
