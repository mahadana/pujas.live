import Banner from "@/components/Banner";
import ChantingBooksBar from "@/components/ChantingBooksBar";
import Loading from "@/components/Loading";
import Title from "@/components/Title";

const PageLayout = ({
  banner = true,
  chantingBooks = false,
  children,
  queryResult,
  title,
  requireUser = false,
  userButton = true,
}) => {
  return (
    <>
      {title !== undefined && <Title title={title} />}
      {banner && <Banner userButton={userButton} />}
      {chantingBooks && <ChantingBooksBar />}
      {queryResult || requireUser ? (
        <Loading queryResult={queryResult} requireUser={requireUser}>
          {children}
        </Loading>
      ) : (
        children
      )}
    </>
  );
};

export default PageLayout;
