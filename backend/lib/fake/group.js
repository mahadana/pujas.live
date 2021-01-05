const faker = require("faker");
const moment = require("moment");
const { listTimeZones } = require("timezone-support");

const bootstrap = require("../bootstrap");
const { addFakeAssociatedImage } = require("./image");
const { makeTimestamps, truncateCollection, truncateTable } = require("./util");
const { GROUP_COUNT, USER_COUNT } = require("./constants");

const TIMEZONES = listTimeZones();

const applyFakeGroups = async () => {
  strapi.log.info("Faking groups...");
  await truncateTable(["components_group_events", "groups_components"]);
  await truncateCollection("groups");
  const knex = strapi.connections.default;
  for (let id = 1; id <= GROUP_COUNT; id++) {
    const [gid] = await knex("groups")
      .insert({
        title: faker.lorem.words(4),
        description: faker.lorem.paragraph(),
        listed: !!faker.random.number(4),
        owner: faker.random.number({ min: 1, max: USER_COUNT }),
        timezone: faker.random.arrayElement(TIMEZONES),
        ...makeTimestamps(),
      })
      .returning("id");
    for (let n = 1; n <= faker.random.number(4); n++) {
      const [cid] = await knex("components_group_events")
        .insert({
          day: faker.random.arrayElement(
            strapi.components["event.group-event"].attributes.day.enum
          ),
          startAt: moment(faker.date.soon()).format("HH:mm:ss"),
          duration: faker.random.boolean()
            ? 10 + faker.random.number(100)
            : null,
        })
        .returning("id");
      await knex("groups_components").insert({
        field: "events",
        order: n,
        component_type: "components_group_events",
        component_id: cid,
        group_id: gid,
      });
    }
    await addFakeAssociatedImage("groups", "image", id);
  }
};

module.exports = {
  applyFakeGroups,
};

if (require.main === module) {
  bootstrap(applyFakeGroups);
}
