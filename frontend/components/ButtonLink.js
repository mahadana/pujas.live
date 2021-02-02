import NextLink from "next/link";

import Button from "@/components/Button";

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
