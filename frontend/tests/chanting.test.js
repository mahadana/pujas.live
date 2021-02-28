import {
  addExplicitTiming,
  exportTiming,
  getChantNodes,
  humanToTime,
  normalizeTiming,
  timeToHuman,
} from "@/lib/chanting";

describe("addExplicitTiming", () => {
  test("empty", () => {
    expect(
      addExplicitTiming({
        start: 0,
        end: null,
        nodes: [],
      })
    ).toStrictEqual({
      start: 0,
      end: 0,
      nodes: [],
    });
  });

  test("no ends", () => {
    expect(
      addExplicitTiming({
        start: 0,
        end: 7,
        nodes: [
          { start: 1, end: null },
          { start: 2, end: null },
          { start: 5, end: null },
        ],
      })
    ).toStrictEqual({
      start: 0,
      end: 7,
      nodes: [
        { start: 1, end: 2 },
        { start: 2, end: 5 },
        { start: 5, end: 7 },
      ],
    });
  });

  test("missing", () => {
    expect(
      addExplicitTiming({
        start: 2,
        end: 30,
        nodes: [
          { start: null, end: null },
          { start: 5, end: null },
          { start: null, end: null },
          { start: 11, end: 12 },
          { start: null, end: null },
          { start: null, end: null },
          { start: 20, end: null },
          { start: null, end: null },
        ],
      })
    ).toStrictEqual({
      start: 2,
      end: 30,
      nodes: [
        { start: 5, end: 5 },
        { start: 5, end: 11 },
        { start: 11, end: 11 },
        { start: 11, end: 12 },
        { start: 20, end: 20 },
        { start: 20, end: 20 },
        { start: 20, end: 30 },
        { start: 30, end: 30 },
      ],
    });
  });

  test("trailing end", () => {
    expect(
      addExplicitTiming({
        start: 2,
        end: null,
        nodes: [
          { start: null, end: null },
          { start: 5, end: null },
          { start: null, end: null },
        ],
      })
    ).toStrictEqual({
      start: 2,
      end: 5,
      nodes: [
        { start: 5, end: 5 },
        { start: 5, end: 5 },
        { start: 5, end: 5 },
      ],
    });
  });
});

describe("exportTiming", () => {
  test("simple", () => {
    expect(
      exportTiming({
        id: "foobar",
        mediaUrl: undefined,
        start: "2.2",
        end: null,
        something: "else",
        nodes: [{ start: "4" }, { end: null, start: undefined, duration: 5 }],
      })
    ).toStrictEqual({
      id: "foobar",
      start: 2.2,
      nodes: [{ start: 4 }, {}],
    });
  });
});

describe("getChantNodes", () => {
  test("simple", () => {
    expect(
      getChantNodes({
        type: "chant",
        children: [
          {
            type: "group",
            children: [
              { type: "verse", html: "foo" },
              { type: "verse", html: "bar" },
            ],
          },
          {
            type: "unknown",
          },
          {
            type: "aside",
            html: "baz",
          },
          {
            type: "grid",
            children: [
              {
                type: "row",
                children: [{ type: "verse", html: "bif" }],
              },
            ],
          },
        ],
      })
    ).toStrictEqual([
      { index: 0, type: "verse", html: "foo" },
      { index: 1, type: "verse", html: "bar" },
      { index: 2, type: "aside", html: "baz" },
      { index: 3, type: "verse", html: "bif" },
    ]);
  });
});

describe("normalizeTiming", () => {
  test("empty", () => {
    expect(normalizeTiming()).toStrictEqual({
      id: null,
      mediaUrl: null,
      start: 0,
      end: null,
      nodes: [],
    });
  });

  test("casting", () => {
    expect(
      normalizeTiming({
        id: 42,
        mediaUrl: { a: 1 },
        start: "-2.23",
        end: "01:35.2",
        nodes: [{ start: "00:00:04.0" }],
      })
    ).toStrictEqual({
      id: "42",
      mediaUrl: "[object Object]",
      start: 0,
      end: 95.2,
      nodes: [{ start: 4, end: null }],
    });
  });

  test("ordering", () => {
    expect(
      normalizeTiming({
        nodes: [
          { start: 2, end: 1 },
          {},
          { start: 3, end: 4 },
          { start: 2, end: 3 },
        ],
      }).nodes
    ).toStrictEqual([
      { start: 2, end: null },
      { start: null, end: null },
      { start: 3, end: 4 },
      { start: null, end: null },
    ]);
  });

  test("size", () => {
    expect(
      normalizeTiming(
        {
          nodes: Array(3),
        },
        1
      ).nodes
    ).toStrictEqual([{ start: null, end: null }]);
    expect(
      normalizeTiming(
        {
          nodes: Array(1),
        },
        3
      ).nodes
    ).toStrictEqual([
      { start: null, end: null },
      { start: null, end: null },
      { start: null, end: null },
    ]);
  });
});

describe("humanToTime", () => {
  test("invalid", () => {
    expect(humanToTime()).toBeNull();
    expect(humanToTime("")).toBeNull();
    expect(humanToTime("abc")).toBeNull();
    expect(humanToTime(NaN)).toBeNull();
    expect(humanToTime("-1")).toBeNull();
  });
  test("basics", () => {
    expect(humanToTime("1")).toBe(1);
    expect(humanToTime("1.7")).toBe(1.7);
    expect(humanToTime("1:2.7")).toBe(62.7);
    expect(humanToTime("1:43:50.929")).toBe(6230.929);
  });
  test("edge", () => {
    expect(humanToTime("99:99:99.99")).toBe(362439.99);
    expect(humanToTime("1::2")).toBeNull();
    expect(humanToTime("0:0:0.0")).toBe(0);
  });
});

describe("timeToHuman", () => {
  test("invalid", () => {
    expect(timeToHuman()).toBe("");
    expect(timeToHuman("")).toBe("");
    expect(timeToHuman({})).toBe("");
  });
  test("basics", () => {
    expect(timeToHuman(1)).toBe("0:01");
    expect(timeToHuman(1, 1)).toBe("0:01.0");
    expect(timeToHuman(1.7)).toBe("0:02");
    expect(timeToHuman(1.7, 1)).toBe("0:01.7");
    expect(timeToHuman(62.7)).toBe("1:03");
    expect(timeToHuman(62.7, 2)).toBe("1:02.70");
    expect(timeToHuman(6230.929)).toBe("1:43:51");
    expect(timeToHuman(362439.99, 1)).toBe("100:40:40.0");
  });
});
