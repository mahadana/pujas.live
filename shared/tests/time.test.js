const {
  dayjs,
  getHumanDateTime,
  getNextGroupEventTime,
  getUpcomingHumanTime,
  normalizeTime,
} = require("shared/time");

test("getHumanDateTime", () => {
  expect(getHumanDateTime()).toBeNull();
  expect(getHumanDateTime(null)).toBeNull();
  expect(getHumanDateTime("abc")).toBeNull();
  expect(getHumanDateTime("2020-02-12T18:00:00Z")).toBeTruthy();
  expect(
    getHumanDateTime("2020-02-12T18:00:00Z", {
      full: true,
      date: true,
      time: true,
      tz: "America/Los_Angeles",
      zone: true,
    })
  ).toBe("Wednesday, February 12, 2020, 10:00am PST");
  expect(
    getHumanDateTime("2020-02-12T18:00:00Z", {
      full: true,
      date: true,
      time: true,
      tz: "America/Los_Angeles",
      zone: false,
    })
  ).toBe("Wednesday, February 12, 2020, 10:00am");
  expect(
    getHumanDateTime("2020-02-12T18:00:00Z", {
      full: false,
      date: true,
      time: true,
      tz: "America/Los_Angeles",
      zone: true,
    })
  ).toBe("February 12, 10:00am PST");
  expect(
    getHumanDateTime("2020-02-12T18:00:00Z", {
      full: false,
      date: true,
      time: true,
      tz: "America/Los_Angeles",
      zone: false,
    })
  ).toBe("February 12, 10:00am");
  expect(
    getHumanDateTime("2020-02-12T18:00:00Z", {
      full: false,
      date: true,
      time: false,
      tz: "America/Los_Angeles",
      zone: false,
    })
  ).toBe("February 12");
  expect(
    getHumanDateTime("2020-02-12T18:00:00Z", {
      full: true,
      date: false,
      time: true,
      tz: "America/Los_Angeles",
      zone: true,
    })
  ).toBe("10:00am PST");
  expect(
    getHumanDateTime("2020-02-12T18:00:00Z", {
      full: false,
      date: false,
      time: false,
      tz: "America/Los_Angeles",
      zone: false,
    })
  ).toBeNull();
});

