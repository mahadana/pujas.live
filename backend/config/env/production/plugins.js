module.exports = ({ env }) => ({
  email: {
    provider: "mailjet",
    providerOptions: {
      publicApiKey: env("MAILJET_PUBLIC_KEY"),
      secretApiKey: env("MAILJET_SECRET_KEY"),
    },
    settings: {
      defaultFrom: "contact@pujas.live",
      defaultFromName: "Pujas.live",
    },
  },
});
