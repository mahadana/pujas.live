import { getUploadImageUrl } from "@/lib/util";

const UploadImage = ({ format, image, ...props }) => {
  const imageUrl = getUploadImageUrl(image, { format });
  return <img src={imageUrl} {...props} />;
};

export default UploadImage;
