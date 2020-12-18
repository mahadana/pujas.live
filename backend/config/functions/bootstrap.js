"use strict";

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#bootstrap
 */

const updatePermissions = async (role, controllers, actions, enabled) => {
  try {
    const roleModel = await strapi.query("role", "users-permissions").findOne({
      name: role,
    });
    for (const controller of controllers) {
      for (const action of actions) {
        const userPermissionModel = await strapi
          .query("permission", "users-permissions")
          .findOne({ controller, action, role: roleModel.id });
        await strapi
          .query("permission", "users-permissions")
          .update({ id: userPermissionModel.id }, { enabled });
        console.log(
          `Set permission ${role}:${controller}:${action} = ${enabled}`
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const ensureAdmin = async () => {
  const email = "admin@example.com";
  const password = Math.random().toString(36).slice(2);
  try {
    const admins = await strapi.query("user", "admin").find();
    if (admins.length > 0) {
      console.log(`Admin account ${admins[0].email} already exists.`);
      return;
    }
    let adminRole = await strapi.query("role", "admin").findOne({
      code: "strapi-super-admin",
    });
    if (!adminRole) {
      adminRole = await strapi.query("role", "admin").create({
        name: "Super Admin",
        code: "strapi-super-admin",
        description:
          "Super Admins can access and manage all features and settings.",
      });
    }
    const admin = await strapi.query("user", "admin").create({
      email: email,
      password: await strapi.admin.services.auth.hashPassword(password),
      firstname: "Super",
      lastname: "Admin",
      roles: [adminRole.id],
      blocked: false,
      isActive: true,
    });
    console.log("Admin account was successfully created.");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  } catch (error) {
    console.error(error);
  }
};

module.exports = async () => {
  if ((await strapi.services.monasteries.count()) == 0) {
    await strapi.services.monasteries.create({
      id: 1,
      name: "Abhayagiri",
      url: "https://www.abhayagiri.org/",
      state: "published",
    });
    await strapi.services.monasteries.create({
      id: 2,
      name: "Pacific Hermitage",
      url: "https://pacifichermitage.org/",
      state: "published",
    });
    await strapi.services.monasteries.create({
      id: 3,
      name: "Amaravati",
      url: "https://www.amaravati.org/",
      state: "published",
    });
  }

  if ((await strapi.services.streams.count()) == 0) {
    await strapi.services.streams.create({
      id: 1,
      name: "Abhayagiri Daily Evening Puja Livestream",
      description:
        "Streamed daily at 7pm Pacific Time, with some exceptions.\nDhamma talks follow puja 1-2 times per week",
      streamUrl:
        "https://www.youtube.com/embed/live_stream?channel=UCFAuQ5fmYYVv5_Dim0EQpVA",
      previousStreamsUrl:
        "https://www.youtube.com/playlist?list=PLa-KRFyPjreSeLAusZUEWIpVqTOWsJzCQ",
      embeddable: 0,
      monastery: 1,
      state: "published",
    });
    await strapi.services.streams.create({
      id: 2,
      name: "Pacific Hermitage weekly morning livestream",
      description:
        "Streamed daily at __, currently on pause. Returning in the next few weeks",
      streamUrl:
        "https://www.youtube.com/embed/live_stream?channel=UCXQFa-qxHE26J_B5i22HCwA",
      embeddable: 0,
      monastery: 2,
      state: "published",
    });
    await strapi.services.streams.create({
      id: 3,
      name: "Amaravati Sunday Livestream",
      description: "Streamed Sundays at 10:30am GMT(?)",
      streamUrl:
        "https://www.youtube.com/embed/live_stream?channel=UCsgmmAelfZ2kfXZ08xlHpDw",
      embeddable: 1,
      monastery: 3,
      state: "published",
    });
  }

  if ((await strapi.services.groups.count()) == 0) {
    await strapi.services.groups.create({
      id: 1,
      name: "Morning and Evening Daily Sitting Group",
      description:
        "We sit and chant daily every morning (1.5h) and evening (1h) at 6am and 7pm PT, using pre-recorded and livestream sessions from Abhayagiri. Sometimes morning session is followed by brief dhamma discussion. Aiming for a steady size of 3-6 people",
      confirmed: 1,
      state: "published",
    });
    await strapi.services.groups.create({
      id: 2,
      name: "Amaravati Weekly Dhamma talk followers",
      description:
        "We join a group zoom call every week to watch the Dhamma talk from Amaravati. Sometimes the session is followed by brief dhamma discussion. No maximum size. The more the merrier!",
      confirmed: 1,
      state: "published",
    });
    await strapi.services.groups.create({
      id: 3,
      name: "Daily morning sit and aspiration group",
      description:
        "We do a silent sit for 30 minutes every morning, followed by listening to a short morning Dhamma reflection from Abhayagiri’s collection of “Beginning our day”. We then go in a circle to mention our aspiration for the day. Aiming for 8-15 daily committed participants",
      confirmed: 1,
      state: "published",
    });
  }

  await updatePermissions(
    "Public",
    ["extra"],
    ["loginwithtoken", "preparegroup"],
    true
  );
  await updatePermissions(
    "Public",
    ["groups", "monasteries", "streams"],
    ["find", "findone"],
    true
  );
  await updatePermissions(
    "Authenticated",
    ["monasteries", "streams"],
    ["find", "findone"],
    true
  );
  await updatePermissions(
    "Authenticated",
    ["groups"],
    ["create", "find", "findone", "update"],
    true
  );

  await ensureAdmin();
};
