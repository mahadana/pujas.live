import ButtonBase from "@material-ui/core/ButtonBase";

import Link from "@/components/Link";

const ButtonBaseLink = (props) => (
  <Link component={ButtonBase} focusRipple {...props} />
);

export default ButtonBaseLink;
