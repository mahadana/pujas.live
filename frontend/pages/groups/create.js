import GroupCreateContent from "@/components/GroupCreateContent";
import PageLayout from "@/components/PageLayout";
import { withApollo } from "@/lib/apollo";

const GroupCreatePage = () => (
  <PageLayout requireUser title="Create Group">
    {() => <GroupCreateContent />}
  </PageLayout>
);

export default withApollo()(GroupCreatePage);
