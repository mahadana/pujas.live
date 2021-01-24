import dotenv from "dotenv";
import { promises as fs } from "fs";
import path from "path";

import YouTube from "../youtube";

dotenv.config();

const fixtureDir = path.join(__dirname, "fixtures");

const cleanHtml = (html) => {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "")
    .replace(/>/g, ">\n");
};

// Mock download functionality with a fixture cache to speed up tests
// and to aid debugging.
export const getTextFromFixtureOrUrl = async (url) => {
  const fixturePath = path.join(fixtureDir, encodeURIComponent(url));
  try {
    return (await fs.readFile(fixturePath)).toString();
  } catch {
    // Pass
  }
  console.log(`Downloading ${url} to fixture ${fixturePath}`);
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!process.env.YOUTUBE_API_KEY) {
    throw new Error("YOUTUBE_API_KEY not defined in worker/.env");
  }
  const apiUrl = url.replace("__MOCK_API_KEY__", apiKey);
  let text = await new YouTube()._getTextFromUrl(apiUrl);
  if (text.slice(0, 10).includes("DOCTYPE")) {
    text = cleanHtml(text);
  }
  await fs.mkdir(fixtureDir, { recursive: true });
  await fs.writeFile(fixturePath, text);
  return text;
};
