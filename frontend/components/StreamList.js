import Stream from "./Stream";

function StreamList(props) {
  const { streams } = props;
  if (streams) {
    return (
      <>
        {streams.map((stream) => (
          <Stream key={stream.id} {...stream} />
        ))}
      </>
    );
  } else {
    return <p>No Streams Found</p>;
  }
}

export default StreamList;
