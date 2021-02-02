import PageLayout from "@/components/PageLayout";
import ResetPasswordContent from "@/components/auth/ResetPasswordContent";
import { withApollo } from "@/lib/apollo";

const ResetPasswordPage = () => (
  <PageLayout title="Reset Password" userButton={false}>
    <ResetPasswordContent />
  </PageLayout>
);

export default withApollo()(ResetPasswordPage);