describe("getNextGroupEventTime", () => {
  test("everyday", () => {
    const e = (now) =>
      expect(
        getNextGroupEventTime({
          day: "everyday",
          startAt: "19:00:00",
          duration: 90,
          timezone: "Australia/Melbourne",
          now,
        }).format()
      );
    e("2020-12-20T08:00:00Z").toBe("2020-12-20T19:00:00+11:00");
    e("2020-12-20T09:30:00Z").toBe("2020-12-20T19:00:00+11:00");
    e("2020-12-20T09:45:00Z").toBe("2020-12-21T19:00:00+11:00");
    e("2020-12-21T12:00:00Z").toBe("2020-12-22T19:00:00+11:00");
    e("2020-12-24T20:00:00Z").toBe("2020-12-25T19:00:00+11:00");
    e("2020-12-27T02:00:00Z").toBe("2020-12-27T19:00:00+11:00");
  });

  test("weekdays", () => {
    const e = (now) =>
      expect(
        getNextGroupEventTime({
          day: "weekdays",
          startAt: "05:00:00",
          duration: 90,
          timezone: "US/Pacific",
          now,
        }).format()
      );
    e("2020-12-20T18:00:00Z").toBe("2020-12-21T05:00:00-08:00");
    e("2020-12-21T13:00:00Z").toBe("2020-12-21T05:00:00-08:00");
    e("2020-12-21T14:30:00Z").toBe("2020-12-21T05:00:00-08:00");
    e("2020-12-21T14:31:00Z").toBe("2020-12-22T05:00:00-08:00");
    e("2020-12-22T15:00:00Z").toBe("2020-12-23T05:00:00-08:00");
    e("2020-12-23T16:00:00Z").toBe("2020-12-24T05:00:00-08:00");
    e("2020-12-24T17:00:00Z").toBe("2020-12-25T05:00:00-08:00");
    e("2020-12-25T18:00:00Z").toBe("2020-12-28T05:00:00-08:00");
  });

  test("weekends", () => {
    const e = (now) =>
      expect(
        getNextGroupEventTime({
          day: "weekends",
          startAt: "12:00:00",
          duration: 60,
          timezone: "America/New_York",
          now,
        }).format()
      );
    e("2020-12-20T10:00:00Z").toBe("2020-12-20T12:00:00-05:00");
    e("2020-12-20T17:00:00Z").toBe("2020-12-20T12:00:00-05:00");
    e("2020-12-20T18:01:00Z").toBe("2020-12-26T12:00:00-05:00");
    e("2020-12-26T02:00:00Z").toBe("2020-12-26T12:00:00-05:00");
    e("2020-12-26T17:00:00Z").toBe("2020-12-26T12:00:00-05:00");
    e("2020-12-26T17:45:00Z").toBe("2020-12-26T12:00:00-05:00");
    e("2020-12-26T18:01:00Z").toBe("2020-12-27T12:00:00-05:00");
    e("2020-12-27T19:00:00Z").toBe("2021-01-02T12:00:00-05:00");
  });

  test("tuesday", () => {
    const e = (now) =>
      expect(
        getNextGroupEventTime({
          day: "tuesday",
          startAt: "01:00:00",
          duration: 15,
          timezone: "Asia/Yangon",
          now,
        }).format()
      );
    e("2020-12-21T18:00:00Z").toBe("2020-12-22T01:00:00+06:30");
    e("2020-12-21T18:45:00Z").toBe("2020-12-22T01:00:00+06:30");
    e("2020-12-21T18:46:00Z").toBe("2020-12-29T01:00:00+06:30");
    e("2020-12-25T12:00:00Z").toBe("2020-12-29T01:00:00+06:30");
  });

  test("friday", () => {
    const e = (now) =>
      expect(
        getNextGroupEventTime({
          day: "friday",
          startAt: "20:00:00",
          duration: 30,
          timezone: "America/Godthab",
          now,
        }).format()
      );
    e("2020-12-25T23:00:00Z").toBe("2020-12-25T20:00:00-03:00");
    e("2020-12-26T00:00:00Z").toBe("2021-01-01T20:00:00-03:00");
    e("2020-12-26T23:00:00Z").toBe("2021-01-01T20:00:00-03:00");
  });

  test("saturday", () => {
    const e = (now) =>
      expect(
        getNextGroupEventTime({
          day: "saturday",
          startAt: "14:00:00",
          duration: 30,
          timezone: "Europe/Athens",
          now,
        }).format()
      );
    e("2020-12-24T15:00:00Z").toBe("2020-12-26T14:00:00+02:00");
    e("2020-12-26T12:30:00Z").toBe("2020-12-26T14:00:00+02:00");
    e("2020-12-26T12:31:00Z").toBe("2021-01-02T14:00:00+02:00");
  });

  test("daylight savings", () => {
    const e = (now) =>
      expect(
        getNextGroupEventTime({
          day: "everyday",
          startAt: "01:15:00",
          duration: 60,
          timezone: "America/Chicago",
          now,
        }).format()
      );
    e("2020-10-31T05:30:00Z").toBe("2020-10-31T01:15:00-05:00");
    e("2020-11-01T06:30:00Z").toBe("2020-11-01T01:15:00-05:00");
    e("2020-11-01T07:30:00Z").toBe("2020-11-01T01:15:00-06:00");
    e("2020-11-01T08:30:00Z").toBe("2020-11-02T01:15:00-06:00");
  });

  test("edge cases", () => {
    expect(
      getNextGroupEventTime({
        day: "everyday",
        startAt: "06:00:00",
        duration: 90,
        timezone: "America/Los_Angeles",
        now: "2020-12-27T07:54:00Z",
      }).format()
    ).toBe("2020-12-27T06:00:00-08:00");

    expect(
      getNextGroupEventTime({
        day: "everyday",
        startAt: "00:00:00",
        duration: 60,
        timezone: "America/Los_Angeles",
        now: "2020-12-27T08:48:26Z",
      }).format()
    ).toBe("2020-12-27T00:00:00-08:00");
  });
});

