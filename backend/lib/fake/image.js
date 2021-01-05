const faker = require("faker");

const bootstrap = require("../bootstrap");
const { addUrlToUploads } = require("../upload");
const { IMAGE_COUNT } = require("./constants");
const { truncateTable } = require("./util");

FAKE_IMAGE_URL = "https://picsum.photos/300";

const addFakeAssociatedImage = async (tableName, field, id) => {
  const knex = strapi.connections.default;
  await knex("upload_file_morph").insert({
    upload_file_id: faker.random.number({ min: 1, max: IMAGE_COUNT }),
    related_id: id,
    related_type: tableName,
    field,
    order: 1,
  });
};

const applyFakeImages = async () => {
  strapi.log.info("Faking images...");
  await truncateTable(["upload_file_morph", "upload_file"]);
  // Concurrent downloads...
  await Promise.all(
    Array.from(Array(IMAGE_COUNT).keys()).map((i) =>
      addUrlToUploads(FAKE_IMAGE_URL, `${i + 1}.jpg`)
    )
  );
};

module.exports = {
  addFakeAssociatedImage,
  applyFakeImages,
};

if (require.main === module) {
  bootstrap(applyFakeImages);
}
