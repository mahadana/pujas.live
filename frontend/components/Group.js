import { Box, Button, Grid, makeStyles } from "@material-ui/core";
import { zonedTimeToUtc, utcToZonedTime, format } from "date-fns-tz";

import Link from "./Link";
import { useUser } from "../lib/user";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    padding: "1.5em",
    "&:nth-child(odd)": {
      backgroundColor: "#eee",
    },
  },
  image: {
    flex: "0 0 12em",
    "& > img": {
      display: "block",
      objectFit: "cover",
      width: "10em",
      height: "10em",
    },
  },
  text: {
    flex: "1 1 20em",
    marginRight: "2em",
    "& > h3": {
      margin: 0,
      fontSize: "1.5em",
      fontWeight: 400,
    },
    "& > p": {
      fontSize: "1.1em",
      marginBottom: 0,
    },
  },
  links: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    "& button": {
      borderRadius: 20,
      marginTop: 20,
    },
  },
  events: {
    paddingInlineStart: 20,
    fontSize: "1.1em",
  },
}));

const zonedAndLocalTime = (timeString, timeZone) => {
  const now = new Date();
  const time = zonedTimeToUtc(
    format(now, "yyyy-MM-dd") + " " + timeString,
    timeZone
  );

  if (time < now) {
    time.setDate(time.getDate() + 1);
  }

  const formatTime = (t, timeZone) => {
    const mp = t.getMinutes() == 0 ? "" : ":mm";
    return format(t, `h${mp}aaaaa'm' zzz`, { timeZone });
  };

  if (format(now, "xx") === format(now, "xx", { timeZone })) {
    return formatTime(time);
  } else {
    return `${formatTime(time, timeZone)} (${formatTime(time)})`;
  }
};

const Group = (props) => {
  const classes = useStyles();
  const { user } = useUser();
  const imageUrl = props.image
    ? `${process.env.NEXT_PUBLIC_API_URL}${props.image?.formats?.thumbnail?.url}`
    : "https://placekitten.com/g/100/100";

  return (
    <Box className={classes.root}>
      <Box className={classes.image}>
        <img src={imageUrl} />
      </Box>
      <Box className={classes.text}>
        <h3>{props.name}</h3>
        <ul className={classes.events}>
          {props.events.map((event) => (
            <li key={event.id}>
              {event.daysOfWeek} @{" "}
              {zonedAndLocalTime(event.startAt, props.timezone)}
              {event.duration && " for " + event.duration + " minutes"}
            </li>
          ))}
        </ul>
        <p>{props.description}</p>
      </Box>
      <Box className={classes.links}>
        <Box>
          <Link href={`/groups/${props.id}`}>
            <Button variant="contained">Join Practice</Button>
          </Link>
          <br />
          <Link href={`/groups/${props.id}/message`}>
            <Button variant="contained">Message Group</Button>
          </Link>
          {user && (
            <>
              <br />
              <Link href={`/groups/${props.id}/edit`}>
                <Button variant="contained">Edit Group</Button>
              </Link>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Group;
