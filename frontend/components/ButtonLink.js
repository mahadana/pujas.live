import Button from "@material-ui/core/Button";
import NextLink from "next/link";

const ButtonLink = ({
  children,
  href,
  as,
  prefetch,
  replace,
  scroll,
  shallow,
  ...props
}) => (
  <NextLink
    href={href}
    as={as}
    prefetch={prefetch}
    replace={replace}
    scroll={scroll}
    shallow={shallow}
    passHref
  >
    <Button {...props}>{children}</Button>
  </NextLink>
);

export default ButtonLink;
