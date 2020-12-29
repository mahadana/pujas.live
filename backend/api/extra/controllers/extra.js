"use strict";

const crypto = require("crypto");
const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  // POST /auth/token
  async loginWithToken(ctx) {
    const loginToken = ctx.request?.body?.loginToken;
    if (!loginToken) {
      return ctx.badRequest(null, "loginToken not provided");
    }

    const user = await strapi.query("user", "users-permissions").findOne({
      loginToken,
    });
    if (!user) {
      return ctx.badRequest(null, "user not found with loginToken");
    }

    await strapi
      .query("user", "users-permissions")
      .update({ id: user.id }, { confirmed: true });

    ctx.send({
      jwt: strapi.plugins["users-permissions"].services.jwt.issue({
        id: user.id,
      }),
      user: sanitizeEntity(user.toJSON ? user.toJSON() : user, {
        model: strapi.query("user", "users-permissions").model,
      }),
    });
  },

  // GET /groups/prepare
  async prepareGroup(ctx) {
    const { email, name, description } = ctx.request.body;
    console.log("prepareGroup", email, name, description);

    const password = crypto
      .randomBytes(16)
      .toString("base64")
      .replace(/[^0-9a-z]/gi, "")
      .substring(0, 10);
    let loginToken = crypto
      .randomBytes(32)
      .toString("base64")
      .replace(/[^0-9a-z]/gi, "");
    const hashedPassword = await strapi.admin.services.auth.hashPassword(
      password
    );

    let user = await strapi.query("user", "users-permissions").findOne({
      email,
    });

    if (user) {
      if (user.loginToken) {
        loginToken = user.loginToken;
      } else {
        await strapi
          .query("user", "users-permissions")
          .update({ id: user.id }, { loginToken });
      }
    } else {
      const authenticatedRole = await strapi
        .query("role", "users-permissions")
        .findOne({
          name: "Authenticated",
        });
      user = await strapi.query("user", "users-permissions").create({
        username: email,
        email,
        provider: "local",
        password: hashedPassword,
        confirmed: false,
        blocked: false,
        role: authenticatedRole.id,
        loginToken,
      });
      console.log(`created user ${email} ${password}`);
    }

    const group = await strapi.query("group").create({
      name,
      description,
      confirmed: false,
      owner: user.id,
    });
    console.log(`created group ${name}`);

    const text = `To validate your new group posting, please click on the following link:

${strapi.config.get("server.frontendUrl")}/groups/${
      group.id
    }/verify?token=${loginToken}

Have fun!
`;

    await strapi.plugins["email"].services.email.send({
      to: email,
      from: "admin@pujas.live",
      fromName: "Pujas.live",
      subject: `[Pujas.live] Verify group ${name}`,
      text,
    });
    console.log(`sent email to ${email}`);

    return JSON.stringify(group);
  },
};
