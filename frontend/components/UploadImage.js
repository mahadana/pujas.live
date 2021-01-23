const UploadImage = ({
  image,
  size = "thumbnail",
  defaultUrl = "/default-group-square.png",
}) => {
  const imageUrl = image
    ? `${process.env.NEXT_PUBLIC_API_URL}${image?.formats?.[size]?.url}`
    : defaultUrl;
  return <img src={imageUrl} />;
};

export default UploadImage;
