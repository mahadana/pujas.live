#!/usr/bin/env node

const fetch = require("cross-fetch");
const fs = require("fs");
const mime = require("mime-types");
const path = require("path");
const tmp = require("tmp");

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
    console.log(`  email = ${adminUser.email}`);
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
    console.log(`  email: ${user.email}`);
  }
};

const seedUploads = async () => {
  console.log("Seeding uploads:");

  const uploadData = [
    [
      "abhayagiri.jpg",
      "https://gallery.abhayagiri.org/upload/2019/01/09/20190109101121-cac6ea09.jpg",
    ],
    [
      "pacific-hermitage.jpg",
      "https://pacifichermitage.org/wp-content/uploads/2015/05/P1150559.jpg",
    ],
    [
      "amaravati.jpg",
      "https://cdn.amaravati.org/wp-content/uploads/2014/10/09/Am_1_121.jpg",
    ],
    [
      "morning.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Sun_rises_on_Early_Morning.jpg/640px-Sun_rises_on_Early_Morning.jpg",
    ],
    [
      "england-fields.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Yellow_Fields_of_England%2C_rapeseed.jpg/640px-Yellow_Fields_of_England%2C_rapeseed.jpg",
    ],
    [
      "chanting-monastics.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Rajgir_-_037_Chanting_%289242149699%29.jpg/640px-Rajgir_-_037_Chanting_%289242149699%29.jpg",
    ],
  ];

  const downloadToTemp = async (url) => {
    const result = await fetch(url);
    const tmpobj = tmp.fileSync();
    const stream = fs.createWriteStream(null, { fd: tmpobj.fd });
    await new Promise((resolve, reject) => {
      result.body.pipe(stream);
      result.body.on("error", reject);
      stream.on("finish", resolve);
    });
    return tmpobj.name;
  };

  for (data of uploadData) {
    const [name, url] = data;
    const upload = await strapi.plugins.upload.services.upload.fetch({ name });
    if (upload) {
      console.log(`  ${name} (already exists)`);
    } else {
      const tmpPath = await downloadToTemp(url);
      const uploads = await strapi.plugins.upload.services.upload.upload({
        data: [{}],
        files: [
          {
            path: tmpPath,
            name,
            type: mime.lookup(name),
            size: fs.statSync(tmpPath).size,
          },
        ],
      });
      console.log(`  ${name}`);
    }
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

  const getImageId = async (name) => {
    const image = await strapi.plugins.upload.services.upload.fetch({ name });
    return image?.id;
  };

  await seedTable(
    "monastery",
    [
      {
        name: "Abhayagiri",
        description: "A fine monastery",
        image: await getImageId("abhayagiri.jpg"),
        url: "https://www.abhayagiri.org/",
        state: "published",
      },
      {
        name: "Pacific Hermitage",
        description: "A fine hermitage",
        image: await getImageId("pacific-hermitage.jpg"),
        url: "https://pacifichermitage.org/",
        state: "published",
      },
      {
        name: "Amaravati",
        description: "A fine monastery",
        image: await getImageId("amaravati.jpg"),
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
        image: await getImageId("abhayagiri.jpg"),
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
        image: await getImageId("pacific-hermitage.jpg"),
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
        image: await getImageId("amaravati.jpg"),
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
        image: await getImageId("chanting-monastics.jpg"),
        confirmed: true,
        state: "published",
        owner: user.id,
      },
      {
        name: "Amaravati Weekly Dhamma talk followers",
        description:
          "We join a group zoom call every week to watch the Dhamma talk from Amaravati. Sometimes the session is followed by brief dhamma discussion. No maximum size. The more the merrier!",
        image: await getImageId("england-fields.jpg"),
        confirmed: true,
        state: "published",
        owner: user.id,
      },
      {
        name: "Daily morning sit and aspiration group",
        description:
          "We do a silent sit for 30 minutes every morning, followed by listening to a short morning Dhamma reflection from Abhayagiri’s collection of “Beginning our day”. We then go in a circle to mention our aspiration for the day. Aiming for 8-15 daily committed participants",
        image: await getImageId("morning.jpg"),
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
  adminEmail = strapi.config.server.admin.auth.email;
  adminPassword = strapi.config.server.admin.auth.password;

  await seedAdminUser();
  await seedUsers();
  await seedPermissions();
  await seedUploads();
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
