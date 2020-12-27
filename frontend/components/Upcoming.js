import Tooltip from "@material-ui/core/Tooltip";

import { dayjs } from "../lib/time";

const Upcoming = ({ time, duration }) => {
  time = dayjs(time).utc();
  const now = dayjs().utc();
  const localTz = dayjs.tz.guess();
  const tzTime = time.tz(localTz);

  const diff = time.diff(now, "minute");
  const from = time.from(now);
  const fullTime = tzTime.format("LLLL z");
  const shortTime = tzTime.format("h:mma z");
  const ended = now.isAfter(time.add(duration, "minute"));

  return (
    <Tooltip title={fullTime}>
      <span>
        {ended
          ? `Ended ${from}`
          : diff > 1440
          ? `Upcoming · ${fullTime}`
          : diff > 0
          ? `Starting ${from} · ${shortTime}`
          : `Started ${from} · ${shortTime}`}
      </span>
    </Tooltip>
  );
};

export default Upcoming;
