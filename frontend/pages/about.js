import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ReactPlayer from "react-player";

import Banner from "@/components/Banner";
import SiteMessageControl from "@/components/SiteMessageControl";
import { withApollo } from "@/lib/apollo";

const useStyles = makeStyles((theme) => ({
  player: {
    position: "relative",
    overflow: "hidden",
    width: "calc(100% - 4.4em)",
    paddingTop: "56.25%", // 16:9 Aspect Ratio
    margin: "2em 2.2em",
    "& > div": {
      position: "absolute",
      top: 0,
    },
  },
  description: {
    margin: "1em 2em",
  },
  form: {
    margin: "2em 2.3em",
  },
}));

const About = () => {
  const classes = useStyles();

  return (
    <>
      <Banner />
      <Container maxWidth="md">
        <>
          <Typography variant="h2">How to Use</Typography>
          <Box className={classes.player}>
            <ReactPlayer
              controls={true}
              height="100%"
              width="100%"
              url="https://youtu.be/jSegDnC7-ww"
            />
          </Box>
        </>

        <>
          <Typography variant="h2">About Pujas.live</Typography>
          <Typography className={classes.description} variant="body1">
            Pujas.live was created as a way to gather the various livestream
            activities of Thai Forest monasteries that popped up during the
            COVID-19 pandemic. The intention is to support a more communal
            experience of participating in livestreams (remotely), and to
            collect livestreams one place so you can find live Dhamma on youtube
            without getting distracted by cat videos.
          </Typography>
          <Typography className={classes.description} variant="body1">
            We created this website because we thought it would be useful in our
            own practice, and we hope it is useful for you as well.
          </Typography>
          <Typography className={classes.description} variant="body1">
            &nbsp;&nbsp;&nbsp;&nbsp;-- Jeff Zira and Venerable Jagaro,
            co-creators
          </Typography>
        </>

        <>
          <Typography variant="h2">Contact Us</Typography>
          <Typography className={classes.description} variant="body1">
            We can always use help making this site better. Any help you can
            offer with development, design, or with managing the streams and
            recordings would be most welcome. Please see{" "}
            <a href="https://docs.google.com/document/d/1sWfOdk1nNixKOEbRTge5fVYkTxTmGbnRwk4TR9KcWhk/edit#">
              here
            </a>{" "}
            for our active list of potential roles.
          </Typography>
          <Typography className={classes.description} variant="body1">
            We welcome any feedback or questions you have as well. Please fill
            out the form below to contact us:
          </Typography>
          <Box className={classes.form}>
            <SiteMessageControl />
          </Box>
        </>
      </Container>
    </>
  );
};

export default withApollo()(About);