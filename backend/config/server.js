module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  admin: {
    auth: {
      email: env("ADMIN_EMAIL", "admin@pujas.live"),
      password: env("ADMIN_PASSWORD", "Password1"),
      secret: env(
        "BACKEND_ADMIN_JWT_SECRET",
        "84e6457362f7d463de2f83d6a86d822d"
      ),
    },
  },
  frontendUrl: env("FRONTEND_URL", "http://localhost:3000"),
  hcaptchaSecret: env("HCAPTCHA_SECRET"),
  siteName: env("SITE_NAME", "Pujas.live"),
});
