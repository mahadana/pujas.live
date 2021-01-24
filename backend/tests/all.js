const http = require("http");
const { dirname } = require("path");
const Strapi = require("strapi");

beforeAll(async (done) => {
  jest.setTimeout(30 * 1000);
  await Strapi({ dir: dirname(__dirname) }).load();
  await strapi.app
    .use(strapi.router.routes())
    .use(strapi.router.allowedMethods());
  strapi.server = http.createServer(strapi.app.callback());
  done();
});

beforeEach(async (done) => {
  const TABLE_NAMES = [
    "channels",
    "groups",
    "monasteries",
    "recordings",
    "users-permissions_user",
  ];
  const knex = strapi.connections.default;
  for (const tableName of TABLE_NAMES) {
    if (await knex.schema.hasTable(tableName)) {
      await knex(tableName).delete();
      await knex("sqlite_sequence").where("name", tableName).delete();
    }
  }
  done();
});

require("glob")
  .sync("*.test.js", { cwd: __dirname })
  .map((file) => require(`./${file}`));
