const bootstrap = require("../bootstrap");
const { getOne } = require("./util");

const initAdminUsers = async () => {
  strapi.log.info("Initializing admin users:");
  const adminEmail = strapi.config.server.admin.auth.email;
  const adminPassword = strapi.config.server.admin.auth.password;

  const adminRole = await getOne({ name: "Super Admin" }, "role", "admin");
  let adminUser = await strapi
    .query("user", "admin")
    .findOne({ email: adminEmail });

  if (adminUser) {
    strapi.log.info(`  email: ${adminUser.email} (already exists)`);
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
    strapi.log.info(`  email = ${adminUser.email}`);
  }
};

const initUsers = async () => {
  strapi.log.info("Initializing users:");
  const adminEmail = strapi.config.server.admin.auth.email;
  const adminPassword = strapi.config.server.admin.auth.password;

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
    strapi.log.info(`  email: ${user.email} (already exists)`);
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
    strapi.log.info(`  email: ${user.email}`);
  }
};

module.exports = { initAdminUsers, initUsers };

if (require.main === module) {
  bootstrap(async () => {
    await initAdminUsers();
    await initUsers();
  });
}
