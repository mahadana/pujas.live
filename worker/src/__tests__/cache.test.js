import Cache from "../cache";

describe("cache", () => {
  let cache;
  beforeEach(() => {
    cache = new Cache();
  });
  afterEach(async () => {
    await cache.quit();
  });

  test("basics", async () => {
    expect(await cache.del("test-cache-basics")).not.toBeNull();
    expect(await cache.get("test-cache-basics")).toBeNull();
    expect(await cache.set("test-cache-basics", 123)).toBe("OK");
    expect(await cache.expire("test-cache-basics", 1)).toBe(1);
    expect(await cache.del("test-cache-basics")).toBe(1);
  });
});
