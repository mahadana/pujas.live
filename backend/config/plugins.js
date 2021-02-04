module.exports = ({ env }) => ({
  email: {
    provider: env("MAIL_PROVIDER", "nodemailer"),
    providerOptions: {
      host: env("MAIL_HOST", "mail"),
      port: env.int("MAIL_PORT", 25),
    },
    settings: {
      defaultFrom: {
        address: env("MAIL_FROM_ADDRESS", "contact@pujas.live"),
        name: env("MAIL_FROM_NAME", "Pujas.live"),
      },
    },
  },
});
