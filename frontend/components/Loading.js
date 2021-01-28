import isFunction from "lodash/isFunction";
import { useContext, useEffect, useRef } from "react";

import { LoadingContext } from "@/components/LoadingProvider";
import { useUser } from "@/lib/user";

const Loading = ({ children, ...props }) => {
  const { deleteState, setState } = useContext(LoadingContext);
  const id = useRef(null);
  const { user, userLoading } = useUser();

  let state;
  if (props.error && !props.loading) {
    state = "error";
  } else if (!props.data && props.called === false) {
    state = "waiting";
  } else if (
    userLoading ||
    (!props.data && (props.loading || props.called !== false))
  ) {
    state = "loading";
  } else if (props.requireUser && !user) {
    state = "noUser";
  } else {
    state = "ready";
  }

  useEffect(() => {
    setState(id, { ...props, state });
  }, [state]);

  useEffect(() => {
    return () => deleteState(id);
  }, []);

  if (state === "ready") {
    if (isFunction(children)) {
      return children({ ...props, user });
    } else {
      return children;
    }
  } else {
    return null;
  }
};

export default Loading;
