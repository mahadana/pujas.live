import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
  span: {
    color: typeof window === "undefined" ? "transparent" : "inherit",
    transition: "color 0.5s ease",
  },
}));

import { getUpcomingHumanTime, getHumanDateTime } from "shared/time";

const Upcoming = ({ duration, now, time, tz }) => {
  const classes = useStyles();
  const fullDateTime = getHumanDateTime(time, { now, tz });
  if (fullDateTime) {
    const shortTime = getHumanDateTime(time, { date: false, now, tz });
    const upcomingTime = getUpcomingHumanTime(time, { duration, now, tz });
    return (
      <Tooltip title={fullDateTime}>
        <span className={classes.span}>
          {upcomingTime}, {shortTime}
        </span>
      </Tooltip>
    );
  } else {
    return null;
  }
};

export default Upcoming;
