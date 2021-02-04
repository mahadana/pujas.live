import {
  getYouTubeEmbedVideoUrlFromVideoId,
  getYouTubeVideoUrlFromVideoId,
  useRouteBack,
} from "@/lib/util";

// TODO redundant with worker/src/__tests__/youtube.test.js
describe("simple", () => {
  test("getYouTubeEmbedVideoUrlFromVideoId", () => {
    expect(getYouTubeEmbedVideoUrlFromVideoId("BgsbBWcKch8")).toEqual(
      "https://www.youtube.com/embed/BgsbBWcKch8"
    );
    expect(
      getYouTubeEmbedVideoUrlFromVideoId("BgsbBWcKch8", { autoplay: true })
    ).toEqual("https://www.youtube.com/embed/BgsbBWcKch8?autoplay=1");
    expect(
      getYouTubeEmbedVideoUrlFromVideoId("BgsbBWcKch8", {
        autoplay: true,
        skip: 101,
      })
    ).toEqual("https://www.youtube.com/embed/BgsbBWcKch8?autoplay=1&start=101");
  });

  test("getVideoUrlFromVideoId", () => {
    expect(getYouTubeVideoUrlFromVideoId("BgsbBWcKch8")).toEqual(
      "https://youtu.be/BgsbBWcKch8"
    );
    expect(
      getYouTubeVideoUrlFromVideoId("BgsbBWcKch8", { autoplay: true })
    ).toEqual("https://youtu.be/BgsbBWcKch8");
    expect(
      getYouTubeVideoUrlFromVideoId("BgsbBWcKch8", {
        skip: 101,
      })
    ).toEqual("https://youtu.be/BgsbBWcKch8?t=101");
  });
});

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
