import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { darken, emphasize, fade, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import isArray from "lodash/isArray";
import { useState } from "react";

import ButtonBaseLink from "@/components/ButtonBaseLink";
import ButtonLink from "@/components/ButtonLink";
import Link from "@/components/Link";

const useStyles = makeStyles((theme) => {
  const altBackgroundColor = fade(
    emphasize(theme.palette.background.default, 0.5),
    0.1
  );
  const borderRadius = "0.25em";
  const buttonBorderColor = fade(
    darken(theme.palette.background.default, 0.5),
    0.5
  );

  return {
    root: {
      display: "flex",
      flexFlow: "row wrap",
      width: "100%",
      borderRadius,
      "&:not(:last-child)": {
        marginBottom: "1em",
      },
      "& > div > a > div": {
        // The next two are hacks but they work...
        borderTopLeftRadius: borderRadius,
        borderBottomLeftRadius: borderRadius,
      },
      "&:nth-child(odd)": {
        backgroundColor: altBackgroundColor,
      },
      [theme.breakpoints.down("sm")]: {
        fontSize: "0.8rem",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "0.9rem",
      },
    },
    sideTitle: {
      order: 1,
      flex: "1 0 100%",
      margin: "0.5em 0",
      fontSize: "2em",
      textAlign: "center",
      [theme.breakpoints.up("sm")]: {
        display: "none",
      },
    },
    image: ({ ratio }) => ({
      flex: `1 1 0`,
      minWidth: 100,
      "& > a": {
        display: "block",
        width: "100%",
        height: "100%",
      },
      [theme.breakpoints.down("xs")]: {
        order: 2,
        maxWidth: `${36 * ratio}em`,
        minHeight: "36vw",
        marginLeft: "1em",
        "&, & > a, & > a > div": {
          borderRadius,
        },
      },
      [theme.breakpoints.up("sm")]: {
        order: 1,
        maxWidth: `${10 * ratio}em`,
        minHeight: "10em",
      },
    }),
    backgroundImage: {
      width: "100%",
      height: "100%",
      backgroundPosition: "center center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
    },
    main: {
      order: 2,
      flex: "1 1 0",
      margin: "1em",
      [theme.breakpoints.down("xs")]: {
        display: "none",
      },
      [theme.breakpoints.only("sm")]: {
        display: "flex",
        flexFlow: "row-reverse wrap",
      },
    },
    mainActions: {
      order: 4,
      flex: "0 1 auto",
      marginTop: "0.5em",
      textAlign: "right",
      "& > div": {
        flexDirection: "row-reverse",
      },
      [theme.breakpoints.down(800)]: {
        flexBasis: "100%",
      },
      [theme.breakpoints.up("md")]: {
        display: "none",
      },
    },
    mainTitle: {
      order: 2,
      marginBottom: ".25em",
      fontSize: "1.5em",
      lineHeight: "1.25em",
      [theme.breakpoints.only("sm")]: {
        flex: "1 1 0",
        marginRight: "0.5em",
      },
    },
    mainContent: {
      order: 3,
      flex: "1 0 100%",
      color: theme.palette.text.secondary,
      "&, & p": {
        fontSize: "1em",
        lineHeight: "1.5em",
      },
      [theme.breakpoints.down("xs")]: {
        display: "none",
      },
    },
    sideContent: {
      order: 4,
      "&, & p": {
        fontSize: "1em",
        lineHeight: "1.5em",
      },
      margin: "1em",
      [theme.breakpoints.up("sm")]: {
        display: "none",
      },
    },
    sideActions: {
      order: 3,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100%",
      [theme.breakpoints.down("xs")]: {
        flex: "0.4 1 0",
        margin: "0 1em",
        "& a": {
          minWidth: "10em",
        },
      },
      [theme.breakpoints.only("sm")]: {
        display: "none",
      },
      [theme.breakpoints.up("md")]: {
        flex: "0 1 0",
        marginRight: "1em",
        "& a": {
          minWidth: "10em",
        },
      },
    },
    button: {
      borderColor: `${buttonBorderColor} !important`,
      "&, & a, & a > span, & button": {
        fontSize: "1em",
      },
    },
  };
});

const RowCard = ({
  actionLinkProps = [],
  children,
  imageLinkProps = { href: "#" },
  imageUrl,
  menuLabel = "···",
  menuLinkProps = [],
  ratio = 16 / 9,
  title,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles({ ratio });

  const onOpen = (event) => setAnchorEl(event.currentTarget);
  const onClose = () => setAnchorEl(null);
  const menuOnClick = (event, onClick) => {
    if (onClick) onClick(event);
    onClose();
  };

  if (actionLinkProps && !isArray(actionLinkProps)) {
    actionLinkProps = [actionLinkProps];
  }
  if (menuLinkProps && !isArray(menuLinkProps)) {
    menuLinkProps = [menuLinkProps];
  }

  const actions = (orientation) =>
    actionLinkProps?.length > 0 && (
      <ButtonGroup orientation={orientation} variant="contained">
        {actionLinkProps.map(({ label, ...props }, index) => (
          <ButtonLink
            variant="outlined"
            {...props}
            className={classes.button}
            key={index}
          >
            {label}
          </ButtonLink>
        ))}
        {menuLinkProps?.length > 0 && (
          <Button
            className={classes.button}
            aria-haspopup="true"
            onClick={onOpen}
            variant="outlined"
          >
            {menuLabel}
          </Button>
        )}
      </ButtonGroup>
    );

  return (
    <div className={classes.root}>
      <Typography className={classes.sideTitle} variant="h3">
        {title}
      </Typography>
      <div className={classes.image}>
        <ButtonBaseLink {...imageLinkProps}>
          <div
            className={classes.backgroundImage}
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        </ButtonBaseLink>
      </div>
      <div className={classes.main}>
        <div className={classes.mainActions}>{actions("horizontal")}</div>
        <Typography className={classes.mainTitle} variant="h3">
          {title}
        </Typography>
        <div className={classes.mainContent}>{children}</div>
      </div>
      <div className={classes.sideContent}>{children}</div>
      <div className={classes.sideActions}>{actions("vertical")}</div>
      {menuLinkProps?.length > 0 && (
        <Menu
          anchorEl={anchorEl}
          keepMounted
          onClose={onClose}
          open={Boolean(anchorEl)}
        >
          {menuLinkProps.map(({ label, onClick, ...props }, index) => (
            <MenuItem
              {...props}
              component={Link}
              key={index}
              onClick={(event) => menuOnClick(event, onClick)}
            >
              {label}
            </MenuItem>
          ))}
        </Menu>
      )}
    </div>
  );
};

export default RowCard;
