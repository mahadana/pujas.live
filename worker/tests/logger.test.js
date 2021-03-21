import { cleanMessage } from "@/logger";

describe("logger", () => {
  test("cleanMessage", () => {
    expect(cleanMessage(123)).toBe("123");
    expect(cleanMessage("hello")).toBe("hello");
    expect(
      cleanMessage(
        "got error: request to https://www.googleapis.com/" +
          "youtube/v3/videos?part=yo&key=foobar&abc=123 failed, " +
          "reason: connect ETIMEDOUT 172.217.11.170:443"
      )
    ).toBe(
      "got error: request to https://www.googleapis.com/" +
        "youtube/v3/videos?part=yo&[REMOVED] failed, " +
        "reason: connect ETIMEDOUT 172.217.11.170:443"
    );
  });
});
