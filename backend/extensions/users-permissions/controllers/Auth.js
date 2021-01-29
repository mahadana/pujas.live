"use strict";

module.exports = {
  async changeEmail(ctx) {
    const user = ctx.state.user;
    const { email } = ctx.request.body;
    if (!user) {
      return ctx.unauthorized();
    }
    const userService = strapi.plugins["users-permissions"].services.user;
    await userService.changeEmail(user, email);
    return { ok: true };
  },

  async changePassword(ctx) {
    const user = ctx.state.user;
    const { newPassword, oldPassword } = ctx.request.body;
    if (!user) {
      return ctx.unauthorized();
    }
    const userService = strapi.plugins["users-permissions"].services.user;
    if (!(await userService.validatePassword(oldPassword, user.password))) {
      throw new Error("Invalid old password");
    }
    await userService.changePassword(user, newPassword);
    return { ok: true };
  },
};
