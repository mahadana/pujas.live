import {
  bindInteger,
  convertHumanToTime,
  convertTimeToHuman,
  createChantMappings,
  exportTiming,
  getIndexInterPosition,
  getIndexInterTime,
  getIndexPositionFromTime,
  getIndexTimeFromPosition,
  interpolateTiming,
  makeLoop,
  normalizeDimension,
  normalizeTiming,
  orderDimension,
  scale,
  staggerRowsInDimension,
  throttle,
} from "@/lib/chanting";

test("bindInteger", () => {
  expect(bindInteger(null, 3, 5)).toBe(3);
  expect(bindInteger(-10, 3, 5)).toBe(3);
  expect(bindInteger("5.5", 3, 5)).toBe(5);
  expect(bindInteger(4.79, 3, 5)).toBe(4);
});

describe("convertHumanToTime", () => {
  test("invalid", () => {
    expect(convertHumanToTime()).toBeNull();
    expect(convertHumanToTime("")).toBeNull();
    expect(convertHumanToTime("abc")).toBeNull();
    expect(convertHumanToTime(NaN)).toBeNull();
    expect(convertHumanToTime("-1")).toBeNull();
  });
  test("basics", () => {
    expect(convertHumanToTime("1")).toBe(1);
    expect(convertHumanToTime("1.7")).toBe(1.7);
    expect(convertHumanToTime("1:2.7")).toBe(62.7);
    expect(convertHumanToTime("1:43:50.929")).toBe(6230.929);
  });
  test("edge", () => {
    expect(convertHumanToTime("99:99:99.99")).toBe(362439.99);
    expect(convertHumanToTime("1::2")).toBeNull();
    expect(convertHumanToTime("0:0:0.0")).toBe(0);
  });
});

describe("convertTimeToHuman", () => {
  test("invalid", () => {
    expect(convertTimeToHuman()).toBe("");
    expect(convertTimeToHuman("")).toBe("");
    expect(convertTimeToHuman({})).toBe("");
  });
  test("basics", () => {
    expect(convertTimeToHuman(1)).toBe("0:01");
    expect(convertTimeToHuman(1, 1)).toBe("0:01.0");
    expect(convertTimeToHuman(1.7)).toBe("0:02");
    expect(convertTimeToHuman(1.7, 1)).toBe("0:01.7");
    expect(convertTimeToHuman(62.7)).toBe("1:03");
    expect(convertTimeToHuman(62.7, 2)).toBe("1:02.70");
    expect(convertTimeToHuman(6230.929)).toBe("1:43:51");
    expect(convertTimeToHuman(362439.99, 1)).toBe("100:40:40.0");
  });
});

