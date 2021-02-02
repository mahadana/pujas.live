import Link from "@/components/Link";
import { useChannelRecordingsModalHref } from "@/components/ChannelRecordingsModal";
import { getChannelRecordingsPath } from "@/lib/path";

const ChannelRecordingsLink = ({ channel, children }) => {
  const getChannelRecordingsModalHref = useChannelRecordingsModalHref();

  const as = getChannelRecordingsPath(channel);
  const href = getChannelRecordingsModalHref(channel);

  return (
    <Link as={as} href={href} scroll={false} shallow>
      {children}
    </Link>
  );
};

export default ChannelRecordingsLink;
