import { useRouteBack, isActiveRecording } from "@/lib/util";

describe("useRouteBack", () => {
  test("routeBack.get", () => {
    const routeBack = useRouteBack({ asPath: "/foo" });
    expect(routeBack.get("/bar")).toBe("/bar?back=%2Ffoo");
  });

  test("routeBack.push", () => {
    const router = {
      push: jest.fn(),
      query: {},
    };
    const routeBack = useRouteBack(router);

    routeBack.push();
    expect(router.push).toHaveBeenLastCalledWith("/");
    routeBack.push("/bar");
    expect(router.push).toHaveBeenLastCalledWith("/bar");

    router.query.back = "/foo";
    routeBack.push();
    expect(router.push).toHaveBeenLastCalledWith("/foo");
    routeBack.push("/bar");
    expect(router.push).toHaveBeenLastCalledWith("/foo");
  });
});

describe("isActiveRecording", () => {
  const exp = (recording, now) => expect(isActiveRecording(recording, now));

  test("no data", () => {
    exp(null, "2021-02-02T05:30:00Z").toBe(false);
    exp({}, "2021-02-02T05:30:00Z").toBe(false);
  });

  test("not live", () => {
    exp({ startAt: "2021-02-02T05:30:00Z" }, "2021-02-02T05:31:00Z").toBe(
      false
    );
    exp(
      {
        startAt: "2021-02-02T05:30:00Z",
        endAt: "2021-02-02T06:00:00Z",
        live: false,
      },
      "2021-02-02T05:31:00Z"
    ).toBe(false);
  });

  test("live", () => {
    exp({ live: true }, "2021-02-02T05:30:00Z").toBe(false);
    const recording = {
      startAt: "2021-02-02T05:30:00Z",
      endAt: null,
      live: true,
    };
    exp(recording, "2021-02-02T05:20:00Z").toBe(false);
    exp(recording, "2021-02-02T05:24:59Z").toBe(false);
    exp(recording, "2021-02-02T05:25:00Z").toBe(true);
    exp(recording, "2021-02-02T05:31:00Z").toBe(true);
    exp(recording, "2021-02-03T05:30:00Z").toBe(true);
  });

  test("live w/ endAt", () => {
    const recording = {
      startAt: "2021-02-02T05:30:00Z",
      endAt: "2021-02-02T06:00:00Z",
      live: true,
    };
    exp(recording, "2021-02-02T05:20:00Z").toBe(false);
    exp(recording, "2021-02-02T05:24:59Z").toBe(false);
    exp(recording, "2021-02-02T05:25:00Z").toBe(true);
    exp(recording, "2021-02-02T05:31:00Z").toBe(true);
    exp(recording, "2021-02-02T06:00:00Z").toBe(true);
    exp(recording, "2021-02-02T06:05:00Z").toBe(true);
    exp(recording, "2021-02-02T06:05:01Z").toBe(false);
    exp(recording, "2021-02-03T05:30:00Z").toBe(false);
  });
});
