import Tooltip from "@material-ui/core/Tooltip";

import { getUpcomingHumanTime, getHumanDateTime } from "shared/time";

const Upcoming = ({ duration, now, time, tz }) => {
  const fullDateTime = getHumanDateTime(time, { now, tz });
  if (fullDateTime) {
    const shortTime = getHumanDateTime(time, { date: false, now, tz });
    const upcomingTime = getUpcomingHumanTime(time, { duration, now, tz });
    return (
      <Tooltip title={fullDateTime}>
        <span>
          {upcomingTime}, {shortTime}
        </span>
      </Tooltip>
    );
  } else {
    return null;
  }
};

export default Upcoming;
