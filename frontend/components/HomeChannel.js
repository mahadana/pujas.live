import { emphasize, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { useRouter } from "next/router";

import ExternalLinkIcon from "@/components/ExternalLinkIcon";
import PreviewRecording from "@/components/PreviewRecording";
import RowCard from "@/components/RowCard";
import Upcoming from "@/components/Upcoming";
import {
  getChannelRecordingsLinkProps,
  getRecordingLinkProps,
  getUploadImageUrl,
  isActiveRecording,
} from "@/lib/util";

const useStyles = makeStyles((theme) => ({
  meta: {
    display: "box",
    boxOrient: "vertical",
    overflow: "hidden",
    lineClamp: 1,
    fontWeight: "500",
    color: emphasize(theme.palette.primary.main, 0.5),
  },
  description: {
    display: "box",
    boxOrient: "vertical",
    overflow: "hidden",
    lineClamp: 3,
  },
}));

const HomeChannel = ({ channel }) => {
  const router = useRouter();
  const classes = useStyles();

  const recording = channel.activeStream;
  const imageUrl = getUploadImageUrl(channel.image);
  const actionLinkProps = [];

  if (recording) {
    actionLinkProps.push({
      ...getRecordingLinkProps(router, recording),
      color: isActiveRecording(recording) ? "primary" : undefined,
      endIcon: recording.embed ? undefined : <ExternalLinkIcon />,
      label: "Livestream",
    });
  } else if (channel.channelUrl) {
    actionLinkProps.push({
      href: channel.channelUrl,
      target: "_blank",
      rel: "noreferrer",
      label: "Channel",
    });
  }
  actionLinkProps.push({
    ...getChannelRecordingsLinkProps(router, channel),
    label: "Recordings",
  });

  const imageLinkProps = Object.assign({}, actionLinkProps[0]);
  delete imageLinkProps.endIcon;

  const menuLinkProps = [];
  if (channel.monastery && channel.monastery.websiteUrl) {
    menuLinkProps.push({
      href: channel.monastery.websiteUrl,
      target: "_blank",
      rel: "noopener",
      label: `${channel.monastery.title} Website`,
    });
  }
  if (channel.channelUrl) {
    menuLinkProps.push({
      href: channel.channelUrl,
      target: "_blank",
      rel: "noreferrer",
      label: `${channel.monastery?.title || "Livestream"} Channel`,
    });
  }

  return (
    <RowCard
      actionLinkProps={actionLinkProps}
      imageLinkProps={imageLinkProps}
      imageUrl={imageUrl}
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
