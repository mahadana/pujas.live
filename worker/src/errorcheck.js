import { exec } from "child_process";
import { promisify } from "util";
import nodemailer from "nodemailer";

import logger from "@/logger";

const siteName = process.env.SITE_NAME;
const frontendUrl = process.env.FRONTEND_URL;
const to = process.env.ADMIN_EMAIL;
const from = {
  address: process.env.MAIL_FROM_ADDRESS,
  name: process.env.MAIL_FROM_NAME,
};

const transporter = nodemailer.createTransport({
  host: "mail",
  port: 25,
  secure: false,
});

const run = async (cmd) => {
  const { stdout, stderr } = await promisify(exec)(cmd);
  return ("" + (stdout ? stdout : stderr ? stderr : "")).trim();
};

export const processErrorCheck = async () => {
  const result = await run("cd /app && grep -lr error: logs/worker || true");
  const files = result.split("\n").filter((l) => l.trim());
  if (files.length) {
    const urls = files.map((file) => `${frontendUrl}/${file}`);
    const text = `Detected one or more errors in the worker logs:

${urls.join("\n")}
`;
    const html = `<p>Detected one or more errors in the worker logs:</p>
<ul>${urls
      .map((u) => `<li><a href="${u}">${u}</a></li>`)
      .join("</li>\n")}</ul>`;

    await transporter.sendMail({
      from,
      to,
      subject: `[${siteName}] Worker errors detected`,
      text,
      html,
    });
    logger.warn("Worker errors detected");
  } else {
    logger.info("No worker errors detected");
  }
};

if (require.main === module) {
  processErrorCheck().catch(console.error);
}
