import { createContext, useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const ChantModal = dynamic(() => import("@/components/chanting/ChantModal"), {
  ssr: false,
});

export const ChantingBooksModalContext = createContext({
  open: false,
  setState: () => undefined,
});

export const useChantingBooksModal = () =>
  useContext(ChantingBooksModalContext);

const DEFAULT_STATE = {
  book: null,
  inRecording: false,
  onClose: null,
};

const ChantingBooksModal = ({ children }) => {
  const router = useRouter();
  const [state, setState] = useState(DEFAULT_STATE);

  useEffect(() => {
    setState((newState) => ({
      ...newState,
      inRecording: router.isReady && router.asPath !== "/",
    }));
  }, [router.asPath, setState]);

  const onClose = () => {
    state.onClose?.();
    setState((oldState) => ({ ...oldState, book: null, onClose: null }));
  };

  const open = Boolean(state.book);
  const context = {
    open,
    setState: (newState) =>
      setState((oldState) => ({ ...oldState, ...newState })),
  };

  return (
    <>
      <ChantingBooksModalContext.Provider value={context}>
        {children}
      </ChantingBooksModalContext.Provider>
      <ChantModal
        book={state.book}
        disableAudio={state.inRecording}
        disableFullScreen={state.inRecording}
        disableReturnToc={state.inRecording}
        onClose={onClose}
        open={open}
      />
    </>
  );
};

export default ChantingBooksModal;
