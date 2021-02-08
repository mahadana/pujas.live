import { useRouter } from "next/router";

import ExternalLinkIcon from "@/components/icon/ExternalLinkIcon";
import plausible from "@/lib/plausible";
import {
  getChannelRecordingsPath,
  getRecordingPath,
  getRecordingVideoUrl,
} from "shared/path";
import { dayjs } from "shared/time";

export const apiUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";

export const defaultImageUrl = "/default-group-square.png";

export const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Pujas.live";

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

export const getRecordingLinkProps = (
  router,
  recording,
  { skip, title } = {}
) => {
  const options = { autoplay: true, skip };
  const videoUrl = getRecordingVideoUrl(recording, options);
  if (recording.embed) {
    return {
      as: getRecordingPath(recording, options),
      href: {
        pathname: router.pathname,
        query: {
          ...router.query,
          videoModalBackPath: router.asPath,
          videoModalLive: recording.live ? "1" : "0",
          videoModalSkip: skip,
          videoModalTitle: title || recording.title,
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

export const getUploadImageUrl = (image, { size = "thumbnail" } = {}) => {
  const imageUrl = image?.formats?.[size]?.url;
  return imageUrl ? `${apiUrl}${imageUrl}` : defaultImageUrl;
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