describe("createChantMappings", () => {
  test("simple", () => {
    const mapping = createChantMappings({
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
    });
    expect(mapping.form.type).toBe("chant");
    expect(mapping.form.children.length).toBe(4);
    expect(mapping.nodes).toStrictEqual([
      { index: 0, type: "verse", html: "foo" },
      { index: 1, type: "verse", html: "bar" },
      { index: 2, type: "aside", html: "baz" },
      { index: 3, type: "verse", html: "bif" },
    ]);
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

describe("getIndex*", () => {
  describe("empty", () => {
    const dim = { top: 10, bottom: 20, start: 3, end: 4, nodes: [] };

    test("getIndexInterPosition", () => {
      expect(getIndexInterPosition(dim, 7)).toStrictEqual(["gap", 0, 0]);
      expect(getIndexInterPosition(dim, 15)).toStrictEqual(["gap", 0, 0.5]);
      expect(getIndexInterPosition(dim, 25)).toStrictEqual(["gap", 0, 1]);
    });

    test("getIndexPositionFromTime", () => {
      expect(getIndexPositionFromTime(dim, 2.5)).toStrictEqual([null, 10]);
      expect(getIndexPositionFromTime(dim, 3.5)).toStrictEqual([null, 15]);
      expect(getIndexPositionFromTime(dim, 4.5)).toStrictEqual([null, 20]);
    });

    test("getIndexTimeFromPosition", () => {
      expect(getIndexTimeFromPosition(dim, 5)).toStrictEqual([null, 3]);
      expect(getIndexTimeFromPosition(dim, 15)).toStrictEqual([null, 3.5]);
      expect(getIndexTimeFromPosition(dim, 25)).toStrictEqual([null, 4]);
    });
  });

  describe("basic", () => {
    const dim = {
      top: 100,
      bottom: 160,
      start: 5.5,
      end: 11.5,
      nodes: [
        { index: 0, top: 110, bottom: 120, start: 6.5, end: 7 },
        { index: 1, top: 120, bottom: 130, start: 7, end: 8 },
        { index: 2, top: 140, bottom: 150, start: 9, end: 10 },
      ],
    };

    test("getIndexInterPosition", () => {
      const exp = (pos) => expect(getIndexInterPosition(dim, pos));
      exp(50).toStrictEqual(["gap", 0, 0]);
      exp(105).toStrictEqual(["gap", 0, 0.5]);
      exp(115).toStrictEqual(["in", 0, 0.5]);
      exp(119).toStrictEqual(["in", 0, 0.9]);
      exp(120).toStrictEqual(["in", 1, 0]);
      exp(129).toStrictEqual(["in", 1, 0.9]);
      exp(130).toStrictEqual(["gap", 2, 0]);
      exp(139).toStrictEqual(["gap", 2, 0.9]);
      exp(140).toStrictEqual(["in", 2, 0]);
      exp(149).toStrictEqual(["in", 2, 0.9]);
      exp(150).toStrictEqual(["gap", 3, 0]);
      exp(155).toStrictEqual(["gap", 3, 0.5]);
      exp(160).toStrictEqual(["gap", 3, 1]);
      exp(200).toStrictEqual(["gap", 3, 1]);
    });

    test("getIndexPositionFromTime", () => {
      const exp = (time) => expect(getIndexPositionFromTime(dim, time));
      exp(4.5).toStrictEqual([null, 100]);
      exp(5.5).toStrictEqual([null, 100]);
      exp(6.5).toStrictEqual([0, 110]);
      exp(6.9).toStrictEqual([0, 118]);
      exp(7).toStrictEqual([1, 120]);
      exp(7.9).toStrictEqual([1, 129]);
      exp(8).toStrictEqual([null, 130]);
      exp(8.9).toStrictEqual([null, 139]);
      exp(9).toStrictEqual([2, 140]);
      exp(9.9).toStrictEqual([2, 149]);
      exp(10).toStrictEqual([null, 150]);
      exp(10.5).toStrictEqual([null, 153]);
      exp(11).toStrictEqual([null, 157]);
      exp(11.5).toStrictEqual([null, 160]);
      exp(12).toStrictEqual([null, 160]);
    });

    test("getIndexTimeFromPosition", () => {
      const exp = (pos) => expect(getIndexTimeFromPosition(dim, pos));
      exp(50).toStrictEqual([null, 5.5]);
      exp(100).toStrictEqual([null, 5.5]);
      exp(105).toStrictEqual([null, 6]);
      exp(109).toStrictEqual([null, 6.4]);
      exp(110).toStrictEqual([0, 6.5]);
      exp(115).toStrictEqual([0, 6.75]);
      exp(119).toStrictEqual([0, 6.95]);
      exp(120).toStrictEqual([1, 7]);
      exp(125).toStrictEqual([1, 7.5]);
      exp(129).toStrictEqual([1, 7.9]);
      exp(130).toStrictEqual([null, 8]);
      exp(131).toStrictEqual([null, 8.1]);
      exp(139).toStrictEqual([null, 8.9]);
      exp(140).toStrictEqual([2, 9]);
      exp(149).toStrictEqual([2, 9.9]);
      exp(150).toStrictEqual([null, 10]);
      exp(155).toStrictEqual([null, 10.75]);
      exp(160).toStrictEqual([null, 11.5]);
      exp(200).toStrictEqual([null, 11.5]);
    });
  });

  describe("edge", () => {
    const dim = {
      start: 0,
      end: 80.2,
      nodes: [{ start: 0, end: 80.2 }],
    };

    test("getIndexInterTime", () => {
      expect(getIndexInterTime(dim, 80.2)).toStrictEqual(["gap", 1, 1]);
    });
  });
});

describe("interpolateTiming", () => {
  test("empty", () => {
    expect(
      interpolateTiming({
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

  test("typical", () => {
    expect(
      interpolateTiming({
        id: "foo",
        mediaUrl: "bar",
        start: 0,
        end: 7,
        nodes: [
          { start: 1, end: null },
          { start: 2, end: null },
          { start: 5, end: 6 },
        ],
      })
    ).toStrictEqual({
      id: "foo",
      mediaUrl: "bar",
      start: 0,
      end: 7,
      nodes: [
        { start: 1, end: 2 },
        { start: 2, end: 5 },
        { start: 5, end: 6 },
      ],
    });
  });

  test("missing", () => {
    expect(
      interpolateTiming({
        start: 2,
        end: 30,
        nodes: [
          { start: null, end: null },
          { start: 5, end: null },
          { start: null, end: null },
          { start: 11, end: 12 },
          { start: 15, end: null },
          { start: null, end: null },
          { start: null, end: null },
          { start: 20, end: 20 },
          { start: 21, end: null },
          { start: null, end: null },
          { start: 22, end: null },
          { start: null, end: null },
        ],
      })
    ).toStrictEqual({
      start: 2,
      end: 30,
      nodes: [
        { start: 2, end: 5 },
        { start: 5, end: 8 },
        { start: 8, end: 11 },
        { start: 11, end: 12 },
        { start: 15, end: 16.7 },
        { start: 16.7, end: 18.3 },
        { start: 18.3, end: 20 },
        { start: 20, end: 20 },
        { start: 21, end: 21.5 },
        { start: 21.5, end: 22 },
        { start: 22, end: 26 },
        { start: 26, end: 30 },
      ],
    });
  });

  test("null end", () => {
    expect(
      interpolateTiming({
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
        { start: 2, end: 5 },
        { start: 5, end: 5 },
        { start: 5, end: 5 },
      ],
    });
  });
});

describe("makeLoop", () => {
  test("start / stop", () => {
    const window = {
      cancelAnimationFrame: jest.fn(),
      requestAnimationFrame: jest.fn().mockReturnValue("abc"),
    };

    const loop = makeLoop(null, window);
    expect(window.cancelAnimationFrame).not.toHaveBeenCalled();
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    expect(loop.request).toBeNull();

    loop.stop();
    expect(window.cancelAnimationFrame).not.toHaveBeenCalled();
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    expect(loop.request).toBeNull();

    loop.start();
    expect(window.cancelAnimationFrame).not.toHaveBeenCalled();
    expect(window.requestAnimationFrame).toBeCalledWith(loop.loop);
    expect(loop.request).toBe("abc");
    window.requestAnimationFrame.mockClear();

    loop.stop();
    expect(window.cancelAnimationFrame).toBeCalledWith("abc");
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    expect(loop.request).toBeNull();
  });

  test("loop", () => {
    const window = {
      cancelAnimationFrame: jest.fn(),
      performance: {
        now: jest
          .fn()
          .mockReturnValueOnce(10.5)
          .mockReturnValueOnce(10.6)
          .mockReturnValueOnce(20.5)
          .mockReturnValueOnce(20.55)
          .mockReturnValueOnce(30.5)
          .mockReturnValueOnce(30.75),
      },
      requestAnimationFrame: jest.fn(() => "yahoo"),
    };
    const inner = jest.fn().mockResolvedValue(11);
    const loop = makeLoop(inner, window);

    loop.loop(1000);
    expect(window.cancelAnimationFrame).not.toHaveBeenCalled();
    expect(window.performance.now).not.toHaveBeenCalledTimes(2);
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();

    loop.start();
    expect(window.cancelAnimationFrame).not.toHaveBeenCalled();
    expect(window.performance.now).not.toHaveBeenCalled();
    expect(window.requestAnimationFrame).toBeCalledWith(loop.loop);
    expect(loop.duration).toBe(0);
    expect(loop.elapsed).toBe(0);
    expect(loop.timestamp).toBe(null);

    loop.loop(1000);
    expect(window.performance.now).toHaveBeenCalledTimes(2);
    expect(loop.duration).toBeCloseTo(0.1);
    expect(loop.elapsed).toBe(0);
    expect(loop.timestamp).toBe(1000);

    loop.loop(1010);
    expect(window.performance.now).toHaveBeenCalledTimes(4);
    expect(loop.duration).toBeCloseTo(0.1);
    expect(loop.elapsed).toBe(10);

    loop.loop(1025);
    expect(window.performance.now).toHaveBeenCalledTimes(6);
    expect(loop.duration).toBeCloseTo(0.25);
    expect(loop.elapsed).toBe(15);

    expect(inner).toHaveBeenCalledTimes(3);
  });

  test("exception", () => {
    const window = {
      cancelAnimationFrame: jest.fn(),
      performance: { now: jest.fn(() => 1) },
      requestAnimationFrame: jest.fn(() => "xyz"),
    };
    const errorSpy = (throttle.error = jest.fn());
    const inner = () => {
      throw new Error("foo");
    };
    const loop = makeLoop(inner, window);
    loop.start();
    loop.loop(456);
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe("normalizeDimension", () => {
  test("empty", () => {
    expect(normalizeDimension()).toStrictEqual({
      top: 0,
      bottom: 0,
      nodes: [],
    });
  });

  test("simple", () => {
    expect(
      normalizeDimension({
        top: "4.5",
        bottom: 90,
        nodes: [
          { top: 45.5, bottom: 60 },
          { top: 50, bottom: 30 },
          { top: 95, bottom: 91 },
        ],
      })
    ).toStrictEqual({
      top: 4,
      bottom: 90,
      nodes: [
        { top: 45, bottom: 60 },
        { top: 50, bottom: 50 },
        { top: 90, bottom: 90 },
      ],
    });
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
        start: 1,
        end: 4.5,
        nodes: [
          { start: 2, end: 1 },
          {},
          { start: 3, end: 4 },
          { start: 2, end: 3 },
          { start: 4, end: 5 },
        ],
      }).nodes
    ).toStrictEqual([
      { start: 2, end: null },
      { start: null, end: null },
      { start: 3, end: 4 },
      { start: null, end: null },
      { start: 4, end: null },
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

test("orderDimension", () => {
  expect(
    orderDimension({
      top: 10,
      bottom: 100,
      nodes: [
        { top: 0, bottom: 20 },
        { top: 20, bottom: 31 },
        { top: 30, bottom: 30 },
        { top: 30, bottom: 40 },
        { top: 30, bottom: 30 },
        { top: 47, bottom: 53 },
        { top: 53, bottom: 60 },
        { top: 45, bottom: 62 },
        { top: 60, bottom: 70 },
        { top: 70, bottom: 80 },
        { top: 50, bottom: 120 },
      ],
    })
  ).toStrictEqual({
    top: 10,
    bottom: 100,
    nodes: [
      { top: 10, bottom: 20 },
      { top: 20, bottom: 31 },
      { top: 31, bottom: 31 },
      { top: 31, bottom: 40 },
      { top: 40, bottom: 40 },
      { top: 47, bottom: 53 },
      { top: 53, bottom: 60 },
      { top: 60, bottom: 62 },
      { top: 62, bottom: 70 },
      { top: 70, bottom: 80 },
      { top: 80, bottom: 100 },
    ],
  });
});

test("scale", () => {
  expect(scale(6, 5, 10, 0, 100)).toBe(20);
  expect(scale(1, 5, 10, 0, 100)).toBe(-80);
  expect(scale(19, 0, 10, 0, 100)).toBe(190);
  expect(scale(15, 10, 20, 9, 9)).toBe(9);
  expect(scale(15, 15, 15, 30, 40)).toBe(35);
});

test("staggerRowsInDimension", () => {
  expect(
    staggerRowsInDimension({
      top: 10,
      bottom: 100,
      nodes: [
        { top: 20, bottom: 30 },
        { top: 30, bottom: 30 },
        { top: 30, bottom: 40 },
        { top: 30, bottom: 30 },
        { top: 40, bottom: 50 },
        { top: 40, bottom: 60 },
        { top: 40, bottom: 55 },
        { top: 45, bottom: 60 },
        { top: 60, bottom: 80 },
        { top: 60, bottom: 80 },
      ],
    })
  ).toStrictEqual({
    top: 10,
    bottom: 100,
    nodes: [
      { top: 20, bottom: 30 },
      { top: 30, bottom: 30 },
      { top: 30, bottom: 40 },
      { top: 30, bottom: 30 },
      { top: 40, bottom: 47 },
      { top: 47, bottom: 53 },
      { top: 53, bottom: 60 },
      { top: 45, bottom: 60 },
      { top: 60, bottom: 70 },
      { top: 70, bottom: 80 },
    ],
  });
});
