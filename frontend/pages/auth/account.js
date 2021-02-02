import AccountContent from "@/components/auth/AccountContent";
import PageLayout from "@/components/PageLayout";
import { withApollo } from "@/lib/apollo";

const AccountPage = () => (
  <PageLayout requireUser title="Account">
    {() => <AccountContent />}
  </PageLayout>
);

export default withApollo()(AccountPage);
