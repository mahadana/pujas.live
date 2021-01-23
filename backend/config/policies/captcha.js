"use strict";

const hcaptcha = require("hcaptcha");

/**
 * `captcha` policy.
 */

module.exports = async (ctx, next) => {
  const secret = strapi.config.get("server.hcaptchaSecret");
  if (!secret) {
    strapi.log.warn(
      "Captcha check bypassed. HCAPTCHA_SECRET not defined in .env file."
    );
    return await next();
  }

  if (ctx.state?.user) {
    strapi.log.debug("Captcha check bypassed. User already authenticated.");
    return await next();
  }

  const token = ctx.request?.header?.["x-captcha-token"];
  if (!token) {
    strapi.log.error("X-Captcha-Token header not provided.");
    throw strapi.errors.unauthorized("X-Captcha-Token header not provided");
  }

  let data;
  try {
    data = await hcaptcha.verify(secret, token);
  } catch (error) {
    strapi.log.error("Exception occured during captcha token verification.");
    throw strapi.errors.unauthorized(error);
  }

  if (data?.success) {
    strapi.log.info("Captcha token successfully verified");
    return await next();
  } else {
    strapi.log.error("Captcha token failed verification");
    throw strapi.errors.unauthorized("Captcha token failed verification");
  }
};
