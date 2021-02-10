const {
  getChannelRecordingsPath,
  getGroupEditPath,
  getGroupMessagePath,
  getRecordingPath,
  getRecordingVideoUrl,
} = require("shared/path");

test("getChannelRecordingsPath", () => {
  expect(getChannelRecordingsPath({ id: 4, title: "boo!" })).toBe(
    "/channel/4/boo/recordings"
  );
});

test("getGroupEditPath", () => {
  expect(getGroupEditPath({ id: 29, title: "Fred" })).toBe(
    "/group/29/fred/edit"
  );
});

test("getGroupMessagePath", () => {
  expect(getGroupMessagePath({ id: 6, title: null })).toBe(
    "/group/6/-/message"
  );
});

test("getRecordingPath", () => {
  expect(getRecordingPath({ id: 555, title: "A Dance..." })).toBe(
    "/recording/555/a-dance"
  );
});

test("getRecordingVideoUrl", () => {
  expect(
    getRecordingVideoUrl({ recordingUrl: "https://vimeo.com/70292804" })
  ).toBe("https://vimeo.com/70292804");
  expect(
    getRecordingVideoUrl({
      embed: false,
      recordingUrl: "https://www.youtube.com/watch?v=BgsbBWcKch",
    })
  ).toBe("https://youtu.be/BgsbBWcKch");
  expect(
    getRecordingVideoUrl({
      embed: true,
      recordingUrl: "https://www.youtube.com/watch?v=BgsbBWcKch",
    })
  ).toBe("https://www.youtube.com/embed/BgsbBWcKch");
  expect(
    getRecordingVideoUrl(
      {
        embed: true,
        recordingUrl: "https://www.youtube.com/watch?v=BgsbBWcKch",
      },
      { autoplay: true }
    )
  ).toBe("https://www.youtube.com/embed/BgsbBWcKch?autoplay=1");
  expect(
    getRecordingVideoUrl({
      recordingUrl: "https://www.youtube.com/watch?v=BgsbBWcKch",
      skip: 300,
    })
  ).toBe("https://youtu.be/BgsbBWcKch?t=300");
});
