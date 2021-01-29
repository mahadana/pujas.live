"use strict";

const _ = require("lodash");

const emailRegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const formatError = (error) => [
  { messages: [{ id: error.id, message: error.message }] },
];

module.exports = {
  async changeEmail(ctx) {
    const params = _.assign({}, ctx.request.body, ctx.params);
    const email = params.email;
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized();
    }
    if (!emailRegExp.test(email)) {
      return ctx.badRequest(
        null,
        formatError({
          id: "Auth.form.error.email.format",
          message: "Please provide valid email address.",
        })
      );
    }

    await strapi
      .query("user", "users-permissions")
      .update({ id: user.id }, { email, username: email });
    ctx.send({ ok: true });
  },

  async changePassword(ctx) {
    const params = _.assign({}, ctx.request.body, ctx.params);
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized();
    }

    if (
      params.oldPassword &&
      params.newPassword &&
      params.newPasswordConfirmation &&
      params.newPassword === params.newPasswordConfirmation
    ) {
      const userService = strapi.plugins["users-permissions"].services.user;

      const validPassword = await userService.validatePassword(
        params.oldPassword,
        user.password
      );

      if (!validPassword) {
        return ctx.badRequest(
          null,
          formatError({
            id: "Auth.form.error.invalid",
            message: "Old password invalid.",
          })
        );
      }

      const password = await userService.hashPassword({
        password: params.newPassword,
      });
      await strapi
        .query("user", "users-permissions")
        .update({ id: user.id }, { password });

      ctx.send({ ok: true });
    } else if (
      params.oldPassword &&
      params.newPassword &&
      params.newPasswordConfirmation &&
      params.newPassword !== params.newPasswordConfirmation
    ) {
      return ctx.badRequest(
        null,
        formatError({
          id: "Auth.form.error.password.matching",
          message: "New passwords do not match.",
        })
      );
    } else {
      return ctx.badRequest(
        null,
        formatError({
          id: "Auth.form.error.params.provide",
          message: "Incorrect params provided.",
        })
      );
    }
  },
};
