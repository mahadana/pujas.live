import { getRecordingImageUrl } from "@/lib/util";

const RecordingImage = ({ format, recording, ...props }) => {
  const imageUrl = getRecordingImageUrl(recording, { format });
  return <img src={imageUrl} {...props} />;
};

export default RecordingImage;
