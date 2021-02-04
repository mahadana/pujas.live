import { useRouteBack, isActiveRecording } from "@/lib/util";

import { dayjs } from "shared/time";

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

test("isActiveRecording", () => {
  const now = dayjs("2021-02-02T05:30:15Z").utc();
  const exp = (startAt, live) =>
    expect(isActiveRecording({ startAt, live }, now));

  exp(null, false).toBe(false);
  exp(null, true).toBe(false);

  exp("2021-02-02T05:30:00Z", false).toBe(false);
  exp("2021-02-02T05:31:00Z", false).toBe(false);

  exp("2021-02-02T05:25:00Z", true).toBe(false);
  exp("2021-02-02T05:25:15Z", true).toBe(true);
  exp("2021-02-02T05:30:00Z", true).toBe(true);
  exp("2021-02-02T05:31:00Z", true).toBe(true);
  exp("2021-02-03T05:31:00Z", true).toBe(true);
});
