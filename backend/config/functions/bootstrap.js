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

module.exports = async () => {
  // This is for changepassword...and should be integrated into strapi upstream.

  const roles = await strapi
    .query("role", "users-permissions")
    .find({ type: "authenticated" });

  for (const action of ["changeemail", "changepassword"]) {
    for (const role of roles) {
      await strapi
        .query("permission", "users-permissions")
        .update(
          { action, controller: "auth", role: role.id },
          { enabled: true }
        );
    }
  }
};
