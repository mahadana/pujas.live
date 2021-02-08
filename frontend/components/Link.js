import MaterialLink from "@material-ui/core/Link";
import NextLink from "next/link";
import { createElement, forwardRef } from "react";

export const Link = forwardRef(
  (
    {
      component = MaterialLink,
      href,
      as,
      prefetch,
      replace,
      scroll,
      shallow,
      ...props
    },
    ref
  ) => (
    <NextLink
      href={href}
      as={as}
      prefetch={prefetch}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref
    >
      {createElement(component, { ...props, ref })}
    </NextLink>
  )
);

Link.displayName = "Link";

export default Link;
