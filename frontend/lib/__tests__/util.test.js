import { getBackFromQuery } from "../util";

describe("getBackFromQuery", () => {
  test("with query param", () => {
    expect(getBackFromQuery({ query: "/account" }) === "/account");
  });

  test("without query param", () => {
    expect(getBackFromQuery({}) === "/");
  });
});
