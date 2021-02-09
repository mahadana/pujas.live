import Tooltip from "@material-ui/core/Tooltip";

import { getUpcomingHumanTime, getHumanDateTime } from "shared/time";

const Upcoming = ({ duration, time }) => {
  const fullTime = getHumanDateTime(time);
  const upcomingTime = getUpcomingHumanTime(time, { duration });
  if (upcomingTime) {
    return (
      <Tooltip title={fullTime}>
        <span>{upcomingTime}</span>
      </Tooltip>
    );
  } else {
    return null;
  }
};

export default Upcoming;
