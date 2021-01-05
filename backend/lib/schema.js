const fixSchema = async () => {
  const knex = strapi.connections.default;

  strapi.log.info("Fixing channels schema...");
  await knex.schema.alterTable("channels", function (t) {
    t.string("title").notNullable().alter();
    t.string("automate").notNullable().alter();
  });

  strapi.log.info("Fixing recordings schema...");
  await knex.schema.alterTable("recordings", function (t) {
    t.string("title").notNullable().alter();
    t.string("automate").notNullable().alter();
    t.string("recordingUrl").notNullable().alter();
    t.boolean("embed").notNullable().alter();
    t.boolean("live").notNullable().alter();
  });
};

module.exports = { fixSchema };

if (require.main === module) {
  process.chdir(require("path").dirname(__dirname));
  require("strapi")()
    .load()
    .then(fixSchema)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
