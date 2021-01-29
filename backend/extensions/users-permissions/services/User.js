"use strict";

const { emailSchema, passwordSchema } = require("../../../lib/util");

module.exports = {
  async changeEmail(user, email) {
    emailSchema.validateSync(email);
    await strapi
      .query("user", "users-permissions")
      .update({ id: user.id }, { email, username: email });
  },

  async changePassword(user, newPassword) {
    const userService = strapi.plugins["users-permissions"].services.user;
    passwordSchema.validateSync(newPassword);
    const password = await userService.hashPassword({
      password: newPassword,
    });
    await strapi
      .query("user", "users-permissions")
      .update({ id: user.id }, { password });
  },
};
