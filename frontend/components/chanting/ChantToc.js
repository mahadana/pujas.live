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

const modifyToc = (toc, fullToc) =>
  toc.map((volume) => {
    volume = { ...volume };
    volume.parts = volume.parts.map((part) => {
      part = { ...part };
      if (!fullToc) {
        if (volume.volume == 1 && (part.part == 1 || part.part == 2)) {
          part.chantSet = part.chantSet.slice(0, -1);
          part.chants = part.chants.slice(-1);
        } else if (volume.volume == 2 && part.part == 3) {
          part.chants = [];
        } else if (volume.volume == 1 && part.part == 4) {
          part.chants = part.chants.slice(1); // Remove Añjali
        }
      }
      part.chants = part.chants.map((chant) => {
        chant = { ...chant };
        if (fullToc) {
          chant.chantSet = [chant.link];
        } else {
          if (!chant.chantSet && !(volume.volume == 2 && part.part == 2)) {
            chant.chantSet = [chant.link];
          }
        }
        return chant;
      });
      return part;
    });
    return volume;
  });

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

const ChantToc = memo(({ fullToc, onOpen: parentOnOpen, toc }) => {
  const classes = useStyles();

  toc = modifyToc(toc, fullToc);

  const onOpen = (props) => {
    const tocPart = toc[props.volumeIndex]?.parts?.[props.partIndex];
    const tocChant = tocPart?.chants?.[props.chantIndex];
    if (tocChant && tocPart) {
      parentOnOpen({
        ...props,
        chantIds: tocChant.chantSet || tocPart.chantSet,
        link: tocChant.link,
        title: tocPart.title,
      });
    } else if (tocPart) {
      parentOnOpen({
        ...props,
        chantIds: tocPart.chantSet,
        link: tocPart.link,
        title: tocPart.title,
      });
    }
  };

  return (
    <Grid container className={classes.root}>
      {toc?.map?.(({ parts, title }, volumeIndex) => (
        <Grid item key={volumeIndex} xs={12} sm={6}>
          <ChantingTocVolume title={title}>
            {parts?.map?.(({ chants, page, title }, partIndex) => (
              <ChantingTocPart
                key={partIndex}
                onOpen={() => onOpen({ partIndex, volumeIndex })}
                page={page}
                title={title}
              >
                {chants?.map?.(({ page, title }, chantIndex) => (
                  <ChantingTocChant
                    key={chantIndex}
                    onOpen={() =>
                      onOpen({ chantIndex, partIndex, volumeIndex })
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
});

ChantToc.displayName = "ChantToc";

export default ChantToc;
