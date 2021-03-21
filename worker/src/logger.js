import { resolve } from "path";
import { createLogger, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logDir = resolve(__dirname, "..", "..", "logs", "worker");

export const cleanMessage = (message) =>
  String(message).replace(/key=\S+/g, "[REMOVED]");

const logger = createLogger({
  level: "info",
  transports: [
    new DailyRotateFile({
      format: format.combine(
        format.simple(),
        format.timestamp(),
        format.printf(
          ({ timestamp, [Symbol.for("message")]: message }) =>
            `${timestamp} ${cleanMessage(message)}`
        )
      ),
      dirname: logDir,
      filename: "worker-%DATE%.log",
      datePattern: "YYYY-MM-DD-HH",
      maxFiles: "14d",
      createSymlink: true,
      symlinkName: "latest-worker.log",
    }),
  ],
});

export default logger;
