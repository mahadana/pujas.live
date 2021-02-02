import PageLayout from "@/components/PageLayout";
import RegisterContent from "@/components/auth/RegisterContent";
import { withApollo } from "@/lib/apollo";

const RegisterPage = () => (
  <PageLayout title="Register" userButton={false}>
    <RegisterContent />
  </PageLayout>
);

export default withApollo()(RegisterPage);
