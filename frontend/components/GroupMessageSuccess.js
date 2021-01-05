import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import HomeIcon from "@material-ui/icons/Home";

import ButtonLink from "@/components/ButtonLink";

const GroupMessageSuccess = () => (
  <Paper style={{ marginTop: "2rem" }}>
    <Box p={3} textAlign="center">
      <Typography variant="h4" style={{ marginBottom: "1rem" }}>
        Your message has been sent.
      </Typography>
      <Typography variant="body1" style={{ marginBottom: "2rem" }}>
        Once the owner of the group reviews your information, they will provide
        you with the links, etc. to participate in the group sittings. This may
        take a few days.
      </Typography>
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

export default GroupMessageSuccess;
