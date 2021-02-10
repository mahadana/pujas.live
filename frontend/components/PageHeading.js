import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.secondary,
    textAlign: "center",
    [theme.breakpoints.up("sm")]: {
      textAlign: "left",
      marginBottom: "1rem",
    },
  },
}));

const PageHeading = ({ children, className, ...props }) => {
  const classes = useStyles();
  return (
    <Typography
      className={clsx(classes.root, className)}
      variant="h2"
      {...props}
    >
      {children}
    </Typography>
  );
};

export default PageHeading;
