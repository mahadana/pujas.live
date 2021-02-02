import LoginContent from "@/components/auth/LoginContent";
import PageLayout from "@/components/PageLayout";
import { withApollo } from "@/lib/apollo";

const LoginPage = () => (
  <PageLayout title="Login" userButton={false}>
    <LoginContent />
  </PageLayout>
);

export default withApollo()(LoginPage);
