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

  const refetchers = [];
  let error = false;
  let loading = false;
  let noUser = false;
  for (const { refetch, state } of matrix.values()) {
    if (state === "error") {
      error = true;
      refetch && refetchers.push(refetch);
    } else if (state === "loading") {
      loading = true;
    } else if (state === "noUser") {
      noUser = true;
    }
  }

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
      <LoadingError error={error} refetchers={refetchers} />
      <LoadingProgress loading={loading} />
      <LoadingNoUser noUser={noUser} />
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
