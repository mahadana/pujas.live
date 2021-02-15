import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useRouter } from "next/router";

import PreviewRecording from "@/components/PreviewRecording";
import RowCard from "@/components/RowCard";
import Upcoming from "@/components/Upcoming";
import {
  externalize,
  getChannelRecordingsLinkProps,
  getRecordingLinkProps,
  getUploadImageUrl,
  isActiveRecording,
} from "@/lib/util";
import { getChannelRecordingsPath } from "shared/path";

const useStyles = makeStyles((theme) => ({
  meta: {
    ...theme.lineClamp(1),
    fontWeight: "500",
  },
  description: theme.lineClamp(3),
}));

const HomeChannel = ({ channel }) => {
  const matches = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const router = useRouter();
  const classes = useStyles();

  const recording = channel.activeStream;
  const active = isActiveRecording(recording);
  const imageUrl = getUploadImageUrl(channel.image);
  const actionLinkProps = [];

  if (recording) {
    actionLinkProps.push({
      ...getRecordingLinkProps(router, recording),
      color: active ? "primary" : undefined,
      label: externalize(active ? "Livestream" : "Preview", !recording.embed),
      variant: active ? "contained" : "outlined",
    });
  }

  actionLinkProps.push({
    ...(matches
      ? {
          href: getChannelRecordingsPath(channel),
        }
      : getChannelRecordingsLinkProps(router, channel)),
    label: "Recordings",
    variant: "outlined",
  });

  const imageLinkProps = Object.assign({}, actionLinkProps[0]);
  delete imageLinkProps.endIcon;

  const menuLinkProps = [];
  if (channel.monastery && channel.monastery.websiteUrl) {
    menuLinkProps.push({
      href: channel.monastery.websiteUrl,
      target: "_blank",
      rel: "noopener",
      label: externalize(`${channel.monastery.title} Website`),
    });
  }
  if (channel.channelUrl) {
    menuLinkProps.push({
      href: channel.channelUrl,
      target: "_blank",
      rel: "noreferrer",
      label: externalize(`${channel.monastery?.title || "Livestream"} Channel`),
    });
  }

  return (
    <RowCard
      actionLinkProps={actionLinkProps}
      imageLinkProps={imageLinkProps}
      imageUrl={imageUrl}
      menuLabel="Links"
      menuLinkProps={menuLinkProps}
      ratio={16 / 9}
      title={channel.title}
    >
      {recording?.startAt && (
        <Typography className={classes.meta} gutterBottom variant="body1">
          <Upcoming time={recording.startAt} duration={recording.duration} /> ·{" "}
          <PreviewRecording recording={recording} />
        </Typography>
      )}
      <Typography className={classes.description} variant="body1">
        {channel.description}
      </Typography>
    </RowCard>
  );
};

export default HomeChannel;
