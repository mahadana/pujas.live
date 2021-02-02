import Head from "next/head";

const Title = ({ title = "?" }) => {
  title = title.slice(0, 50);
  return (
    <Head>
      <title>{title} | Pujas.live</title>
    </Head>
  );
};

export default Title;
