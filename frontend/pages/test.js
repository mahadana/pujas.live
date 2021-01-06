import VideoChantingBooksBar from "../components/VideoChantingBookBar";
import Slide from '@material-ui/core/Slide';
import Box from '@material-ui/core/Box';

const Test = () => {
  return (
    <Slide direction="right" in={true} mountOnEnter unmountOnExit>
      {/*<Box>text</Box>*/}
      <VideoChantingBooksBar />
    </Slide>
  );
};

export default Test;