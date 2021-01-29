import Container from "@material-ui/core/Container";
import { useState } from "react";

import Title from "@/components/Title";
import GroupMessageControl from "@/components/GroupMessageControl";
import GroupMessageSuccess from "@/components/GroupMessageSuccess";

const GroupMessageContent = ({ group }) => {
  const [success, setSuccess] = useState(false);

  const onSuccess = () => setSuccess(true);

  return (
    <Container maxWidth="sm">
      <Title title={`Join ${group.title}`} />
      {!success ? (
        <GroupMessageControl group={group} onSuccess={onSuccess} />
      ) : (
        <GroupMessageSuccess />
      )}
    </Container>
  );
};

export default GroupMessageContent;
