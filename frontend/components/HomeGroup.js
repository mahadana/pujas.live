import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import capitalize from "lodash/capitalize";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import RowCard from "@/components/RowCard";
import Upcoming from "@/components/Upcoming";
import { useUser } from "@/lib/user";
import { getUploadImageUrl } from "@/lib/util";
import { getGroupEditPath, getGroupMessagePath } from "shared/path";
import { dayjs, getNextGroupEventTime } from "shared/time";

const useStyles = makeStyles((theme) => ({
  meta: {
    display: "box",
    boxOrient: "vertical",
    overflow: "hidden",
    lineClamp: 1,
    fontWeight: "500",
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
  description: {
    display: "box",
    boxOrient: "vertical",
    overflow: "hidden",
    lineClamp: 3,
  },
}));

const HomeGroup = ({ group }) => {
  const classes = useStyles();
  const { user } = useUser();

  const events = group.events;
  const timezone = group.timezone;
  const imageUrl = getUploadImageUrl(group.image);
  const actionLinkProps = [
    { href: getGroupMessagePath(group), label: "Join Group" },
  ];

  if (user && group.owner && parseInt(user.id) == parseInt(group.owner.id)) {
    actionLinkProps.push({
      href: getGroupEditPath(group),
      label: "Edit Group",
    });
  }

  const localEvents = (events || []).map((event) => ({
    day: capitalize(event.day === "everyday" ? "Every day" : event.day),
    time: dayjs().tz(timezone).timeString(event.startAt).format("h:mma z"),
    duration:
      event.duration && dayjs.duration(event.duration, "minutes").humanize(),
  }));
  const nextEventTime = events.length
    ? dayjs.min(
        events.map((event) =>
          getNextGroupEventTime({
            ...event,
            duration: event.duration || 60,
            timezone: timezone,
          })
        )
      )
    : null;

  return (
    <RowCard
      actionLinkProps={actionLinkProps}
      imageLinkProps={actionLinkProps[0]}
      imageUrl={imageUrl}
      ratio={16 / 9}
      title={group.title}
    >
      {nextEventTime && (
        <Typography className={classes.meta} gutterBottom variant="body1">
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

      <Typography className={classes.description} variant="body1">
        {group.description}
      </Typography>
    </RowCard>
  );
};

export default HomeGroup;
