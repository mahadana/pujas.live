const faker = require("faker");

const bootstrap = require("../bootstrap");
const {
  CHANNEL_COUNT,
  MONASTERY_COUNT,
  RECORDING_COUNT,
} = require("./constants");
const { addFakeAssociatedImage } = require("./image");
const { makeTimestamps, truncateCollection, truncateTable } = require("./util");

const YOUTUBE_CHANNELS = [
  "https://www.youtube.com/c/AbhayagiriBuddhistMonastery",
  "https://www.youtube.com/c/AmaravatiBuddhistMonastery",
  "https://www.youtube.com/c/PacificHermitage",
];

const applyFakeChannels = async () => {
  strapi.log.info("Faking channels...");
  await truncateTable(["components_curated_recordings", "channels_components"]);
  await truncateCollection("channels");
  const knex = strapi.connections.default;
  for (let id = 1; id <= CHANNEL_COUNT; id++) {
    const [cid] = await knex("channels")
      .insert({
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        automate: faker.random.number(4) ? "youtube" : "manual",
        channelUrl: faker.random.number(4)
          ? faker.random.arrayElement(YOUTUBE_CHANNELS) + `?${id}`
          : null,
        monastery: faker.random.number({ min: 1, max: MONASTERY_COUNT }),
        activeStream: faker.random.boolean()
          ? faker.random.number({ min: 1, max: RECORDING_COUNT })
          : null,
        ...makeTimestamps(),
      })
      .returning("id");
    if (faker.random.number(4)) {
      await addFakeAssociatedImage("channels", "image", id);
    }
    const curatedRecordingCount = faker.random.number(10);
    for (let n = 1; n <= curatedRecordingCount; n++) {
      const [rid] = await knex("components_curated_recordings")
        .insert({
          title: faker.random.boolean() ? faker.lorem.words(3) : null,
          description: faker.random.boolean() ? faker.lorem.paragraph() : null,
          recording: faker.random.number({ min: 1, max: RECORDING_COUNT }),
          skip: faker.random.boolean()
            ? faker.random.number({ min: 1, max: 1000 })
            : null,
        })
        .returning("id");
      await knex("channels_components").insert({
        field: "curatedRecordings",
        order: n,
        component_type: "components_curated_recordings",
        component_id: rid,
        channel_id: cid,
      });
    }
  }
};

module.exports = {
  applyFakeChannels,
};

if (require.main === module) {
  bootstrap(applyFakeChannels);
}
