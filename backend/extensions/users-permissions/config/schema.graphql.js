"use strict";

module.exports = {
  definition: `
    type changeEmailPaylod {
      ok: Boolean!
    }

    type changePasswordPayload {
      ok: Boolean!
    }
  `,
  mutation: `
    changeEmail(email: String!): changeEmailPaylod
    changePassword(oldPassword: String!, newPassword: String!): changePasswordPayload
  `,
  resolver: {
    Mutation: {
      register: {
        policies: ["plugins::users-permissions.ratelimit", "global::captcha"],
      },

      changeEmail: {
        description: "Change a user's email",
        resolver: "plugins::users-permissions.auth.changeEmail",
      },

      changePassword: {
        description: "Change a user's password",
        resolver: "plugins::users-permissions.auth.changePassword",
      },

      forgotPassword: {
        policies: ["plugins::users-permissions.ratelimit", "global::captcha"],
      },
    },
  },
};
