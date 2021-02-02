import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import NoSsr from "@material-ui/core/NoSsr";
import { makeStyles } from "@material-ui/core/styles";
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
        aria-describedby="nouser-dialog-description"
        aria-labelledby="nouser-dialog-title"
        disableEnforceFocus={true}
        maxWidth="sm"
        onBackdropClick={onBackdropClick}
        open={noUser}
      >
        <DialogTitle id="nouser-dialog-title">Account Required</DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="nouser-dialog-description">
            Please create an account or login to continue...
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.actions}>
          <ButtonLink href="/">Cancel</ButtonLink>
          <ButtonLink href={getPushBackUrl(router, "/auth/register")}>
            New Account
          </ButtonLink>
          <ButtonLink
            autoFocus
            color="primary"
            href={getPushBackUrl(router, "/auth/login")}
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
