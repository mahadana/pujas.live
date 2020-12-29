import { dayjs, getNextGroupEventTime } from "@/lib/time";

describe("getNextGroupEventTime", () => {
  test("everyday", () => {
    const g = (now) =>
      getNextGroupEventTime({
        daysOfWeek: "everyday",
        startAt: "19:00:00",
        duration: 90,
        timezone: "Australia/Melbourne",
        now,
      }).format();
    expect(g("2020-12-20T08:00:00Z")).toBe("2020-12-20T19:00:00+11:00");
    expect(g("2020-12-20T09:30:00Z")).toBe("2020-12-20T19:00:00+11:00");
    expect(g("2020-12-20T09:45:00Z")).toBe("2020-12-21T19:00:00+11:00");
    expect(g("2020-12-21T12:00:00Z")).toBe("2020-12-22T19:00:00+11:00");
    expect(g("2020-12-24T20:00:00Z")).toBe("2020-12-25T19:00:00+11:00");
    expect(g("2020-12-27T02:00:00Z")).toBe("2020-12-27T19:00:00+11:00");
  });

  test("weekdays", () => {
    const g = (now) =>
      getNextGroupEventTime({
        daysOfWeek: "weekdays",
        startAt: "05:00:00",
        duration: 90,
        timezone: "US/Pacific",
        now,
      }).format();
    expect(g("2020-12-20T18:00:00Z")).toBe("2020-12-21T05:00:00-08:00");
    expect(g("2020-12-21T13:00:00Z")).toBe("2020-12-21T05:00:00-08:00");
    expect(g("2020-12-21T14:30:00Z")).toBe("2020-12-21T05:00:00-08:00");
    expect(g("2020-12-21T14:31:00Z")).toBe("2020-12-22T05:00:00-08:00");
    expect(g("2020-12-22T15:00:00Z")).toBe("2020-12-23T05:00:00-08:00");
    expect(g("2020-12-23T16:00:00Z")).toBe("2020-12-24T05:00:00-08:00");
    expect(g("2020-12-24T17:00:00Z")).toBe("2020-12-25T05:00:00-08:00");
    expect(g("2020-12-25T18:00:00Z")).toBe("2020-12-28T05:00:00-08:00");
  });

  test("weekends", () => {
    const g = (now) =>
      getNextGroupEventTime({
        daysOfWeek: "weekends",
        startAt: "12:00:00",
        duration: 60,
        timezone: "America/New_York",
        now,
      }).format();
    expect(g("2020-12-20T10:00:00Z")).toBe("2020-12-20T12:00:00-05:00");
    expect(g("2020-12-20T17:00:00Z")).toBe("2020-12-20T12:00:00-05:00");
    expect(g("2020-12-20T18:01:00Z")).toBe("2020-12-26T12:00:00-05:00");
    expect(g("2020-12-26T02:00:00Z")).toBe("2020-12-26T12:00:00-05:00");
    expect(g("2020-12-26T17:00:00Z")).toBe("2020-12-26T12:00:00-05:00");
    expect(g("2020-12-26T17:45:00Z")).toBe("2020-12-26T12:00:00-05:00");
    expect(g("2020-12-26T18:01:00Z")).toBe("2020-12-27T12:00:00-05:00");
    expect(g("2020-12-27T19:00:00Z")).toBe("2021-01-02T12:00:00-05:00");
  });

  test("tuesdays", () => {
    const g = (now) =>
      getNextGroupEventTime({
        daysOfWeek: "tuesdays",
        startAt: "01:00:00",
        duration: 15,
        timezone: "Asia/Yangon",
        now,
      }).format();
    expect(g("2020-12-21T18:00:00Z")).toBe("2020-12-22T01:00:00+06:30");
    expect(g("2020-12-21T18:45:00Z")).toBe("2020-12-22T01:00:00+06:30");
    expect(g("2020-12-21T18:46:00Z")).toBe("2020-12-29T01:00:00+06:30");
    expect(g("2020-12-25T12:00:00Z")).toBe("2020-12-29T01:00:00+06:30");
  });

  test("fridays", () => {
    const g = (now) =>
      getNextGroupEventTime({
        daysOfWeek: "fridays",
        startAt: "20:00:00",
        duration: 30,
        timezone: "America/Godthab",
        now,
      }).format();
    expect(g("2020-12-25T23:00:00Z")).toBe("2020-12-25T20:00:00-03:00");
    expect(g("2020-12-26T00:00:00Z")).toBe("2021-01-01T20:00:00-03:00");
    expect(g("2020-12-26T23:00:00Z")).toBe("2021-01-01T20:00:00-03:00");
  });

  test("saturdays", () => {
    const g = (now) =>
      getNextGroupEventTime({
        daysOfWeek: "saturdays",
        startAt: "14:00:00",
        duration: 30,
        timezone: "Europe/Athens",
        now,
      }).format();
    expect(g("2020-12-24T15:00:00Z")).toBe("2020-12-26T14:00:00+02:00");
    expect(g("2020-12-26T12:30:00Z")).toBe("2020-12-26T14:00:00+02:00");
    expect(g("2020-12-26T12:31:00Z")).toBe("2021-01-02T14:00:00+02:00");
  });

  test("daylight savings", () => {
    const g = (now) =>
      getNextGroupEventTime({
        daysOfWeek: "everyday",
        startAt: "01:15:00",
        duration: 60,
        timezone: "America/Chicago",
        now,
      }).format();
    expect(g("2020-10-31T05:30:00Z")).toBe("2020-10-31T01:15:00-05:00");
    expect(g("2020-11-01T06:30:00Z")).toBe("2020-11-01T01:15:00-06:00");
    expect(g("2020-11-01T07:30:00Z")).toBe("2020-11-01T01:15:00-06:00");
    expect(g("2020-11-01T08:30:00Z")).toBe("2020-11-02T01:15:00-06:00");
  });

  test("edge cases", () => {
    expect(
      getNextGroupEventTime({
        daysOfWeek: "everyday",
        startAt: "06:00:00",
        duration: 90,
        timezone: "America/Los_Angeles",
        now: "2020-12-27T07:54:00Z",
      }).format()
    ).toBe("2020-12-27T06:00:00-08:00");

    expect(
      getNextGroupEventTime({
        daysOfWeek: "everyday",
        startAt: "00:00:00",
        duration: 60,
        timezone: "America/Los_Angeles",
        now: "2020-12-27T08:48:26Z",
      }).format()
    ).toBe("2020-12-27T00:00:00-08:00");
  });
});

describe("timeString", () => {
  test("foobar", () => {
    const d = dayjs("2020-01-01T13:54:03.402Z");
    const fmt = "HH:mm:ss.SSS";

    expect(d.timeString()).toBe("13:54:03.402");
    expect(d.timeString("xyz").format()).toBe("Invalid Date");
    expect(d.timeString("5").format()).toBe("2020-01-01T05:00:00+00:00");
    expect(d.timeString("06:45:15.912").format(fmt)).toBe("06:45:15.912");
    expect(d.timeString("9:30").format(fmt)).toBe("09:30:00.000");
    expect(d.timeString("1:1:1.1").format(fmt)).toBe("01:01:01.001");

    const td = dayjs("2020-01-01T03:04:05Z").tz("America/Los_Angeles");
    expect(td.timeString("9").format()).toBe("2019-12-31T09:00:00-08:00");
  });
});
