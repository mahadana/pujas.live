import PageLayout from "@/components/PageLayout";
import RegisterContent from "@/components/auth/RegisterContent";
import { withApollo } from "@/lib/apollo";

const RegisterPage = () => (
  <PageLayout title="Create Account" userButton={false}>
    <RegisterContent />
  </PageLayout>
);

export default withApollo()(RegisterPage);
