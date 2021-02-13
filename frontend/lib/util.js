import { useRouter } from "next/router";

import ExternalLinkIcon from "@/components/icon/ExternalLinkIcon";
import plausible from "@/lib/plausible";
import {
  getChannelRecordingsPath,
  getRecordingPath,
  getRecordingVideoUrl,
  toDigitalOceansCdnUrl,
} from "shared/path";
import { dayjs } from "shared/time";

export const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
export const siteName = process.env.NEXT_PUBLIC_SITE_NAME;

if (!apiUrl) {
  throw new Error(`NEXT_PUBLIC_BACKEND_URL is not defined`);
} else if (!siteName) {
  throw new Error(`NEXT_PUBLIC_SITE_NAME is not defined`);
}

export const s3Domain = (() => {
  const bucket = process.env.NEXT_PUBLIC_S3_BUCKET;
  const endpoint = process.env.NEXT_PUBLIC_S3_ENDPOINT;
  return bucket && endpoint ? `${bucket}.${endpoint}` : null;
})();
export const cdnDomain = s3Domain ? toDigitalOceansCdnUrl(s3Domain) : null;
export const defaultImageUrl = "/default-group-square.png";

export const useRouteBack = (router) => {
  if (!router) {
    router = useRouter();
  }
  return {
    get: (path) =>
      path +
      (router.asPath ? "?back=" + encodeURIComponent(router.asPath) : ""),
    push: (path = "/") => router.push(router.query?.back || path),
  };
};

export const externalize = (component, external = true) =>
  external ? (
    <>
      {component} <ExternalLinkIcon />
    </>
  ) : (
    component
  );

export const getChannelRecordingsLinkProps = (router, channel) => ({
  as: getChannelRecordingsPath(channel),
  href: {
    pathname: router.pathname,
    query: {
      ...router.query,
      channelRecordingsModalBackPath: router.asPath,
      channelRecordingsModalChannelId: channel.id,
    },
  },
  scroll: false,
  shallow: true,
});

export const getRecordingLinkProps = (router, recording) => {
  const videoUrl = getRecordingVideoUrl(recording);
  if (recording.embed) {
    return {
      as: getRecordingPath(recording),
      href: {
        pathname: router.pathname,
        query: {
          ...router.query,
          videoModalBackPath: router.asPath,
          videoModalLive: recording.live ? "1" : "0",
          videoModalSkip: recording.skip,
          videoModalTitle: recording.title,
          videoModalUrl: videoUrl,
        },
      },
      scroll: false,
      shallow: true,
    };
  } else {
    return {
      href: videoUrl,
      rel: "noopener noreferrer",
      target: "_blank",
      onClick: () => plausible("externalVideo", { props: { url: videoUrl } }),
    };
  }
};

const imageFormats = ["large", "medium", "small", "thumbnail"];
const imageFormatToYoutubeSizing = {
  thumbnail: "default",
  small: "high",
  medium: "standard",
  large: "maxres",
};

const getMaxResImageUpTo = (format, sizes, mapping = null) => {
  let imageUrl;
  const index = imageFormats.indexOf(format);
  if (index >= 0) {
    const formats = imageFormats.slice(index);
    for (let format of formats) {
      if (sizes) {
        if (mapping) format = mapping[format];
        imageUrl = sizes[format]?.url;
      }
      if (imageUrl) break;
    }
  }
  return imageUrl;
};

export const getUploadImageUrl = (
  image,
  { format = "small", defaultUrl = defaultImageUrl } = {}
) => {
  const imageUrl = getMaxResImageUpTo(format, image?.formats);
  if (imageUrl) {
    if (imageUrl.startsWith("/")) {
      return `${apiUrl}${imageUrl}`;
    } else {
      return toDigitalOceansCdnUrl(imageUrl);
    }
  } else {
    return defaultUrl;
  }
};

export const getRecordingImageUrl = (recording, { format = "small" } = {}) => {
  let imageUrl;

  //first, try getting the uploaded image in strapi. This would be the highest priority
  imageUrl = getUploadImageUrl(recording.image, { defaultUrl: null });
  if (imageUrl) return imageUrl;

  //then, if that fails, get from youtube data
  const image = recording.extra?.image;
  if (image) {
    switch (image.provider) {
      case "youtube":
        imageUrl = getMaxResImageUpTo(
          format,
          image?.thumbnails,
          imageFormatToYoutubeSizing
        );
        break;
      default:
        break;
    }
  }
  return imageUrl || defaultImageUrl;
};

export const getStrapiError = (error) => {
  return error?.graphQLErrors?.[0]?.extensions?.exception?.data?.data?.[0]
    ?.messages?.[0];
};

const IS_ACTIVE_RECORDING_WINDOW = 5; // minutes

export const isActiveRecording = (recording, now) => {
  if (!recording || !recording.live || !recording.startAt) {
    return false;
  }
  now = dayjs(now).utc();
  const startAt = dayjs(recording.startAt).utc();
  const startWindow = startAt.subtract(IS_ACTIVE_RECORDING_WINDOW, "minutes");
  if (now.isBefore(startWindow)) {
    return false;
  } else if (!recording.endAt) {
    return true;
  }
  const endAt = dayjs(recording.endAt).utc();
  const endWindow = endAt.add(IS_ACTIVE_RECORDING_WINDOW, "minutes");
  return !now.isAfter(endWindow);
};

export const translateStrapiError = (error) => {
  const strapiError = getStrapiError(error);
  if (strapiError?.id === "Auth.form.error.invalid") {
    return "Incorrect email or password";
  } else if (error?.message === "Forbidden") {
    return "You are not logged in";
  } else if (strapiError?.message) {
    return strapiError.message;
  } else if (error?.message) {
    return error.message;
  } else {
    return "Unknown server error";
  }
};

export const sleep = (time) =>
  new Promise((resolve) => setTimeout(resolve, time));
