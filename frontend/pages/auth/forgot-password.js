import ForgotPasswordContent from "@/components/auth/ForgotPasswordContent";
import PageLayout from "@/components/PageLayout";
import { withApollo } from "@/lib/apollo";

const ForgotPasswordPage = () => (
  <PageLayout title="Forgot Password" userButton={false}>
    <ForgotPasswordContent />
  </PageLayout>
);

export default withApollo()(ForgotPasswordPage);
