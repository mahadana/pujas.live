"use strict";

module.exports = {
  definition: `
    input messageSiteInput {
      data: messageSiteDataInput
    }

    input messageSiteDataInput {
      email: String!
      message: String!
      name: String!
    }

    type messageSitePayload {
      ok: Boolean!
    }
  `,
  mutation: `
    messageSite(input: messageSiteInput): messageSitePayload
  `,
  resolver: {
    Mutation: {
      messageSite: {
        description: "Send a message to the site owners",
        resolver: "application::site.site.message",
        policies: ["global::captcha"],
      },
    },
  },
};
