import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

import ChantingBookButton from "@/components/ChantingBookButton";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: "1em",
    fontSize: "1.2em",
    [theme.breakpoints.up("sm")]: {
      height: "2.5em",
      marginBottom: 0,
      fontSize: "1.25em",
    },
    [theme.breakpoints.up("md")]: {
      height: "3em",
      fontSize: "1.5em",
    },
  },
  bookContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "-2em",
    [theme.breakpoints.up("sm")]: {
      justifyContent: "flex-end",
      marginTop: "-3em",
    },
  },
  book: {
    [theme.breakpoints.up("sm")]: {
      "&:last-child": {
        marginLeft: ".5em",
        marginRight: "-.5em",
      },
    },
  },
}));

const ChantingBooksBar = () => {
  const classes = useStyles();
  return (
    <Container className={classes.root} maxWidth="lg">
      <Box className={classes.bookContainer}>
        <ChantingBookButton
          book="1"
          className={classes.book}
          direction="left"
        />
        <ChantingBookButton
          book="2"
          className={classes.book}
          direction="left"
        />
      </Box>
    </Container>
  );
};

export default ChantingBooksBar;
