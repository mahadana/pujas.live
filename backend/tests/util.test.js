const { encodeAddress, encodeMailto } = require("../lib/util");

describe("encodeAddress", () => {
  test("simple", () => {
    expect(encodeAddress("a@a.com")).toBe("a@a.com");
    expect(encodeAddress({ address: "a@a.com" })).toBe("a@a.com");
    expect(encodeAddress("Fred Smith <fred@smith.com>")).toBe(
      "Fred Smith <fred@smith.com>"
    );
    expect(
      encodeAddress({ name: "Fred Smith", address: "fred@smith.com" })
    ).toBe("Fred Smith <fred@smith.com>");
  });

  test("wonky", () => {
    expect(
      encodeAddress({ name: "Kevin O'Neil", address: "kevin@oneil.com" })
    ).toBe("Kevin O'Neil <kevin@oneil.com>");
    expect(
      encodeAddress({ name: 'oh "dear"', address: "what@what.what" })
    ).toBe('"oh \\"dear\\"" <what@what.what>');
    expect(
      encodeAddress({ name: "<evil@cha.rs>", address: "evil@cha.rs" })
    ).toBe('"<evil@cha.rs>" <evil@cha.rs>');
  });
});

test("encodeMailto", () => {
  expect(encodeMailto({ to: "a@a.com" })).toBe("mailto:a@a.com");
  expect(encodeMailto({ to: "a@a.com" })).toBe("mailto:a@a.com");
});
