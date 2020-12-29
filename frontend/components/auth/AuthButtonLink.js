import { useFormikContext } from "formik";
import { useRouter } from "next/router";

import ButtonLink from "@/components/ButtonLink";

const AuthButtonLink = ({ children, path, ...props }) => {
  const router = useRouter();
  const formik = useFormikContext();
  const href = {
    pathname: path,
    query: { ...router.query },
  };
  delete href.query.email;

  const onClick = (event) => {
    event.preventDefault();
    if (formik.values.email) {
      href.query.email = formik.values.email;
    }
    router.push(href);
  };

  return (
    <ButtonLink onClick={onClick} href={href} {...props}>
      {children}
    </ButtonLink>
  );
};

export default AuthButtonLink;
