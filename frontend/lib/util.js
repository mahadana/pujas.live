export const getChannelIdFromChannelUrl = (url) => {
  const urlObject = new URL(url);
  return urlObject.pathname.split("/").pop()  //searchParams.get("")
}