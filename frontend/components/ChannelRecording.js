import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { useRouter } from "next/router";

import RowCard from "@/components/RowCard";
import {
  externalize,
  getRecordingImageUrl,
  getRecordingLinkProps,
} from "@/lib/util";

const useStyles = makeStyles((theme) => ({
  description: {
    display: "box",
    boxOrient: "vertical",
    overflow: "hidden",
    lineClamp: 3,
  },
}));

const ChannelRecording = ({ recording }) => {
  const router = useRouter();
  const classes = useStyles();

  const imageUrl = getRecordingImageUrl(recording);
  const actionLinkProps = {
    ...getRecordingLinkProps(router, recording),
    label: externalize("Watch", !recording.embed),
  };

  return (
    <RowCard
      actionLinkProps={actionLinkProps}
      imageLinkProps={actionLinkProps}
      imageUrl={imageUrl}
      ratio={16 / 9}
      title={recording.title}
    >
      <Typography className={classes.description} variant="body1">
        {recording.description}
      </Typography>
    </RowCard>
  );
};

export default ChannelRecording;
