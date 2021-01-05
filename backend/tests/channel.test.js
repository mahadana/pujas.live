const _ = require("lodash");

describe("channel", () => {
  it("services.find(_sort=_activeStreams)", async (done) => {
    const d1 = new Date();
    const recordings = [
      await strapi.services.recording.create({
        title: "1",
        live: true,
        recordingUrl: "https://youtube.com/1",
        startAt: "2020-05-01T00.00.00Z",
      }),
      await strapi.services.recording.create({
        title: "2",
        live: true,
        recordingUrl: "https://youtube.com/2",
        startAt: "2020-06-01T00.00.00Z",
      }),
    ];
    const channels = [
      await strapi.services.channel.create({
        title: "1",
        updated_at: '2020-01-01T00:00:00Z',
      }),
      await strapi.services.channel.create({
        title: "2",
        activeStream: recordings[1].id,
        updated_at: '2020-02-01T00:00:00Z',
      }),
      await strapi.services.channel.create({
        title: "3",
        activeStream: recordings[0].id,
        updated_at: '2020-03-01T00:00:00Z',
      }),
    ];

    let result;
    result = await strapi.services.channel.find({ _sort: "title" });
    expect(_.map(result, "title")).toEqual(["1", "2", "3"]);

    result = await strapi.services.channel.find({ _sort: "_activeStreams" });
    expect(_.map(result, "title")).toEqual(["3", "2", "1"]);

    await strapi.services.recording.update(
      { title: "1" },
      { live: false }
    );

    result = await strapi.services.channel.find({ _sort: "_activeStreams" });
    expect(_.map(result, "title")).toEqual(["2", "3", "1"]);

    await strapi.services.recording.update(
      { title: "2" },
      { published_at: null }
    );

    result = await strapi.services.channel.find({ _sort: "title" });
    expect(_.map(result, "title")).toEqual(["1", "2", "3"]);
    result = await strapi.services.channel.find({ _sort: "_activeStreams" });
    expect(_.map(result, "title")).toEqual(["3", "1", "2"]);

    done();
  });
});
