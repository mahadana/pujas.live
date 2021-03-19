import { useRouter } from "next/router";
import { useEffect } from "react";

import { setDefaultChantDataUrl } from "@/components/chanting/ChantDataUrlContent";

const ChanTestPage = () => {
  const router = useRouter();

  useEffect(() => {
    setDefaultChantDataUrl();
    router.push("/");
  }, []);

  return null;
};

export default ChanTestPage;
