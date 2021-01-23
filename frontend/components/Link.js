import MaterialLink from "@material-ui/core/Link";
import NextLink from "next/link";

const Link = ({
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
    <MaterialLink {...props}>{children}</MaterialLink>
  </NextLink>
);

export default Link;
