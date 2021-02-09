import { getUploadImageUrl } from "@/lib/util";

const UploadImage = ({ image, format, ...props }) => {
  const imageUrl = getUploadImageUrl(image, { format });
  return <img src={imageUrl} {...props} />;
};

export default UploadImage;
