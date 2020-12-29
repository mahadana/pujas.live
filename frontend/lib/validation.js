import * as yup from "yup";

export const DAYS_OF_WEEK_OPTIONS = [
  "everyday",
  "weekdays",
  "weekends",
  "sundays",
  "mondays",
  "tuesdays",
  "wednesdays",
  "thursdays",
  "fridays",
  "saturdays",
];

export const groupSchema = yup
  .object({
    id: yup.number().nullable(),
    name: yup.string().ensure().required("Required"),
    description: yup.string().ensure(),
    timezone: yup.string().ensure().required("Required"),
    events: yup
      .array()
      .ensure()
      .of(
        yup
          .object({
            id: yup.number().nullable(),
            startAt: yup
              .string()
              .ensure()
              .required("Required")
              .matches(
                /^[0-9]{2}:[0-9]{2}(:[0-9]{2}(\.[0-9]+)?)?$/,
                "Not a time"
              ),
            duration: yup
              .string()
              .ensure()
              .matches(/^[0-9]*$/, "Not a number"),
            daysOfWeek: yup.string().ensure().oneOf(DAYS_OF_WEEK_OPTIONS),
          })
          .noUnknown()
      ),
  })
  .noUnknown();

const fixTime = (value, original) => {
  if (typeof value === "string" && /^[0-9]{2}:[0-9]{2}$/.test(value)) {
    return value + ":00";
  } else {
    return value;
  }
};

const nullableNumber = yup
  .number()
  .default(null)
  .nullable()
  .transform((v, o) => (isNaN(v) ? null : v));

const makeGroupDbCast = (update) => {
  const eventsFields = {
    startAt: yup.string().transform(fixTime),
    duration: nullableNumber,
    daysOfWeek: yup.string(),
  };
  if (update) eventsFields.id = yup.number();
  return yup
    .object({
      name: yup.string(),
      description: yup.string(),
      timezone: yup.string(),
      events: yup.array().of(yup.object(eventsFields).noUnknown()),
    })
    .noUnknown();
};

export const groupCreateDbCast = makeGroupDbCast(false);

export const groupUpdateDbCast = makeGroupDbCast(true);

export const groupMessageSchema = yup.object({
  name: yup.string().required("Required"),
  email: yup.string().required("Required").email("Invalid email address"),
  interest: yup.string().required("Required"),
  experience: yup.string().required("Required"),
});

export const loginSchema = yup.object({
  email: yup.string().required("Required").email("Invalid email address"),
  password: yup.string().required("Required"),
});

export const registerSchema = yup.object({
  email: yup
    .string()
    .required("Required")
    .email("Invalid email address")
    .test(
      "not-existing",
      "Email already exists",
      (value, context) =>
        !context.parent.existingEmail || context.parent.existingEmail !== value
    ),
  existingEmail: yup.string(), // only used after server response
  password: yup.string().required("Required"),
});

export const forgotPasswordSchema = yup.object({
  email: yup.string().required("Required").email("Invalid email address"),
});

export const resetPasswordSchema = yup.object({
  password: yup.string().required("Required"),
});
