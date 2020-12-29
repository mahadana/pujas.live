import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import HomeIcon from "@material-ui/icons/Home";

import ButtonLink from "@/components/ButtonLink";

const GroupMessageSuccess = () => (
  <Paper style={{ marginTop: "2rem" }}>
    <Box p={3} textAlign="center">
      <Typography variant="h3" style={{ marginBottom: "2rem" }}>
        Your message has been sent. Thank you!
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
