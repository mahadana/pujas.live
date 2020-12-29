import AuthButtonLink from "@/components/auth/AuthButtonLink";

const LoginButtonLink = () => {
  return (
    <AuthButtonLink path="/auth/login" size="small" variant="outlined">
      Login
    </AuthButtonLink>
  );
};

export default LoginButtonLink;
