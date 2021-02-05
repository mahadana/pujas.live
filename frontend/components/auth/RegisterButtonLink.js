import AuthButtonLink from "@/components/auth/AuthButtonLink";

const RegisterButtonLink = (props) => {
  return (
    <AuthButtonLink path="/auth/register" size="small" {...props}>
      Create Account
    </AuthButtonLink>
  );
};

export default RegisterButtonLink;
