import {
  getYouTubeEmbedVideoUrlFromVideoId,
  getYouTubeVideoUrlFromVideoId,
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
