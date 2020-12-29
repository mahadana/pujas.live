import { useRouter } from "next/router";
import { useEffect } from "react";

import { useUser } from "@/lib/user";
import { pushBack } from "@/lib/util";

const LogoutPage = () => {
  const router = useRouter();
  const { logout } = useUser();
  useEffect(() => {
    logout();
    pushBack(router, "/auth/login");
  }, []);
  return <div />;
};

export default LogoutPage;
