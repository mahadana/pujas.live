const globalStyles = {
  lead: {
    margin: 0,
    fontSize: "2.5em",
    fontWeight: 400,
  },
};

export const globalStyle = (styleName) => {
  return globalStyles[styleName];
};
