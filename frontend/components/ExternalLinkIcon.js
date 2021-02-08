import { makeStyles } from "@material-ui/core/styles";
import Image from "next/image";

const useStyles = makeStyles((theme) => ({
  externalLink: {
    paddingLeft: ".5em",
    "& > div": {
      verticalAlign: "text-bottom",
    },
  },
}));

const ExternalLinkIcon = () => {
  const classes = useStyles();
  return (
    <span className={classes.root}>
      <Image src="/external-link.svg" width="14" height="14" />
    </span>
  );
};

export default ExternalLinkIcon;
