import { Col, Container, Row } from "reactstrap";
import Group from "./Group";

function GroupList(props) {
  const { groups } = props;
  if (groups) {
    return (
      <>
        {groups.map((group) => (
          <Group key={group.id} {...group} />
        ))}
      </>
    );
  } else {
    return null;
  }
}

export default GroupList;
