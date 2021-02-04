module.exports = {
  settings: {
    cors: {
      headers: [
        "Content-Type",
        "Authorization",
        "X-Frame-Options",
        "X-Captcha-Token",
      ],
    },
    parser: {
      enabled: true,
      multipart: true,
      formidable: {
        maxFileSize: 500 * 1024 * 1024, // 500MB
      },
    },
  },
};
