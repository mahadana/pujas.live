const dayjs = require("dayjs");
const en = require("dayjs/locale/en");
const advancedFormat = require("dayjs/plugin/advancedFormat");
const duration = require("dayjs/plugin/duration");
const localizedFormat = require("dayjs/plugin/localizedFormat");
const minMax = require("dayjs/plugin/minMax");
const relativeTime = require("dayjs/plugin/relativeTime");
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");
const weekday = require("dayjs/plugin/weekday");
const { listTimeZones } = require("timezone-support");

const relativeTimeConfig = {
  thresholds: [
    { l: "s", r: 1 },
    { l: "m", r: 1 },
    { l: "mm", r: 119, d: "minute" },
    { l: "h", r: 2 },
    { l: "hh", r: 23, d: "hour" },
    { l: "d", r: 1 },
    { l: "dd", r: 29, d: "day" },
    { l: "M", r: 1 },
    { l: "MM", r: 11, d: "month" },
    { l: "y" },
    { l: "yy", d: "year" },
  ],
};

dayjs.locale(en);
dayjs.extend(advancedFormat);
dayjs.extend(duration);
dayjs.extend(localizedFormat);
dayjs.extend(minMax);
dayjs.extend(relativeTime, relativeTimeConfig);
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(weekday);

const TIMEZONES = listTimeZones();

const TIME_FORMAT = "h:mma";
const FULL_DATETIME_FORMAT = `dddd, MMMM D, YYYY`;
const SHORT_DATETIME_FORMAT = `MMMM D`;

const getHumanDateTime = (
  dt,
  { full = true, date = true, time = true, tz, zone = true } = {}
) => {
  dt = normalizeTime(dt);
  if (!dt) return null;

  let format = null;
  if (date) {
    format = full ? FULL_DATETIME_FORMAT : SHORT_DATETIME_FORMAT;
  }
  if (time) {
    format = (format ? format + ", " : "") + TIME_FORMAT;
  }
  if (zone) {
    format = (format ? format + " " : "") + "z";
  }
  if (format) {
    return dt.tz(tz || dayjs.tz.guess()).format(format);
  } else {
    return null;
  }
};

const getLocalTimeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
};

const getNextGroupEventTime = (args) => {
  // Normalize now
  const now = normalizeTime(args.now) || dayjs().utc();

  // Normalize duration
  const duration = Math.max(0, parseInt(args.duration)); // normalize

  // Normalize timezone
  let tzNow;
  try {
    tzNow = now.tz(args.timezone);
  } catch {
    tzNow = now.tz("UTC");
  }

  const eventMap = ((dow) => {
    const em = {
      sunday: [1, 0, 0, 0, 0, 0, 0],
      monday: [0, 1, 0, 0, 0, 0, 0],
      tuesday: [0, 0, 1, 0, 0, 0, 0],
      wednesday: [0, 0, 0, 1, 0, 0, 0],
      thursday: [0, 0, 0, 0, 1, 0, 0],
      friday: [0, 0, 0, 0, 0, 1, 0],
      saturday: [0, 0, 0, 0, 0, 0, 1],
      weekdays: [0, 1, 1, 1, 1, 1, 0],
      weekends: [1, 0, 0, 0, 0, 0, 1],
    }[dow] || [1, 1, 1, 1, 1, 1, 1];
    return em.concat(em);
  })(args.day);

  let time = tzNow.timeString(args.startAt);
  let toAdd = eventMap.indexOf(1, time.day()) - time.day();
  time = time.add(toAdd, "day");
  if (now.isAfter(time.utc().add(duration, "minute"))) {
    toAdd = eventMap.indexOf(1, time.day() + 1) - time.day();
    time = time.add(toAdd, "day");
  }
  return time;
};

const UPCOMING_LONG_DURATION = 60 * 60 * 8; // 8 hours

const getUpcomingHumanTime = (time, { duration, endTime, now, tz } = {}) => {
  time = normalizeTime(time);
  if (!time) return null;

  now = normalizeTime(now) || dayjs().utc();
  endTime = normalizeTime(endTime);
  if (!endTime && duration) {
    endTime = time.add(duration, "minute");
  }

  if (endTime && !now.isBefore(endTime)) {
    if (Math.abs(endTime.diff(now, "second")) < 60) {
      return "Ended just now";
    } else {
      return `Ended ${endTime.from(now)}`;
    }
  }

  const diff = time.diff(now, "second");
  if (Math.abs(diff) < 60) {
    return "Starting now";
  } else {
    const preamble = diff > 0 ? "Starting " : "Started ";
    if (Math.abs(diff) > UPCOMING_LONG_DURATION) {
      return (
        preamble +
        getHumanDateTime(time, { full: false, time: false, tz, zone: false })
      );
    } else {
      return preamble + time.from(now);
    }
  }
};

const normalizeTime = (time) => {
  time = dayjs(time || null);
  if (time.isValid()) {
    return time.utc();
  } else {
    return null;
  }
};

const timeString = (option, dayjsClass) => {
  dayjsClass.prototype.timeString = function (time) {
    if (time === undefined) {
      time = this.format("HH:mm:ss.SSS");
    }
    const dts = this.format("YYYY-MM-DD") + "T" + time;
    const tz = this.$x && this.$x.$timezone;
    try {
      return tz ? dayjs.tz(dts, tz) : dayjs(dts).utc();
    } catch {
      return dayjs(null);
    }
  };
};

dayjs.extend(timeString);

module.exports = {
  dayjs,
  getHumanDateTime,
  getLocalTimeZone,
  getNextGroupEventTime,
  getUpcomingHumanTime,
  normalizeTime,
  TIMEZONES,
};
