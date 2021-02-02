import { useRouter } from "next/router";
import { useEffect } from "react";

import plausible from "@/lib/plausible";
import { useUser } from "@/lib/user";
import { pushBack } from "@/lib/util";

const LogoutPage = () => {
  const router = useRouter();
  const { logout } = useUser();
  useEffect(() => {
    if (router.isReady) {
      logout();
      plausible("logout");
      pushBack(router, "/auth/login");
    }
  }, [router.isReady]);
  return null;
};

export default LogoutPage;
