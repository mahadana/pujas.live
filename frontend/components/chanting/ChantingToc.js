import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";

const useStyles = makeStyles((theme) => ({
  root: {
    justifyContent: "center",
    width: "100%",
    height: "100%",
    overflowY: "auto",
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

const ChantingTocVolume = ({ children, tocVolume, ...props }) => {
  const classes = useStyles();
  return (
    <List
      component="nav"
      subheader={
        <ListSubheader className={classes.subheader} component="div">
          {tocVolume.title}
        </ListSubheader>
      }
      {...props}
    >
      {children}
    </List>
  );
};

const ChantingTocPart = ({ children, onOpen, tocPart, ...props }) => {
  const classes = useStyles();
  const onItemClick = () =>
    onOpen({
      chantSet: tocPart.chantSet,
      link: tocPart.link,
      title: tocPart.title,
    });

  return (
    <div {...props}>
      <ListItem button className={classes.part} onClick={onItemClick}>
        <ChantingTocListItemText page={tocPart.page} title={tocPart.title} />
      </ListItem>
      <List component="nav" dense disablePadding>
        {children}
      </List>
    </div>
  );
};

const ChantingTocChant = ({ onOpen, tocChant, tocPart, ...props }) => {
  const classes = useStyles();
  const onClick = () =>
    onOpen({
      chantSet: tocChant.chantSet || tocPart.chantSet,
      link: tocChant.link,
      title: tocPart.title,
    });
  return (
    <ListItem button className={classes.chant} onClick={onClick} {...props}>
      <ChantingTocListItemText title={tocChant.title} page={tocChant.page} />
    </ListItem>
  );
};

const ChantingToc = ({ onOpen, toc }) => {
  const classes = useStyles();
  return (
    <Grid container className={classes.root}>
      {toc.map((tocVolume, index) => (
        <Grid item key={index} xs={12} sm={6}>
          <ChantingTocVolume key={index} tocVolume={tocVolume}>
            {tocVolume.parts.map((tocPart, index) => (
              <ChantingTocPart key={index} onOpen={onOpen} tocPart={tocPart}>
                {tocPart.chants.map((tocChant, index) => (
                  <ChantingTocChant
                    key={index}
                    onOpen={onOpen}
                    tocChant={tocChant}
                    tocPart={tocPart}
                  />
                ))}
              </ChantingTocPart>
            ))}
          </ChantingTocVolume>
        </Grid>
      ))}
    </Grid>
  );
};

export default ChantingToc;
