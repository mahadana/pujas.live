import { getBackFromQuery } from "../util";

describe("getBackFromQuery", () => {
  test("with query param", () => {
    expect(getBackFromQuery({ back: "/account" })).toBe("/account");
  });

  test("without query param", () => {
    expect(getBackFromQuery({})).toBe("/");
  });
});
