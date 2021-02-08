import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "inline-block",
    marginLeft: "0.2em",
    "& > img": {
      position: "relative",
      top: "0.08em",
      width: "0.95em",
      height: "0.95em",
    },
  },
}));

const ExternalLinkIcon = () => {
  const classes = useStyles();
  return (
    <span className={classes.root}>
      <img src="/external-link-white.gif" width="256" height="256" />
    </span>
  );
};

export default ExternalLinkIcon;
