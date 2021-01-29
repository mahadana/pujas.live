"use strict";

module.exports = {
  definition: `
    input messageGroupInput {
      where: InputID
      data: messageGroupDataInput
    }

    input messageGroupDataInput {
      email: String!
      experience: String!
      interest: String!
      name: String!
    }
  
    type messageGroupPayload {
      ok: Boolean!
    }
  `,
  mutation: `
    messageGroup(input: messageGroupInput): messageGroupPayload
  `,
  resolver: {
    Mutation: {
      messageGroup: {
        description: "Send a message to the owner of a group",
        resolver: "application::group.group.message",
        policies: ["global::captcha"],
      },
    },
  },
};
