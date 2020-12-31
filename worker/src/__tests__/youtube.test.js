import { getTextFromFixtureOrUrl } from "./helpers";
import YouTube from "../youtube";

describe("cached", () => {
  let yt;
  beforeEach(() => {
    yt = new YouTube({
      cache: true,
      cacheTimeout: 1,
    });
  });
  afterEach(async () => {
    await yt.cache.quit();
  });

  test("getChannelIdFromUrl", async () => {
    yt._getTextFromUrl = getTextFromFixtureOrUrl;
    yt._makeCacheKey = (url) => "test-cache-0";
    expect(await yt.cache.get("test-cache-0")).toBeNull();
    expect(
      await yt.getChannelIdFromUrl("http://www.youtube.com/c/TrueLittleMonk")
    ).toBe("UCGLC-euAIB3gHdPkTWNfg8g");
    expect(await yt.cache.get("test-cache-0")).toBe("UCGLC-euAIB3gHdPkTWNfg8g");
  });

  test("getTextFromUrl", async () => {
    yt._makeCacheKey = (url) => "test-cache-1";
    expect(await yt.cache.get("test-cache-1")).toBeNull();
    expect(
      await yt.getTextFromUrl("https://jsonplaceholder.typicode.com")
    ).toMatch(/<!doctype html>/i);
    expect(await yt.cache.get("test-cache-1")).toMatch(/<!doctype html>/i);
  });

  test("getJsonFromUrl", async () => {
    yt._makeCacheKey = (url) => "test-cache-2";
    expect(await yt.cache.get("test-cache-2")).toBeNull();
    expect(
      await yt.getJsonFromUrl("https://jsonplaceholder.typicode.com/todos/1")
    ).toHaveProperty("title");
    expect(await yt.cache.get("test-cache-2")).toMatch(/"title":/);
  });
});

describe("fixtures", () => {
  let yt;
  beforeEach(() => {
    yt = new YouTube({ apiKey: "__MOCK_API_KEY__" });
    yt._getTextFromUrl = getTextFromFixtureOrUrl;
  });

  describe("getChannelIdFromUrl", () => {
    const exp = (url, expected) => async () => {
      expect(await yt.getChannelIdFromUrl(url)).toBe(expected);
    };

    test("null", exp(null, false));
    test("invalid", exp("swiss cheese", false));
    test("another website", exp("https://www.vimeo.com/", false));

    test(
      "without scheme",
      exp("youtube.com/c/TrueLittleMonk", "UCGLC-euAIB3gHdPkTWNfg8g")
    );
    test(
      "mobile URL",
      exp("http://m.youtube.com/c/TrueLittleMonk", "UCGLC-euAIB3gHdPkTWNfg8g")
    );
    test(
      "tabbed URL",
      exp("www.youtube.com/c/TrueLittleMonk/videos", "UCGLC-euAIB3gHdPkTWNfg8g")
    );
    test(
      "channel ID",
      exp(
        "https://www.youtube.com/channel/UCIE4SeH_UJBNKqZvxkNFBDw",
        "UCIE4SeH_UJBNKqZvxkNFBDw"
      )
    );
    test(
      "user name",
      exp(
        "https://www.youtube.com/user/VimuttiMonastery",
        "UC1-yHZcaml1m7T4VDzb_syQ"
      )
    );
    test(
      "user name in base directory",
      exp(
        "https://www.youtube.com/VimuttiMonastery",
        "UC1-yHZcaml1m7T4VDzb_syQ"
      )
    );
    test(
      "channel name",
      exp(
        "https://www.youtube.com/c/TrueLittleMonk",
        "UCGLC-euAIB3gHdPkTWNfg8g"
      )
    );
    test(
      "channel with same user name",
      exp("https://www.youtube.com/user/AjahnSona", "UCCRXOn6Tsrgm9gJR4z3qLZA")
    );
    test(
      "channel name in base directory",
      exp(
        "https://www.youtube.com/PacificHermitage",
        "UCXQFa-qxHE26J_B5i22HCwA"
      )
    );
  });

  describe("getLatestVideoIdFromChannelId", () => {
    const exp = (channelId, expected) => async () => {
      expect(await yt.getLatestVideoIdFromChannelId(channelId)).toBe(expected);
    };

    test("null", exp(null, false));
    test("invalid", exp("bubble", false));
    test("correct", exp("UCFAuQ5fmYYVv5_Dim0EQpVA", "I0l5KDDIA0E"));
    test("playlist", exp("PLovEdNVTK2lGAgk12lyJzjfr4vAxK8XQP", false));
  });

  describe("getVideoDataFromVideoIds", () => {
    const exp = (ids, expected) => async () => {
      expect(await yt.getVideoDataFromVideoIds(ids)).toEqual(expected);
    };

    const dataMatcher = (id, live) => {
      const matcher = {
        id,
        snippet: expect.objectContaining({
          title: expect.any(String),
          liveBroadcastContent: expect.anything(),
        }),
        status: expect.objectContaining({
          embeddable: expect.any(Boolean),
        }),
      };
      if (live) {
        matcher.liveStreamingDetails = expect.objectContaining({
          scheduledStartTime: expect.any(String),
        });
      }
      return expect.objectContaining(matcher);
    };

    test("null", exp(null, false));
    test("no IDs", exp([], false));
    test(
      "single ID",
      exp(
        "BgsbBWcKch8",
        expect.objectContaining({
          BgsbBWcKch8: dataMatcher("BgsbBWcKch8", true),
        })
      )
    );
    test(
      "multiple IDs",
      exp(
        ["BgsbBWcKch8", "h31f6iD2GZ8", "wzftjU_n4MI"],
        expect.objectContaining({
          BgsbBWcKch8: dataMatcher("BgsbBWcKch8", true),
          h31f6iD2GZ8: dataMatcher("h31f6iD2GZ8", false),
          wzftjU_n4MI: dataMatcher("wzftjU_n4MI", false),
        })
      )
    );
  });

  describe("getVideoIdFromUrl", () => {
    const exp = (url, expected) => async () => {
      expect(await yt.getVideoIdFromUrl(url)).toBe(expected);
    };

    test("null", exp(null, false));
    test("invalid", exp("green", false));
    test("short", exp("https://youtu.be/BgsbBWcKch8", "BgsbBWcKch8"));

    test(
      "regular",
      exp("https://www.youtube.com/watch?v=BgsbBWcKch8", "BgsbBWcKch8")
    );
    test(
      "featured",
      exp(
        "https://www.youtube.com/watch?v=BgsbBWcKch8&feature=youtu.be",
        "BgsbBWcKch8"
      )
    );
    test(
      "without scheme",
      exp("youtube.com/watch?v=BgsbBWcKch8", "BgsbBWcKch8")
    );
  });
});
