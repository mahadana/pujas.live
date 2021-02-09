import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ReactPlayer from "react-player";

import ExternalLinkIcon from "@/components/icon/ExternalLinkIcon";
import Link from "@/components/Link";
import PageHeading from "@/components/PageHeading";
import PageLayout from "@/components/PageLayout";
import SiteMessageContent from "@/components/SiteMessageContent";
import Title from "@/components/Title";
import { withApollo } from "@/lib/apollo";
import { siteName } from "@/lib/util";

const useStyles = makeStyles((theme) => ({
  player: {
    position: "relative",
    overflow: "hidden",
    width: "calc(100% - 4.4em)",
    paddingTop: "56.25%", // 16:9 Aspect Ratio
    margin: "2em 2.2em",
    backgroundColor: "black",
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
    <PageLayout>
      <Title title="About" />
      <Container maxWidth="md">
        <>
          <PageHeading>How to Use</PageHeading>
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
          <PageHeading>About {siteName}</PageHeading>
          <Typography className={classes.description} variant="body1">
            {siteName} was created as a way to gather the various livestream
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
          <PageHeading>Contact Us</PageHeading>
          <Typography className={classes.description} variant="body1">
            We can always use help making this site better. Any help you can
            offer with development, design, or with managing the streams and
            recordings would be most welcome. Please see{" "}
            <Link href="https://docs.google.com/document/d/1sWfOdk1nNixKOEbRTge5fVYkTxTmGbnRwk4TR9KcWhk/edit#">
              here
            </Link>
            <ExternalLinkIcon /> for our active list of potential roles.
          </Typography>
          <Typography className={classes.description} variant="body1">
            We welcome any feedback or questions you have as well. Please fill
            out the form below to contact us:
          </Typography>
          <Box className={classes.form}>
            <SiteMessageContent />
          </Box>
        </>
      </Container>
    </PageLayout>
  );
};

export default withApollo()(About);
