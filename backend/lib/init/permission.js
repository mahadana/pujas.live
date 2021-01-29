const bootstrap = require("../bootstrap");
const { getOne } = require("./util");

const initPermissions = async () => {
  strapi.log.info("Initializing permissions:");

  const updatePermissions = async (role, controllers, actions, enabled) => {
    const roleModel = await getOne({ name: role }, "role", "users-permissions");

    for (const controller of controllers) {
      strapi.log.info(`  ${role}/${controller}: ` + actions.join(" "));
      for (const action of actions) {
        await strapi
          .query("permission", "users-permissions")
          .update({ controller, action, role: roleModel.id }, { enabled });
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
    ["channel", "group", "monastery", "recording"],
    ["count", "find", "findone"],
    true
  );
  await updatePermissions("Public", ["site"], ["message"], true);
  await updatePermissions(
    "Public",
    ["extra"],
    ["loginwithtoken", "preparegroup"],
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
  await updatePermissions("Authenticated", ["site"], ["message"], true);
  await updatePermissions("Authenticated", ["upload"], ["upload"], true);
};

module.exports = { initPermissions };

if (require.main === module) {
  bootstrap(initPermissions);
}
