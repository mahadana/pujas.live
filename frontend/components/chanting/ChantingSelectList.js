import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    overflowY: "scroll",
  },
}));

const ChantingSelectList = ({ chantings, onSelect }) => {
  const classes = useStyles();
  const makeOnClick = (chanting) => (event) => {
    event.preventDefault();
    onSelect(chanting);
  };
  return (
    <div className={classes.root}>
      <List dense>
        {chantings.map((chanting, index) => (
          <ListItem key={index} button onClick={makeOnClick(chanting)}>
            <ListItemText primary={chanting.title} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ChantingSelectList;
