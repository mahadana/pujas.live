const faker = require("faker");

const bootstrap = require("../bootstrap");
const {
  CHANNEL_COUNT,
  MONASTERY_COUNT,
  RECORDING_COUNT,
} = require("./constants");
const { addFakeAssociatedImage } = require("./image");
const { makeTimestamps, truncateCollection } = require("./util");

const YOUTUBE_CHANNELS = [
  "https://www.youtube.com/c/AbhayagiriBuddhistMonastery",
  "https://www.youtube.com/c/AmaravatiBuddhistMonastery",
  "https://www.youtube.com/c/PacificHermitage",
];

const applyFakeChannels = async () => {
  strapi.log.info("Faking channels...");
  truncateCollection("channels");
  const knex = strapi.connections.default;
  for (let id = 1; id <= CHANNEL_COUNT; id++) {
    await knex("channels").insert({
      title: faker.lorem.words(3),
      description: faker.lorem.paragraph(),
      automate: faker.random.number(4) ? "youtube" : "manual",
      channelUrl: faker.random.number(4)
        ? faker.random.arrayElement(YOUTUBE_CHANNELS) + `?${id}`
        : null,
      historyUrl: faker.random.number(2) ? null : faker.internet.url(),
      monastery: faker.random.number({ min: 1, max: MONASTERY_COUNT }),
      activeStream: faker.random.boolean()
        ? faker.random.number({ min: 1, max: RECORDING_COUNT })
        : null,
      ...makeTimestamps(),
    });
    if (faker.random.number(4)) {
      await addFakeAssociatedImage("channels", "image", id);
    }
  }
};

module.exports = {
  applyFakeChannels,
};

if (require.main === module) {
  bootstrap(applyFakeChannels);
}
