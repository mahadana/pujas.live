const faker = require("faker");
const moment = require("moment");
const { listTimeZones } = require("timezone-support");

const { addUrlToUploads } = require("./upload");

const ADMIN_USER_COUNT = 1;
const CHANNEL_COUNT = 10;
const GROUP_COUNT = 10;
const IMAGE_COUNT = 10;
const MONASTERY_COUNT = 10;
const RECORDING_COUNT = 100;
const USER_COUNT = 1;

const FAKE_IMAGE_URL = "https://picsum.photos/300";
const TIMEZONES = listTimeZones();
const YOUTUBE_CHANNELS = [
  "https://www.youtube.com/c/AbhayagiriBuddhistMonastery",
  "https://www.youtube.com/c/AmaravatiBuddhistMonastery",
  "https://www.youtube.com/c/PacificHermitage",
];
const YOUTUBE_VIDEOS = [
  "https://youtu.be/dEZLs7q2Q34",
  "https://youtu.be/BgsbBWcKch8",
  "https://youtu.be/h31f6iD2GZ8",
  "https://youtu.be/a7f7g_mQO6E",
];

const metaData = () => {
  let createdAt = faker.date.past();
  let updatedAt = faker.date.past();
  if (createdAt.getTime() > updatedAt.getTime()) {
    createdAt = updatedAt;
  }
  return {
    published_at: faker.random.number(10) ? faker.date.recent() : null,
    updated_by: faker.random.number({ min: 1, max: ADMIN_USER_COUNT }),
    updated_at: updatedAt,
    created_by: faker.random.number({ min: 1, max: ADMIN_USER_COUNT }),
    created_at: createdAt,
  };
};

const addFakeChannels = async () => {
  strapi.log.info("Faking channels...");
  const knex = strapi.connections.default;
  await knex("upload_file_morph").where("related_type", "channels").delete();
  await knex.raw("TRUNCATE TABLE channels RESTART IDENTITY CASCADE");
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
      ...metaData(),
    });
    if (faker.random.number(4)) {
      await addFakeAssociatedImage("channels", "image", id);
    }
  }
};

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

const addFakeImages = async () => {
  strapi.log.info("Faking images...");
  const knex = strapi.connections.default;
  await knex.raw("TRUNCATE TABLE upload_file_morph RESTART IDENTITY CASCADE");
  await knex.raw("TRUNCATE TABLE upload_file RESTART IDENTITY CASCADE");
  // Concurrent downloads...
  await Promise.all(
    Array.from(Array(IMAGE_COUNT).keys()).map((i) =>
      addUrlToUploads(FAKE_IMAGE_URL, `${i + 1}.jpg`)
    )
  );
};

const addFakeMonasteries = async () => {
  strapi.log.info("Faking monasteries...");
  const knex = strapi.connections.default;
  await knex("upload_file_morph").where("related_type", "monasteries").delete();
  await knex.raw("TRUNCATE TABLE monasteries RESTART IDENTITY CASCADE");
  for (let id = 1; id <= MONASTERY_COUNT; id++) {
    await knex("monasteries").insert({
      title: faker.lorem.words(4),
      description: faker.lorem.paragraph(),
      websiteUrl: faker.internet.url(),
      ...metaData(),
    });
    await addFakeAssociatedImage("monasteries", "image", id);
  }
};

const addFakeRecordings = async () => {
  strapi.log.info("Faking recordings...");
  const knex = strapi.connections.default;
  await knex("upload_file_morph").where("related_type", "recordings").delete();
  await knex.raw("TRUNCATE TABLE recordings RESTART IDENTITY CASCADE");
  for (let id = 1; id <= RECORDING_COUNT; id++) {
    await knex("recordings").insert({
      title: faker.lorem.words(5),
      description: faker.lorem.paragraph(),
      automate: faker.random.number(4) ? "youtube" : "manual",
      recordingUrl: faker.random.arrayElement(YOUTUBE_VIDEOS) + `?${id}`,
      embed: faker.random.boolean(),
      live: !faker.random.number(40),
      startAt: faker.date.future(),
      endAt: faker.random.boolean() ? faker.date.future() : null,
      duration: faker.random.number({ min: 10, max: 200 }),
      extra: {},
      channel: faker.random.number({ min: 1, max: CHANNEL_COUNT }),
      ...metaData(),
    });
    if (faker.random.number(4)) {
      await addFakeAssociatedImage("recordings", "image", id);
    }
  }
};

const addFakeGroups = async () => {
  strapi.log.info("Faking groups...");
  const knex = strapi.connections.default;
  await knex("upload_file_morph").where("related_type", "groups").delete();
  await knex.raw(
    "TRUNCATE TABLE groups, groups_components" +
      ", components_group_events RESTART IDENTITY CASCADE"
  );
  for (let id = 1; id <= GROUP_COUNT; id++) {
    const [gid] = await knex("groups")
      .insert({
        title: faker.lorem.words(4),
        description: faker.lorem.paragraph(),
        listed: !!faker.random.number(4),
        owner: faker.random.number({ min: 1, max: USER_COUNT }),
        timezone: faker.random.arrayElement(TIMEZONES),
        ...metaData(),
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

const addFakes = async () => {
  await addFakeImages();
  await addFakeMonasteries();
  await addFakeChannels();
  await addFakeRecordings();
  await addFakeGroups();
};

if (require.main === module) {
  process.chdir(require("path").dirname(__dirname));
  require("strapi")()
    .load()
    .then(addFakes)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
