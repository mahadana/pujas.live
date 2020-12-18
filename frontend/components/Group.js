import { Box, Button, Grid, makeStyles } from "@material-ui/core";
import Link from "next/link";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    padding: "1.5em",
    "&:nth-child(odd)": {
      backgroundColor: "#eee",
    },
  },
  image: {
    flex: "0 0 12em",
    "& > img": {
      display: "block",
      objectFit: "cover",
      width: "10em",
      height: "10em",
    },
  },
  text: {
    flex: "1 1 20em",
    marginRight: "2em",
    "& > h3": {
      margin: 0,
      fontSize: "1.5em",
      fontWeight: 400,
    },
    "& > p": {
      fontSize: "1.1em",
      marginBottom: 0,
    },
  },
  links: {
    display: "flex",
    alignItems: "center",
  },
}));

const Group = (props) => {
  const classes = useStyles();
  const imageUrl = props.image
    ? `${process.env.NEXT_PUBLIC_API_URL}${props.image?.formats?.thumbnail?.url}`
    : "https://placekitten.com/g/100/100";

  return (
    <Box className={classes.root}>
      <Box className={classes.image}>
        <img src={imageUrl} />
      </Box>
      <Box className={classes.text}>
        <h3>{props.name}</h3>
        <p>{props.description}</p>
      </Box>
      <Box className={classes.links}>
        <Link href={`/groups/${props.id}`}>
          <Button variant="contained">Message group</Button>
        </Link>
      </Box>
    </Box>
  );
};

export default Group;
