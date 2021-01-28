import { createContext, useState } from "react";

import LoadingError from "@/components/LoadingError";
import LoadingNoUser from "@/components/LoadingNoUser";
import LoadingProgress from "@/components/LoadingProgress";

export const LoadingContext = createContext({
  deleteState: () => undefined,
  setState: () => undefined,
});

const LoadingProvider = ({ children }) => {
  const [matrix, setMatrix] = useState(new Map());

  let errors = [];
  const refetchers = [];
  let loading = false;
  let noUser = false;
  let noUserMessages = [];
  for (const { error, refetch, state, noUserMessage } of matrix.values()) {
    if (state === "error") {
      errors.push(error);
      refetchers.push(refetch);
    } else if (state === "loading") {
      loading = true;
    } else if (state === "noUser") {
      noUser = true;
      noUserMessage && noUserMessages.push(noUserMessage);
    }
  }
  const error = errors.length > 0;

  const context = {
    deleteState: (id) =>
      setMatrix((matrix) => {
        matrix = new Map(matrix);
        matrix.delete(id);
        return matrix;
      }),
    setState: (id, data) =>
      setMatrix((matrix) => new Map(matrix).set(id, data)),
  };

  return (
    <LoadingContext.Provider value={context}>
      {children}
      <LoadingError error={error} errors={errors} refetchers={refetchers} />
      <LoadingProgress loading={loading} />
      <LoadingNoUser noUser={noUser} noUserMessages={noUserMessages} />
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
