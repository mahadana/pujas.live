"use strict";

module.exports = {
  resolver: {
    Mutation: {
      register: {
        policies: ["plugins::users-permissions.ratelimit", "global::captcha"],
      },
      forgotPassword: {
        policies: ["plugins::users-permissions.ratelimit", "global::captcha"],
      }
    },
  },
};