describe("getUpcomingHumanTime", () => {
  test("basics", () => {
    expect(getUpcomingHumanTime()).toBeNull();
    expect(getUpcomingHumanTime(null)).toBeNull();
    expect(getUpcomingHumanTime("abc")).toBeNull();
    expect(getUpcomingHumanTime("2020-02-10T18:00:01Z")).toBeTruthy();
  });

  test("future", () => {
    const e = (now) =>
      expect(
        getUpcomingHumanTime("2020-02-10T18:00:00Z", {
          now,
          tz: "America/Chicago",
        })
      );
    e("2020-02-09T18:00:00Z").toBe("Starting February 10");
    e("2020-02-10T09:59:59Z").toBe("Starting February 10");
    e("2020-02-10T10:00:00Z").toBe("Starting in 8 hours");
    e("2020-02-10T15:00:00Z").toBe("Starting in 3 hours");
    e("2020-02-10T15:40:00Z").toBe("Starting in 2 hours");
    e("2020-02-10T16:30:00Z").toBe("Starting in 90 minutes");
    e("2020-02-10T17:59:01Z").toBe("Starting now");
    e("2020-02-10T18:00:00Z").toBe("Starting now");
  });

  test("past", () => {
    const e = (now) =>
      expect(
        getUpcomingHumanTime("2020-02-10T18:00:00Z", {
          now,
          tz: "America/New_York",
        })
      );
    e("2020-02-10T18:00:59Z").toBe("Starting now");
    e("2020-02-10T18:01:00Z").toBe("Started a minute ago");
    e("2020-02-10T19:30:00Z").toBe("Started 90 minutes ago");
    e("2020-02-10T20:20:00Z").toBe("Started 2 hours ago");
    e("2020-02-10T20:40:00Z").toBe("Started 3 hours ago");
    e("2020-02-11T02:00:00Z").toBe("Started 8 hours ago");
    e("2020-02-11T02:00:01Z").toBe("Started February 10");
    e("2020-02-11T19:00:00Z").toBe("Started February 10");
  });

  test("ended", () => {
    const e = (now) =>
      expect(
        getUpcomingHumanTime("2020-02-10T13:00:00Z", {
          now,
          tz: "America/Chicago",
          endTime: "2020-02-10T14:30:00Z",
        })
      );
    e("2020-02-10T12:00:00Z").toBe("Starting in 60 minutes");
    e("2020-02-10T13:30:01Z").toBe("Started 30 minutes ago");
    e("2020-02-10T14:30:00Z").toBe("Ended just now");
    e("2020-02-10T15:00:00Z").toBe("Ended 30 minutes ago");
    e("2020-02-10T17:00:00Z").toBe("Ended 3 hours ago");
  });

  test("duration", () => {
    const e = (now) =>
      expect(
        getUpcomingHumanTime("2020-02-10T13:00:00Z", {
          now,
          tz: "America/Los_Angeles",
          duration: 60,
        })
      );
    e("2020-02-10T12:00:00Z").toBe("Starting in 60 minutes");
    e("2020-02-10T13:30:01Z").toBe("Started 30 minutes ago");
    e("2020-02-10T14:00:00Z").toBe("Ended just now");
    e("2020-02-10T18:00:00Z").toBe("Ended 4 hours ago");
  });
});

describe("normalizeTime", () => {
  test("invalid", () => {
    const e = (time) => expect(normalizeTime(time));
    e().toBeNull();
    e(null).toBeNull();
    e("abc").toBeNull();
    e({}).toBeNull();
    e([]).toBeNull();
  });

  test("valid", () => {
    const e = (time) => expect(normalizeTime(time).format());
    e(123).toBe("1970-01-01T00:00:00Z");
    e("2020-02-12T18:00:00-04:00").toBe("2020-02-12T22:00:00Z");
    e(dayjs("2020-02-12T18:00:00Z")).toBe("2020-02-12T18:00:00Z");
  });
});

describe("timeString", () => {
  test("simple", () => {
    const date = dayjs("2020-01-01T13:54:03.402Z");
    const e = (time) => expect(date.timeString(time).format("HH:mm:ss.SSS"));
    e().toBe("13:54:03.402");
    e("xyz").toBe("Invalid Date");
    e("5").toBe("05:00:00.000");
    e("06:45:15.912").toBe("06:45:15.912");
    e("9:30").toBe("09:30:00.000");
    e("1:1:1.1").toBe("01:01:01.001");
  });

  test("timezone", () => {
    const date = dayjs("2020-01-01T03:04:05Z").tz("America/Los_Angeles");
    expect(date.timeString("9").format()).toBe("2019-12-31T09:00:00-08:00");
  });
});
