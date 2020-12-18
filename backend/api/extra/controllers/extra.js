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
    console.log("1");

    const user = await strapi.query("user", "users-permissions").findOne({
      loginToken,
    });
    console.log("2");
    if (!user) {
      return ctx.badRequest(null, "user not found with loginToken");
    }
    console.log("3");

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
    const baseUrl = strapi.config.get(
      "server.frontendBaseUrl",
      "http://localhost:3000"
    );

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

    const group = await strapi.services.groups.create({
      name,
      description,
      confirmed: false,
      owner: user.id,
    });

    const text = `To validate your new group posting, please click on the following link:

${baseUrl}/groups/${group.id}/verify?token=${loginToken}

Have fun!
`;

    await strapi.plugins["email"].services.email.send({
      to: "v.jagaro+123@gmail.com", // email
      from: "admin@pujas.live",
      fromName: "Pujas.live",
      subject: `Verify group ${name}`,
      text,
    });

    return JSON.stringify(group);
  },
};
