import { useRouteBack } from "@/lib/util";

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
