import { getUploadImageUrl } from "@/lib/util";

const UploadImage = ({ image, size, defaultImageUrl, ...props }) => {
  const imageUrl = getUploadImageUrl(image, { size, defaultImageUrl });
  return <img src={imageUrl} {...props} />;
};

export default UploadImage;
