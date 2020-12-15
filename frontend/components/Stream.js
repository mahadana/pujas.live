import { Grid, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: ".5em",
  },
  image: {
    float: "left",
    display: "block",
    objectFit: "cover",
    width: "150px",
    height: "150px",
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
  links: {
    padding: 0,
  },
  link: {
    listStyleType: "none",
  },
}));

const Stream = (props) => {
  const classes = useStyles();
  const imageUrl = props.image
    ? `${process.env.NEXT_PUBLIC_API_URL}${props.image?.formats?.thumbnail?.url}`
    : "https://placekitten.com/g/150/150";

  return (
    <Grid container spacing={3} className={classes.container}>
      <Grid item sm={8}>
        <img src={imageUrl} className={classes.image} />
        <h3 className={classes.name}>{props.name}</h3>
        <p className={classes.description}>{props.description}</p>
        <p>
          <strong>Next stream: TODO</strong>
        </p>
      </Grid>
      <Grid item sm={4}>
        <ul className={classes.links}>
          <li className={classes.link}>
            <a href={props.monastery?.url}>{props.monastery?.name} Website</a>
          </li>
          <li className={classes.link}>
            <a href={props.streamUrl}>Livestream</a>
          </li>
          <li className={classes.link}>
            <a href="#">Previous chanting sessions</a>
          </li>
        </ul>
      </Grid>
    </Grid>
  );
};

export default Stream;
