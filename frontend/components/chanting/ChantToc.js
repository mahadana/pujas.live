import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import { makeStyles } from "@material-ui/core/styles";
import { memo } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    justifyContent: "center",
    width: "100%",
    height: "100%",
    overflowY: "auto",
    scrollbarWidth: "none",
    "-ms-overflow-style": "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  closeButton: {
    position: "absolute",
    top: "-0.4rem",
    right: "-0.35rem",
    zIndex: 100,
  },
  chant: {
    paddingLeft: "1rem",
  },
  part: {
    paddingLeft: "1rem",
    "& > div > span": {
      fontWeight: "bold",
    },
  },
  icon: {
    color: theme.palette.text.hint,
    minWidth: "2.25rem",
    "& svg": {
      fontSize: "2rem",
    },
  },
  text: {
    display: "flex",
    justifyContent: "space-between",
  },
  title: {
    paddingLeft: "1rem",
    textIndent: "-1rem",
  },
  page: {
    marginLeft: "0.5rem",
    fontSize: "0.875rem",
    color: theme.palette.text.hint,
  },
  subheader: {
    backgroundColor: theme.palette.background.default,
    borderTopLeftRadius: "0.25rem",
    borderTopRightRadius: "0.25rem",
  },
}));

const ChantingTocListItemText = ({ page, title }) => {
  const classes = useStyles();
  return (
    <ListItemText
      primary={
        <div className={classes.text}>
          <div className={classes.title}>{title}</div>
          <div className={classes.page}>{page}</div>
        </div>
      }
    />
  );
};

const ChantingTocVolume = ({ children, title, ...props }) => {
  const classes = useStyles();
  return (
    <List
      component="nav"
      subheader={
        <ListSubheader className={classes.subheader} component="div">
          {title}
        </ListSubheader>
      }
      {...props}
    >
      {children}
    </List>
  );
};

const ChantingTocPart = ({ children, onOpen, page, title, ...props }) => {
  const classes = useStyles();
  return (
    <div {...props}>
      <ListItem button className={classes.part} onClick={onOpen}>
        <ChantingTocListItemText page={page} title={title} />
      </ListItem>
      <List component="nav" dense disablePadding>
        {children}
      </List>
    </div>
  );
};

const ChantingTocChant = ({ onOpen, page, title, ...props }) => {
  const classes = useStyles();
  return (
    <ListItem button className={classes.chant} onClick={onOpen} {...props}>
      <ChantingTocListItemText title={title} page={page} />
    </ListItem>
  );
};

const ChantToc = memo(
  ({ dispatch, state }) => {
    const classes = useStyles();

    const open = (props) => dispatch({ ...props, type: "OPEN_CHANT_FROM_TOC" });

    return (
      <Grid container className={classes.root}>
        {state.toc?.map?.(({ parts, title }, volumeIndex) => (
          <Grid item key={volumeIndex} xs={12} sm={6}>
            <ChantingTocVolume title={title}>
              {parts?.map?.(({ chants, page, title }, partIndex) => (
                <ChantingTocPart
                  key={partIndex}
                  onOpen={() => open({ partIndex, volumeIndex })}
                  page={page}
                  title={title}
                >
                  {chants?.map?.(({ page, title }, chantIndex) => (
                    <ChantingTocChant
                      key={chantIndex}
                      onOpen={() =>
                        open({ chantIndex, partIndex, volumeIndex })
                      }
                      page={page}
                      title={title}
                    />
                  ))}
                </ChantingTocPart>
              ))}
            </ChantingTocVolume>
          </Grid>
        ))}
      </Grid>
    );
  },
  (prev, next) =>
    prev.dispatch === next.dispatch && prev.state.toc === next.state.toc
);

ChantToc.displayName = "ChantToc";

export default ChantToc;
