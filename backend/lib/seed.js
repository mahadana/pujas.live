const fetch = require("cross-fetch");
const fs = require("fs");
const mime = require("mime-types");
const moment = require("moment-timezone");
const tmp = require("tmp");

// Globals
let adminEmail, adminPassword;

const getOne = async (params, modelName, plugin) => {
  const model = await strapi.query(modelName, plugin).findOne(params);
  if (model) {
    return model;
  } else {
    throw new Error(`Cannot find ${modelName} ${JSON.stringify(params)}`);
  }
};

const seedSettings = async () => {
  console.log("Seeding settings:");

  const pluginStore = await strapi.store({
    environment: "",
    type: "plugin",
    name: "users-permissions",
  });

  const resetPasswordUrl = `${strapi.config.server.frontendUrl}/auth/reset-password`;

  await pluginStore.set({
    key: "advanced",
    value: {
      unique_email: true,
      allow_register: true,
      email_confirmation: false,
      email_reset_password: resetPasswordUrl,
      email_confirmation_redirection: null,
      default_role: "authenticated",
    },
  });
  console.log("  plugin:users-permissions:advanced");

  const emailConfirmationMessage = `<p>Thank you for registering!</p>
<p>You have to confirm your email address. Please click on the link below.</p>
<p><%= URL %>?confirmation=<%= CODE %></p>
<p>Thanks.</p>`;
  const resetPasswordMessage = `<p>We heard that you lost your password. Sorry about that!</p>
<p>But don’t worry! You can use the following link to reset your password:</p>
<p><%= URL %>?code=<%= TOKEN %></p>
<p>Thanks.</p>`;
  await pluginStore.set({
    key: "email",
    value: {
      email_confirmation: {
        display: "Email.template.email_confirmation",
        icon: "check-square",
        options: {
          from: { name: "Pujas.live", email: "no-reply@pujas.live" },
          message: emailConfirmationMessage,
          object: "[Pujas.live] Confirm your email",
          response_email: null,
        },
      },
      reset_password: {
        display: "Email.template.reset_password",
        icon: "sync",
        options: {
          from: { name: "Pujas.live", email: "no-reply@pujas.live" },
          message: resetPasswordMessage,
          object: "[Pujas.live] Reset password",
          response_email: null,
        },
      },
    },
  });
  console.log("  plugin:users-permissions:email");
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
      }
      console.log(`  ${role}/${controller}: ` + actions.join(" "));
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
    ["channel", "monastery", "recording"],
    ["count", "find", "findone"],
    true
  );
  await updatePermissions(
    "Public",
    ["group"],
    ["count", "find", "findone", "message"],
    true
  );
  await updatePermissions(
    "Authenticated",
    ["channel", "monastery", "recording"],
    ["count", "find", "findone"],
    true
  );
  await updatePermissions(
    "Authenticated",
    ["group"],
    ["count", "create", "find", "findone", "message", "update"],
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

const run = async () => {
  // Set globals
  adminEmail = strapi.config.server.admin.auth.email;
  adminPassword = strapi.config.server.admin.auth.password;

  await seedSettings();
  await seedAdminUser();
  await seedUsers();
  await seedPermissions();
  // await seedUploads();
  // await seedTables();
};

if (require.main === module) {
  process.chdir(require("path").dirname(__dirname));
  require("strapi")()
    .load()
    .then(run)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
