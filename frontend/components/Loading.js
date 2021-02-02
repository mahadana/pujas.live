import isFunction from "lodash/isFunction";
import { useContext, useEffect, useRef } from "react";

import { LoadingContext } from "@/components/LoadingProvider";
import { useUser } from "@/lib/user";

const Loading = ({ children, queryResult, requireUser = false }) => {
  const { deleteState, setState } = useContext(LoadingContext);
  const id = useRef(null);
  const { user, userError, userLoading } = useUser();

  const data = queryResult?.data || queryResult?.previousData;
  const toShow = Boolean((!queryResult || data) && (user || !requireUser));

  let state;
  if (queryResult?.error || (requireUser && userError)) {
    state = "error";
  } else if (requireUser && !user && !userLoading) {
    state = "noUser";
  } else if (
    userLoading ||
    (!toShow &&
      queryResult?.loading !== undefined &&
      (queryResult?.loading || queryResult?.called !== false))
  ) {
    state = "loading";
  } else {
    state = "ok";
  }

  useEffect(() => {
    setState(id, { refetch: queryResult?.refetch, state });
  }, [state]);

  useEffect(() => {
    return () => deleteState(id);
  }, []);

  if (toShow) {
    if (isFunction(children)) {
      return children({ data, queryResult, user });
    } else {
      return children;
    }
  } else {
    return null;
  }
};

export default Loading;
