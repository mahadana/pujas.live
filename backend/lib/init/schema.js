const bootstrap = require("../bootstrap");

const initSchema = async () => {
  strapi.log.info("Adjusting schema:");

  const knex = strapi.connections.default;

  strapi.log.info("  channels");
  await knex.schema.alterTable("channels", function (t) {
    t.string("title").notNullable().alter();
    t.string("automate").notNullable().alter();
  });

  strapi.log.info("  groups");
  await knex.schema.alterTable("groups", function (t) {
    t.string("title").notNullable().alter();
    t.string("listed").notNullable().alter();
    t.string("timezone").notNullable().alter();
  });
  strapi.log.info("  components_group_events");
  await knex.schema.alterTable("components_group_events", function (t) {
    t.string("day").notNullable().alter();
    t.string("startAt").notNullable().alter();
  });

  strapi.log.info("  monasteries");
  await knex.schema.alterTable("monasteries", function (t) {
    t.string("title").notNullable().alter();
  });

  strapi.log.info("  recordings");
  await knex.schema.alterTable("recordings", function (t) {
    t.string("title").notNullable().alter();
    t.string("automate").notNullable().alter();
    t.string("recordingUrl").notNullable().alter();
    t.boolean("embed").notNullable().alter();
    t.boolean("live").notNullable().alter();
  });
};

module.exports = { initSchema };

if (require.main === module) {
  bootstrap(initSchema);
}
