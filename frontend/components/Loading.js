import isFunction from "lodash/isFunction";
import { useContext, useEffect, useRef } from "react";

import { LoadingContext } from "@/components/LoadingProvider";
import { useUser } from "@/lib/user";

const Loading = ({ children, data, previousData, requireUser, ...props }) => {
  const { deleteState, setState } = useContext(LoadingContext);
  const id = useRef(null);
  const { user, userError, userLoading } = useUser();

  data = data || previousData;
  const toShow = Boolean(data && (user || !requireUser));

  let state;
  if (props.error || (requireUser && userError)) {
    state = "error";
  } else if (requireUser && !user && !userLoading) {
    state = "noUser";
  } else if (
    userLoading ||
    (!toShow &&
      props.loading !== undefined &&
      (props.loading || props.called !== false))
  ) {
    state = "loading";
  } else {
    state = "ok";
  }

  useEffect(() => {
    setState(id, { refetch: props.refetch, state });
  }, [state]);

  useEffect(() => {
    return () => deleteState(id);
  }, []);

  if (toShow) {
    if (isFunction(children)) {
      return children({ ...props, data, user });
    } else {
      return children;
    }
  } else {
    return null;
  }
};

export default Loading;
