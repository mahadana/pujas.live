import { Box, makeStyles } from "@material-ui/core";
import Group from "./Group";
import Link from "next/link";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "1em 0",
  },
  showMore: {
    margin: "1em 0",
    textAlign: "center",
  },
}));

function GroupList({ groups }) {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Box>
        {groups.map((group) => (
          <Group key={group.id} {...group} />
        ))}
      </Box>
      <Box className={classes.showMore}>
        <Link href="#">
          <a>Show more groups</a>
        </Link>
      </Box>
    </Box>
  );
}

export default GroupList;
