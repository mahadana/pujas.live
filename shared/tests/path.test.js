const {
  getChannelRecordingsPath,
  getGroupEditPath,
  getGroupMessagePath,
  getRecordingPath,
  getRecordingVideoUrl,
  toDigitalOceansCdnUrl,
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

test("toDigitalOceansCdnUrl", () => {
  expect(toDigitalOceansCdnUrl(null)).toBeNull();
  expect(toDigitalOceansCdnUrl("")).toBe("");
  expect(toDigitalOceansCdnUrl("/foo/bar")).toBe("/foo/bar");
  expect(toDigitalOceansCdnUrl("pujas-live.sfo3.digitaloceanspaces.com")).toBe(
    "pujas-live.sfo3.cdn.digitaloceanspaces.com"
  );
  expect(
    toDigitalOceansCdnUrl(
      "https://pujas-live.sfo3.digitaloceanspaces.com/a/b/c"
    )
  ).toBe("https://pujas-live.sfo3.cdn.digitaloceanspaces.com/a/b/c");
  expect(toDigitalOceansCdnUrl("https://storage.googleapis.com/xyz")).toBe(
    "https://storage.googleapis.com/xyz"
  );
});
