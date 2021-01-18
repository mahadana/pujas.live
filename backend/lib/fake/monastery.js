const faker = require("faker");

const bootstrap = require("../bootstrap");
const { addFakeAssociatedImage } = require("./image");
const { MONASTERY_COUNT } = require("./constants");
const { makeTimestamps, truncateCollection } = require("./util");

const applyFakeMonasteries = async () => {
  strapi.log.info("Faking monasteries...");
  await truncateCollection("monasteries");
  const knex = strapi.connections.default;
  for (let id = 1; id <= MONASTERY_COUNT; id++) {
    await knex("monasteries").insert({
      title: faker.lorem.words(4),
      description: faker.lorem.paragraph(),
      websiteUrl: faker.internet.url(),
      ...makeTimestamps(),
    });
    await addFakeAssociatedImage("monasteries", "image", id);
  }
};

module.exports = {
  applyFakeMonasteries,
};

if (require.main === module) {
  bootstrap(applyFakeMonasteries);
}
