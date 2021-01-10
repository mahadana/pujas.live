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
];

const applyFakeRecordings = async () => {
  strapi.log.info("Faking recordings...");
  truncateCollection("recordings");
  const knex = strapi.connections.default;
  for (let id = 1; id <= RECORDING_COUNT; id++) {
    await knex("recordings").insert({
      title: faker.lorem.words(5),
      description: faker.lorem.paragraph(),
      automate: faker.random.number(4) ? "youtube" : "manual",
      recordingUrl: faker.random.arrayElement(YOUTUBE_VIDEOS) + `?${id}`,
      embed: faker.random.boolean(),
      live: !faker.random.number(40),
      startAt: faker.date.future(),
      endAt: faker.random.boolean() ? faker.date.future() : null,
      duration: faker.random.number({ min: 10, max: 200 }),
      extra: {},
      channel: faker.random.number({ min: 1, max: CHANNEL_COUNT }),
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
