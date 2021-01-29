import * as yup from "yup";

export const GROUP_EVENT_DAY_OPTIONS = [
  "everyday",
  "weekdays",
  "weekends",
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const yupString = yup.string().ensure();
const yupRequiredString = yupString.required("Required");
const yupEmail = yupRequiredString.email("Invalid email address");
const yupPassword = yupRequiredString.min(6, "Should at least 6 characters");
const yupNullableNumber = yup
  .number()
  .default(null)
  .nullable()
  .transform((v) => (isNaN(v) ? null : v));

export const groupSchema = yup
  .object({
    id: yup.number().nullable(),
    title: yupRequiredString,
    description: yupString,
    image: yup.object().nullable(),
    timezone: yupRequiredString,
    events: yup
      .array()
      .ensure()
      .of(
        yup
          .object({
            id: yup.number().nullable(),
            day: yupString.oneOf(GROUP_EVENT_DAY_OPTIONS),
            startAt: yupRequiredString.matches(
              /^[0-9]{2}:[0-9]{2}(:[0-9]{2}(\.[0-9]+)?)?$/,
              "Not a time"
            ),
            duration: yupString.matches(/^[0-9]*$/, "Not a number"),
          })
          .noUnknown()
      ),
  })
  .noUnknown();

const fixTime = (value) => {
  if (typeof value === "string" && /^[0-9]{2}:[0-9]{2}$/.test(value)) {
    return value + ":00";
  } else {
    return value;
  }
};

const makeGroupDbCast = (update) => {
  const eventsFields = {
    day: yupString,
    startAt: yupString.transform(fixTime),
    duration: yupNullableNumber,
  };
  if (update) eventsFields.id = yup.number();
  return yup
    .object({
      title: yupString,
      description: yupString,
      image: yup
        .number()
        .nullable()
        .transform((value, original) => {
          if (original && original.id) {
            return parseInt(original.id);
          } else {
            return null;
          }
        }),
      timezone: yupString,
      events: yup.array().of(yup.object(eventsFields).noUnknown()),
    })
    .noUnknown();
};

export const groupCreateDbCast = makeGroupDbCast(false);

export const groupUpdateDbCast = makeGroupDbCast(true);

export const groupMessageSchema = yup.object({
  name: yupRequiredString,
  email: yupEmail,
  interest: yupRequiredString,
  experience: yupRequiredString,
});

export const loginSchema = yup.object({
  email: yupEmail,
  password: yupRequiredString,
});

export const registerSchema = yup.object({
  email: yupEmail.test(
    "not-existing",
    "Email already exists",
    (value, context) =>
      !context.parent.existingEmail || context.parent.existingEmail !== value
  ),
  existingEmail: yup.string(), // only used after server response
  password: yupPassword,
});

export const changeEmailSchema = yup.object({
  email: yupEmail,
});

export const changePasswordSchema = yup.object({
  oldPassword: yupRequiredString,
  newPassword: yupPassword.test(
    "same",
    "Same as old password",
    (value, context) => context.parent.oldPassword !== value
  ),
});

export const forgotPasswordSchema = yup.object({
  email: yupEmail,
});

export const resetPasswordSchema = yup.object({
  password: yupPassword,
});
