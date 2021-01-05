const bootstrap = require("../bootstrap");
const { applyFakes } = require("../fake");
const { initPermissions } = require("./permission");
const { initSchema } = require("./schema");
const { initSettings } = require("./setting");
const { initAdminUsers, initUsers } = require("./user");

const initialize = async () => {
  await initSchema();
  await initSettings();
  await initPermissions();
  await initAdminUsers();
  await initUsers();

  if (process.env.NODE_ENV !== "production") {
    const knex = strapi.connections.default;
    if (!parseInt((await knex("channels").count())?.[0]?.["count"])) {
      await applyFakes();
    }
  }
};

module.exports = {
  initialize,
};

if (require.main === module) {
  bootstrap(initialize);
}
