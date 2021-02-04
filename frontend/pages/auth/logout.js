import { useRouter } from "next/router";
import { useEffect } from "react";

import plausible from "@/lib/plausible";
import { useUser } from "@/lib/user";
import { useRouteBack } from "@/lib/util";

const LogoutPage = () => {
  const router = useRouter();
  const routeBack = useRouteBack(router);
  const { logout } = useUser();
  useEffect(() => {
    if (router.isReady) {
      logout();
      plausible("logout");
      routeBack.push("/auth/login");
    }
  }, [router.isReady]);
  return null;
};

export default LogoutPage;
