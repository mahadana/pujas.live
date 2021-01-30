import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import NoSsr from "@material-ui/core/NoSsr";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { useRouter } from "next/router";

import ButtonLink from "@/components/ButtonLink";
import { getPushBackUrl } from "@/lib/util";

const useStyles = makeStyles((theme) => ({
  actions: {
    justifyContent: "space-evenly",
  },
}));

const LoadingNoUser = ({ noUser }) => {
  const router = useRouter();
  const classes = useStyles();

  const onBackdropClick = () => router.push("/");

  return (
    <NoSsr>
      <Dialog
        aria-labelledby="nouser-dialog-title"
        maxWidth="sm"
        onBackdropClick={onBackdropClick}
        open={noUser}
      >
        <DialogTitle id="nouser-dialog-title">Account Required</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1">
            Please create an account or login to continue...
          </Typography>
        </DialogContent>
        <DialogActions className={classes.actions}>
          <ButtonLink href="/">Cancel</ButtonLink>
          <ButtonLink
            href={getPushBackUrl(router, "/auth/register")}
            color="secondary"
          >
            New Account
          </ButtonLink>
          <ButtonLink
            href={getPushBackUrl(router, "/auth/login")}
            color="primary"
            startIcon={<ExitToAppIcon />}
          >
            Login
          </ButtonLink>
        </DialogActions>
      </Dialog>
    </NoSsr>
  );
};

export default LoadingNoUser;
