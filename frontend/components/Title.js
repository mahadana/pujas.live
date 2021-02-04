import Head from "next/head";
import { siteName } from "@/lib/util";

const Title = ({ title = siteName }) => {
  return (
    <Head>
      <title>{title}</title>
    </Head>
  );
};

export default Title;
