import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";
import Link from "next/link";

const CloseButtonLink = ({ className, onClick, ...props }) => {
  return (
    <Link {...props} passHref>
      <IconButton onClick={onClick} className={className}>
        <CancelIcon style={{ fontSize: "1em" }} />
      </IconButton>
    </Link>
  );
};

export default CloseButtonLink;
