import {
  groupSchema,
  groupCreateDbCast,
  groupUpdateDbCast,
} from "@/lib/validation";

test("groupSchema.cast", () => {
  const group = {
    __typename: "Group",
    id: "9",
    title: "abc",
    description: "xyz",
    image: { foo: "bar" },
    owner: { id: "1" },
    timezone: "America/Campo_Grande",
    events: [
      {
        __typename: "ComponentEventGroupEvent",
        id: "15",
        day: "everyday",
        startAt: "22:36:37.000",
        duration: "232",
      },
    ],
  };

  expect(groupSchema.cast(group)).toEqual({
    id: 9,
    title: "abc",
    description: "xyz",
    image: { foo: "bar" },
    timezone: "America/Campo_Grande",
    events: [
      {
        id: 15,
        day: "everyday",
        startAt: "22:36:37.000",
        duration: "232",
      },
    ],
  });
});

test("groupCreateDbCast.cast", () => {
  const group = {
    title: "abc",
    description: "xyz",
    image: null,
    timezone: "America/Campo_Grande",
    events: [{ day: "everyday", startAt: "12:00", duration: "60" }],
  };
  expect(groupCreateDbCast.cast(group)).toEqual({
    title: "abc",
    description: "xyz",
    image: null,
    timezone: "America/Campo_Grande",
    events: [{ day: "everyday", startAt: "12:00:00", duration: 60 }],
  });
});

test("groupUpdateDbCast.cast", () => {
  const group = {
    id: 9,
    title: "abc",
    description: "",
    image: { id: "4", foo: "bar" },
    timezone: "America/Campo_Grande",
    events: [{ id: 1, day: "sunday", startAt: "22:36:37.000", duration: "" }],
  };
  expect(groupUpdateDbCast.cast(group)).toEqual({
    title: "abc",
    description: "",
    image: 4,
    timezone: "America/Campo_Grande",
    events: [{ id: 1, day: "sunday", startAt: "22:36:37.000", duration: null }],
  });
});
