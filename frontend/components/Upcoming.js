import Tooltip from "@material-ui/core/Tooltip";

import { dayjs } from "@/lib/time";

const Upcoming = ({ time, duration }) => {
  time = dayjs(time).utc();
  const now = dayjs().utc();
  const localTz = dayjs.tz.guess();
  const tzTime = time.tz(localTz);

  const diff = time.diff(now, "minute");
  const from = time.from(now);
  const fullTime = tzTime.format("LLLL z");
  const shortTime = tzTime.format("h:mma z");
  const endTime = duration ? time.add(duration, "minute") : null;
  const ended = duration ? now.isAfter(endTime) : false;
  const endedFrom = ended ? endTime.from(now) : null;

  return (
    <Tooltip title={fullTime}>
      <span>
        {ended
          ? `Ended ${endedFrom}`
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
