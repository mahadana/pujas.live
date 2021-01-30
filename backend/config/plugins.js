module.exports = ({ env }) => ({
  email: {
    provider: env("MAIL_PROVIDER", "nodemailer"),
    providerOptions: {
      host: env("MAIL_HOST", "mail"),
      port: env.int("MAIL_PORT", 25),
    },
    settings: {
      defaultFrom: env("MAIL_DEFAULT_FROM", "contact@pujas.live"),
      defaultFromName: env("MAIL_DEFAULT_FROM_NAME", "Pujas.live"),
    },
  },
});
