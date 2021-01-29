"use strict";

const _ = require("lodash");

function checkBadRequest(contextBody) {
  if (_.get(contextBody, "statusCode", 200) !== 200) {
    const message = _.get(contextBody, "error", "Bad Request");
    const exception = new Error(message);
    exception.code = _.get(contextBody, "statusCode", 400);
    exception.data = contextBody;
    throw exception;
  }
}

module.exports = {
  mutation: `
    changeEmail(email: String!): UserPermissionsPasswordPayload
    changePassword(oldPassword: String!, newPassword: String!, newPasswordConfirmation: String!): UserPermissionsPasswordPayload
  `,
  resolver: {
    Mutation: {
      register: {
        policies: ["plugins::users-permissions.ratelimit", "global::captcha"],
      },

      changeEmail: {
        description: "Change a user's email",
        resolverOf: "plugins::users-permissions.auth.changeEmail",
        resolver: async (obj, options, { context }) => {
          context.request.body = _.toPlainObject(options);
          await strapi.plugins[
            "users-permissions"
          ].controllers.auth.changeEmail(context);
          let output = context.body.toJSON
            ? context.body.toJSON()
            : context.body;
          checkBadRequest(output);
          return {
            ok: output.ok || output,
          };
        },
      },

      changePassword: {
        description: "Change a user's password",
        resolverOf: "plugins::users-permissions.auth.changePassword",
        resolver: async (obj, options, { context }) => {
          context.request.body = _.toPlainObject(options);
          await strapi.plugins[
            "users-permissions"
          ].controllers.auth.changePassword(context);
          let output = context.body.toJSON
            ? context.body.toJSON()
            : context.body;
          checkBadRequest(output);
          return {
            ok: output.ok || output,
          };
        },
      },

      forgotPassword: {
        policies: ["plugins::users-permissions.ratelimit", "global::captcha"],
      },
    },
  },
};
