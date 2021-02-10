const faker = require("faker");

const { ADMIN_USER_COUNT } = require("./constants");

const makeTimestamps = () => {
  let createdAt = faker.date.recent(100);
  let updatedAt = faker.date.recent(20);
  if (createdAt.getTime() > updatedAt.getTime()) {
    updatedAt = createdAt;
  }
  return {
    published_at: faker.random.number(4) ? faker.date.recent(20) : null,
    updated_by: faker.random.number({ min: 1, max: ADMIN_USER_COUNT }),
    updated_at: updatedAt,
    created_by: faker.random.number({ min: 1, max: ADMIN_USER_COUNT }),
    created_at: createdAt,
  };
};

const truncateCollection = async (table) => {
  const knex = strapi.connections.default;
  await knex("upload_file_morph").where("related_type", table).delete();
  await truncateTable(table);
};

const truncateTable = async (tables) => {
  if (!Array.isArray(tables)) {
    tables = [tables];
  }
  const knex = strapi.connections.default;
  await knex.raw(
    `TRUNCATE TABLE ${tables.join(", ")} RESTART IDENTITY CASCADE`
  );
};

module.exports = {
  makeTimestamps,
  truncateCollection,
  truncateTable,
};
