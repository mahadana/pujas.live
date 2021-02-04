"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

const yup = require("yup");

const {
  emailSchema,
  encodeAddress,
  encodeMailto,
  getEmailTemplate,
  requiredStringSchema,
} = require("../../../lib/util");

const { getGroupEditPath, getGroupMessagePath } = require("shared/path");

const messageGroupSchema = yup.object({
  email: emailSchema,
  experience: requiredStringSchema,
  interest: requiredStringSchema,
  name: requiredStringSchema,
});

module.exports = {
  async message(groupId, params) {
    const group = await strapi.services.group.findOne({ id: groupId });
    if (!group) {
      throw Error(`Group not found`);
    }

    emailSchema.validateSync(group.owner?.email);
    messageGroupSchema.validateSync(params);

    const frontendUrl = strapi.config.get("server.frontendUrl");
    const from = { name: params.name, address: params.email };

    await strapi.plugins["email"].services.email.sendTemplatedEmail(
      {
        from: {
          name: strapi.config.get("plugins.email.settings.defaultFromName"),
          address: strapi.config.get("plugins.email.settings.defaultFrom"),
        },
        replyTo: from,
        to: { name: group.title, address: group.owner.email },
      },
      {
        subject: "[Pujas.live] Join request from ${name}",
        text: await getEmailTemplate("group-message.txt"),
        html: await getEmailTemplate("group-message.html"),
      },
      {
        ...params,
        address: encodeAddress(from),
        groupMessageUrl: frontendUrl + getGroupMessagePath(group),
        groupEditUrl: frontendUrl + getGroupEditPath(group),
        mailto: encodeMailto({ to: from }),
      }
    );
  },
};
