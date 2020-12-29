import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import capitalize from "lodash/capitalize";

import ButtonLink from "./ButtonLink";
import Upcoming from "./Upcoming";
import { dayjs } from "@/lib/time";
import { useUser } from "@/lib/user";

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
      margin: "0 0 .2rem",
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
    "& a": {
      borderRadius: 20,
      marginTop: 20,
    },
  },
  events: {
    margin: ".6em",
    padding: 0,
  },
  event: {
    padding: 0,
    "& > div": {
      margin: 0,
    },
  },
}));

const Group = ({
  description,
  events,
  id,
  image,
  name,
  nextEventTime,
  timezone,
}) => {
  const classes = useStyles();
  const { user } = useUser();

  const imageUrl = image
    ? `${process.env.NEXT_PUBLIC_API_URL}${image?.formats?.thumbnail?.url}`
    : "https://placekitten.com/g/100/100";
  const localEvents = (events || []).map((event) => ({
    day: capitalize(
      event.daysOfWeek === "everyday" ? "Every day" : event.daysOfWeek
    ),
    time: dayjs().tz(timezone).timeString(event.startAt).format("h:mma z"),
    duration:
      event.duration && dayjs.duration(event.duration, "minutes").humanize(),
  }));

  return (
    <Box className={classes.root}>
      <Box className={classes.image}>
        <img src={imageUrl} />
      </Box>
      <Box className={classes.text}>
        <Typography variant="h3">{name}</Typography>
        {nextEventTime && (
          <Typography variant="subtitle2">
            <Upcoming time={nextEventTime} />
          </Typography>
        )}
        <List dense className={classes.events}>
          {localEvents.map((event, index) => (
            <ListItem key={index} className={classes.event}>
              <ListItemText>
                · {event.day} · {event.time}
                {event.duration && " · " + event.duration}
              </ListItemText>
            </ListItem>
          ))}
        </List>
        <Typography variant="body2">{description}</Typography>
      </Box>
      <Box className={classes.links}>
        <Typography variant="body2">
          <ButtonLink href={`/groups/${id}`} variant="contained">
            Join Practice
          </ButtonLink>
          <br />
          <ButtonLink href={`/groups/${id}/message`} variant="contained">
            Message Group
          </ButtonLink>
          {user && (
            <>
              <br />
              <ButtonLink href={`/groups/${id}/edit`} variant="contained">
                Edit Group
              </ButtonLink>
            </>
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default Group;
