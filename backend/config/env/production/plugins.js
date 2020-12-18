module.exports = ({ env }) => ({
  email: {
    provider: "sendinblue",
    providerOptions: {
      sendinblue_api_key: env("SENDINBLUE_API_KEY"),
      sendinblue_default_from_name: "Pujas.live",
      sendinblue_default_from: "admin@pujas.live",
      sendinblue_default_replyto: "admin@pujas.live",
    },
  },
});
