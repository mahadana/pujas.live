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

const getLocalTimeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
};

const getNextGroupEventTime = (args) => {
  // Normalize now
  let now = dayjs(args.now).utc();
  if (!now.isValid()) {
    now = dayjs().utc();
  }

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

const timeString = (option, dayjsClass) => {
  dayjsClass.prototype.timeString = function (ts) {
    if (ts === undefined) {
      return this.format("HH:mm:ss.SSS");
    }
    const dts = this.format("YYYY-MM-DD") + "T" + ts;
    const timezone = this.$x && this.$x.$timezone;
    if (timezone) {
      try {
        return dayjs.tz(dts, timezone);
      } catch {
        return dayjs(null);
      }
    } else {
      return dayjs(dts);
    }
  };
};

dayjs.extend(timeString);

module.exports = {
  dayjs,
  getLocalTimeZone,
  getNextGroupEventTime,
  TIMEZONES,
};
