#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

process.chdir(path.dirname(__dirname));
const strapiLibrary = require("strapi");

// Globals
let strapi, adminEmail, adminPassword;

const getOne = async (params, modelName, plugin) => {
  const model = await strapi.query(modelName, plugin).findOne(params);
  if (model) {
    return model;
  } else {
    throw new Error(`Cannot find ${modelName} ${JSON.stringify(params)}`);
  }
};

const seedPermissions = async () => {
  console.log("Seeding permissions:");

  const updatePermissions = async (role, controllers, actions, enabled) => {
    const roleModel = await getOne({ name: role }, "role", "users-permissions");

    for (const controller of controllers) {
      for (const action of actions) {
        await strapi
          .query("permission", "users-permissions")
          .update({ controller, action, role: roleModel.id }, { enabled });
        console.log(`  ${role}/${controller}/${action}: ${enabled}`);
      }
    }
  };

  await updatePermissions(
    "Public",
    ["extra"],
    ["loginwithtoken", "preparegroup"],
    true
  );
  await updatePermissions(
    "Public",
    ["group", "monastery", "stream"],
    ["find", "findone"],
    true
  );
  await updatePermissions(
    "Authenticated",
    ["monastery", "stream"],
    ["find", "findone"],
    true
  );
  await updatePermissions(
    "Authenticated",
    ["group"],
    ["create", "find", "findone", "update"],
    true
  );
};

const seedAdminUser = async () => {
  console.log("Seeding admin user:");

  const adminRole = await getOne({ name: "Super Admin" }, "role", "admin");

  let adminUser = await strapi
    .query("user", "admin")
    .findOne({ email: adminEmail });

  if (adminUser) {
    console.log(`  email: ${adminUser.email} (already exists)`);
  } else {
    console.log("adminRole", adminRole.id);
    adminUser = await strapi.query("user", "admin").create({
      username: adminEmail,
      email: adminEmail,
      password: await strapi.admin.services.auth.hashPassword(adminPassword),
      firstname: "Super",
      lastname: "Admin",
      roles: [adminRole.id],
      blocked: false,
      isActive: true,
    });
    console.log(`  email = ${adminUser.email}, password = ${adminPassword}`);
  }
};

const seedUsers = async () => {
  console.log("Seeding user:");

  const admin = await getOne({ email: adminEmail }, "user", "admin");
  const authenticated = await getOne(
    { name: "Authenticated" },
    "role",
    "users-permissions"
  );

  let user = await strapi
    .query("user", "users-permissions")
    .findOne({ email: adminEmail });

  if (user) {
    console.log(`  email: ${user.email} (already exists)`);
  } else {
    user = await strapi.query("user", "users-permissions").create({
      username: adminEmail,
      email: adminEmail,
      provider: "local",
      password: await strapi.admin.services.auth.hashPassword(adminPassword),
      confirmed: true,
      blocked: false,
      role: authenticated.id,
      created_by: admin.id,
      updated_by: admin.id,
    });
    console.log(`  email: ${user.email}, password: ${adminPassword}`);
  }
};

const seedTables = async () => {
  const admin = await getOne({ email: adminEmail }, "user", "admin");
  const user = await getOne({ email: adminEmail }, "user", "users-permissions");

  const seedTable = async (modelName, rows, key) => {
    if ((await strapi.query(modelName).count()) == 0) {
      console.log(`Seeding ${modelName}:`);
      for (row of rows) {
        const model = await strapi
          .query(modelName)
          .create({ ...row, created_by: admin.id, updated_by: admin.id });
        console.log(`  ${key}: ${model[key]}`);
      }
    } else {
      console.log(`Seeding ${modelName} (already populated)`);
    }
  };

  await seedTable(
    "monastery",
    [
      {
        name: "Abhayagiri",
        description: "A fine monastery",
        url: "https://www.abhayagiri.org/",
        state: "published",
      },
      {
        name: "Pacific Hermitage",
        description: "A fine hermitage",
        url: "https://pacifichermitage.org/",
        state: "published",
      },
      {
        name: "Amaravati",
        description: "A fine monastery",
        url: "https://www.amaravati.org/",
        state: "published",
      },
    ],
    "name"
  );

  await seedTable(
    "stream",
    [
      {
        name: "Abhayagiri Daily Evening Puja Livestream",
        description:
          "Streamed daily at 7pm Pacific Time, with some exceptions.\nDhamma talks follow puja 1-2 times per week",
        streamUrl:
          "https://www.youtube.com/embed/live_stream?channel=UCFAuQ5fmYYVv5_Dim0EQpVA",
        previousStreamsUrl:
          "https://www.youtube.com/playlist?list=PLa-KRFyPjreSeLAusZUEWIpVqTOWsJzCQ",
        embeddable: 0,
        monastery: (await getOne({ name: "Abhayagiri" }, "monastery")).id,
        state: "published",
      },
      {
        name: "Pacific Hermitage weekly morning livestream",
        description:
          "Streamed daily at __, currently on pause. Returning in the next few weeks",
        streamUrl:
          "https://www.youtube.com/embed/live_stream?channel=UCXQFa-qxHE26J_B5i22HCwA",
        embeddable: 0,
        monastery: (await getOne({ name: "Pacific Hermitage" }, "monastery"))
          .id,
        state: "published",
      },
      {
        name: "Amaravati Sunday Livestream",
        description: "Streamed Sundays at 10:30am GMT(?)",
        streamUrl:
          "https://www.youtube.com/embed/live_stream?channel=UCsgmmAelfZ2kfXZ08xlHpDw",
        embeddable: 1,
        monastery: (await getOne({ name: "Amaravati" }, "monastery")).id,
        state: "published",
      },
    ],
    "name"
  );

  await seedTable(
    "group",
    [
      {
        name: "Morning and Evening Daily Sitting Group",
        description:
          "We sit and chant daily every morning (1.5h) and evening (1h) at 6am and 7pm PT, using pre-recorded and livestream sessions from Abhayagiri. Sometimes morning session is followed by brief dhamma discussion. Aiming for a steady size of 3-6 people",
        confirmed: true,
        state: "published",
        owner: user.id,
      },
      {
        name: "Amaravati Weekly Dhamma talk followers",
        description:
          "We join a group zoom call every week to watch the Dhamma talk from Amaravati. Sometimes the session is followed by brief dhamma discussion. No maximum size. The more the merrier!",
        confirmed: true,
        state: "published",
        owner: user.id,
      },
      {
        name: "Daily morning sit and aspiration group",
        description:
          "We do a silent sit for 30 minutes every morning, followed by listening to a short morning Dhamma reflection from Abhayagiri’s collection of “Beginning our day”. We then go in a circle to mention our aspiration for the day. Aiming for 8-15 daily committed participants",
        confirmed: true,
        state: "published",
        owner: user.id,
      },
    ],
    "name"
  );
};

const run = async () => {
  // Set globals
  strapi = await strapiLibrary().load();
  adminEmail = process.env.STRAPI_ADMIN_EMAIL || "admin@pujas.live";
  adminPassword = process.env.STRAPI_ADMIN_PASSWORD || "Password1";

  await seedAdminUser();
  await seedUsers();
  await seedPermissions();
  await seedTables();
};

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
