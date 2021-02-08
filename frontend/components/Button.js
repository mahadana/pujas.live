import MuiButton from "@material-ui/core/Button";
import { emphasize, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { forwardRef } from "react";

const useStyles = makeStyles((theme) => ({
  root: ({ color = "inherit" }) => {
    if (color === "inherit" || color === "default") {
      const backgroundColor = theme.palette.background.default;
      return {
        backgroundColor: emphasize(backgroundColor, 0.15),
        "&:hover": {
          backgroundColor: emphasize(backgroundColor, 0.25),
        },
        color: theme.palette.getContrastText(backgroundColor),
      };
    }
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
