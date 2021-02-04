const {
  getYouTubeEmbedStreamUrlFromChannelId,
  getYouTubeEmbedVideoUrlFromVideoId,
  getYouTubeVideoIdFromUrl,
  getYouTubeVideoUrlFromVideoId,
} = require("shared/youtube");

test("getYouTubeEmbedStreamUrlFromChannelId", () => {
  expect(
    getYouTubeEmbedStreamUrlFromChannelId("UCGLC-euAIB3gHdPkTWNfg8g")
  ).toBe(
    "https://www.youtube.com/embed/live_stream?channel=UCGLC-euAIB3gHdPkTWNfg8g"
  );
});

test("getYouTubeVideoIdFromUrl", () => {
  const exp = (url) => expect(getYouTubeVideoIdFromUrl(url));
  exp(null).toBe(false);
  exp("green").toBe(false);
  exp("https://youtu.be/BgsbBWcKch8").toBe("BgsbBWcKch8");
  exp("https://www.youtube.com/watch?v=BgsbBWcKch8").toBe("BgsbBWcKch8");
  exp("https://www.youtube.com/watch?v=BgsbBWcKch8&feature=youtu.be").toBe(
    "BgsbBWcKch8"
  );
  exp("youtube.com/watch?v=BgsbBWcKch8").toBe("BgsbBWcKch8");
});

test("getYouTubeEmbedVideoUrlFromVideoId", () => {
  const exp = (videoId, options) =>
    expect(getYouTubeEmbedVideoUrlFromVideoId(videoId, options));

  exp("BgsbBWcKch8").toBe("https://www.youtube.com/embed/BgsbBWcKch8");

  exp("BgsbBWcKch8", { autoplay: true }).toBe(
    "https://www.youtube.com/embed/BgsbBWcKch8?autoplay=1"
  );
  exp("BgsbBWcKch8", {
    autoplay: true,
    skip: 101,
  }).toBe("https://www.youtube.com/embed/BgsbBWcKch8?autoplay=1&start=101");
});

test("getYouTubeVideoUrlFromVideoId", () => {
  const exp = (videoId, options) =>
    expect(getYouTubeVideoUrlFromVideoId(videoId, options));
  exp("BgsbBWcKch8").toBe("https://youtu.be/BgsbBWcKch8");
  exp("BgsbBWcKch8", { autoplay: true }).toBe("https://youtu.be/BgsbBWcKch8");
  exp("BgsbBWcKch8", {
    skip: 101,
  }).toBe("https://youtu.be/BgsbBWcKch8?t=101");
});
