import MuiButton from "@material-ui/core/Button";
import { emphasize, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { forwardRef } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: emphasize(theme.palette.background.default, 0.15),
    "&:hover": {
      backgroundColor: emphasize(theme.palette.background.default, 0.3),
    },
    color: theme.palette.getContrastText(theme.palette.background.default),
  },
}));

const Button = forwardRef(({ className, ...props }, ref) => {
  const classes = useStyles(props);
  if (props.variant === "contained") {
    className = clsx(classes.root, className);
  }
  return <MuiButton {...props} className={className} ref={ref} />;
});

Button.displayName = "Button";

export default Button;
