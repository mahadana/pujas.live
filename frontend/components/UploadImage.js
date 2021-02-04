import { backendUrl } from "@/lib/apollo";

const UploadImage = ({
  image,
  size = "thumbnail",
  defaultUrl = "/default-group-square.png",
}) => {
  const imageUrl = image
    ? `${backendUrl}${image?.formats?.[size]?.url}`
    : defaultUrl;
  return <img src={imageUrl} />;
};

export default UploadImage;
