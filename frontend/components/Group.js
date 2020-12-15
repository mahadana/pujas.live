import { Grid, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: ".5em",
  },
  image: {
    float: "left",
    display: "block",
    objectFit: "cover",
    width: "100px",
    height: "100px",
    marginRight: "1.5em",
  },
  name: {
    margin: 0,
    fontSize: "1.5em",
    fontWeight: 400,
  },
  description: {
    margin: ".5em 0 0",
  },
  join: {
    [theme.breakpoints.up("sm")]: {
      alignSelf: "flex-end",
    },
  },
}));

const Group = (props) => {
  const classes = useStyles();
  const imageUrl = props.image
    ? `${process.env.NEXT_PUBLIC_API_URL}${props.image?.formats?.thumbnail?.url}`
    : "https://placekitten.com/g/100/100";

  return (
    <Grid container spacing={3} className={classes.container}>
      <Grid item sm={8}>
        <img src={imageUrl} className={classes.image} />
        <h3 className={classes.name}>{props.name}</h3>
        <p className={classes.description}>{props.description}</p>
      </Grid>
      <Grid item sm={4} className={classes.join}>
        <p className={classes.description}>
          <a href={"#"}>Apply to join this group</a>
        </p>
      </Grid>
    </Grid>
  );
};

export default Group;
