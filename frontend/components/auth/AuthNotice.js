import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import HomeIcon from "@material-ui/icons/Home";

import ButtonLink from "@/components/ButtonLink";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "2rem",
    padding: "3em",
  },
  link: {
    marginTop: "3em",
    textAlign: "center",
  },
}));

const AuthNotice = ({ children }) => {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      {children}
      <Box className={classes.link}>
        <ButtonLink
          href="/"
          size="large"
          variant="contained"
          color="primary"
          startIcon={<HomeIcon />}
        >
          Go Home
        </ButtonLink>
      </Box>
    </Paper>
  );
};

export default AuthNotice;
