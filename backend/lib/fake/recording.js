const faker = require("faker");

const bootstrap = require("../bootstrap");
const { CHANNEL_COUNT, RECORDING_COUNT } = require("./constants");
const { addFakeAssociatedImage } = require("./image");
const { makeTimestamps, truncateCollection } = require("./util");

const YOUTUBE_VIDEOS = [
  "https://youtu.be/dEZLs7q2Q34",
  "https://youtu.be/BgsbBWcKch8",
  "https://youtu.be/h31f6iD2GZ8",
  "https://youtu.be/a7f7g_mQO6E",
  "https://youtu.be/7YVh4JVFp5k",
  "https://youtu.be/_RtpftURyO0", // Private
];

const FAKE_EXTRA = {
  image: {
    provider: "youtube",
    thumbnails: {
      high: {
        url: "https://i.ytimg.com/vi/D_3xiTv3hA4/hqdefault_live.jpg",
        width: 480,
        height: 360,
      },
      medium: {
        url: "https://i.ytimg.com/vi/D_3xiTv3hA4/mqdefault_live.jpg",
        width: 320,
        height: 180,
      },
    },
  },
};

const applyFakeRecordings = async () => {
  strapi.log.info("Faking recordings...");
  await truncateCollection("recordings");
  const knex = strapi.connections.default;
  for (let id = 1; id <= RECORDING_COUNT; id++) {
    const startAt = faker.random.boolean()
      ? faker.date.soon()
      : faker.date.recent();
    await knex("recordings").insert({
      title: faker.lorem.words(5),
      description: faker.random.number(2) ? faker.lorem.paragraph() : null,
      automate: faker.random.number(2) ? "youtube" : "manual",
      recordingUrl: faker.random.arrayElement(YOUTUBE_VIDEOS) + `?_=${id}`,
      embed: faker.random.boolean(),
      live: !faker.random.number(2),
      startAt,
      endAt:
        startAt && faker.random.boolean() ? faker.date.soon(1, startAt) : null,
      duration: faker.random.number({ min: 10, max: 200 }),
      skip: faker.random.number(2)
        ? faker.random.number({ min: 100, max: 1000 })
        : null,
      extra: faker.random.boolean() ? FAKE_EXTRA : null,
      channel: faker.random.number(2)
        ? faker.random.number({ min: 1, max: CHANNEL_COUNT })
        : null,
      ...makeTimestamps(),
    });
    if (faker.random.number(4)) {
      await addFakeAssociatedImage("recordings", "image", id);
    }
  }
};

module.exports = {
  applyFakeRecordings,
};

if (require.main === module) {
  bootstrap(applyFakeRecordings);
}
