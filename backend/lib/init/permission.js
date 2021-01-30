const bootstrap = require("../bootstrap");
const { getOne } = require("./util");

const initPermissions = async () => {
  strapi.log.info("Initializing permissions:");

  const enablePermissions = async (roles, controllers, actions) => {
    for (const role of roles) {
      const roleModel = await getOne(
        { name: role },
        "role",
        "users-permissions"
      );
      for (const controller of controllers) {
        strapi.log.info(`  ${role}/${controller}: ` + actions.join(" "));
        for (const action of actions) {
          await strapi
            .query("permission", "users-permissions")
            .update(
              { controller, action, role: roleModel.id },
              { enabled: true }
            );
        }
      }
    }
  };

  await enablePermissions(
    ["Authenticated", "Public"],
    ["extra"],
    ["loginwithtoken", "preparegroup"]
  );
  await enablePermissions(
    ["Authenticated", "Public"],
    ["channel", "group", "monastery", "recording"],
    ["count", "find", "findone"]
  );
  await enablePermissions(
    ["Authenticated", "Public"],
    ["group", "site"],
    ["message"]
  );
  await enablePermissions(["Authenticated"], ["group"], ["create", "update"]);
  await enablePermissions(["Authenticated"], ["upload"], ["upload"]);
};

module.exports = { initPermissions };

if (require.main === module) {
  bootstrap(initPermissions);
}
