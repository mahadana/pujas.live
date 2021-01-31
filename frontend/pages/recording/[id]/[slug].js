import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";

import Loading from "@/components/Loading";
import Title from "@/components/Title";
import VideoContent from "@/components/VideoContent";
import { withApollo } from "@/lib/apollo";
import { RECORDING_QUERY } from "@/lib/schema";
import { getRecordingPath, getRecordingVideoUrl } from "@/lib/util";
import { useEffect } from "react";

const RecordingPage = () => {
  const router = useRouter();
  const result = useQuery(RECORDING_QUERY, {
    skip: !router.query.id,
    variables: { id: router.query.id },
  });

  let recordingPath, videoUrl;
  const recording = result.data?.recording;
  if (recording) {
    recordingPath = getRecordingPath(recording);
    videoUrl = getRecordingVideoUrl(recording, {
      autoplay: false,
      skip: router.query.skip,
    });
  }

  useEffect(() => {
    if (recording) {
      if (typeof window !== "undefined" && !recording.embed) {
        window.location.href = videoUrl;
      } else if (recordingPath != router.asPath) {
        router.replace(recordingPath, null, {
          shallow: true,
        });
      }
    }
  }, [!!recording, recordingPath, router.asPath]);

  return (
    <>
      <style jsx global>
        {`
          body {
            overflow-y: auto;
          }
        `}
      </style>
      <Loading {...result}>
        {() => (
          <>
            <Title title={recording.title} />
            <VideoContent url={videoUrl} />
          </>
        )}
      </Loading>
    </>
  );
};

export default withApollo()(RecordingPage);
