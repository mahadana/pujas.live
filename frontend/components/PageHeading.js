import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.secondary,
    // marginTop: "0.5em",
    // borderTop: "1px solid black",
    // paddingTop: "0.5em",
    textAlign: "center",
    [theme.breakpoints.up("sm")]: {
      textAlign: "left",
    },
  },
}));

const PageHeading = ({ children }) => {
  const classes = useStyles();
  return (
    <Typography className={classes.root} variant="h2">
      {children}
    </Typography>
  );
};

export default PageHeading;
