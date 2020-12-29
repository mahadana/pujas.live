import AuthButtonLink from "@/components/auth/AuthButtonLink";

const RegisterButtonLink = (props) => {
  return (
    <AuthButtonLink
      color="secondary"
      path="/auth/register"
      size="small"
      variant="outlined"
      {...props}
    >
      Create Account
    </AuthButtonLink>
  );
};

export default RegisterButtonLink;
