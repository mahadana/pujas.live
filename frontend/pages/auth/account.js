import AccountContent from "@/components/AccountContent";
import Banner from "@/components/Banner";
import Loading from "@/components/Loading";
import Title from "@/components/Title";
import { withApollo } from "@/lib/apollo";

const AccountPage = () => (
  <>
    <Title title="Account" />
    <Banner />
    <Loading data requireUser>
      {() => <AccountContent />}
    </Loading>
  </>
);

export default withApollo()(AccountPage);
