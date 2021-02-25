import { createContext, useContext, useState } from "react";
import { useIdleTimer } from "react-idle-timer";

export const ChantIdleContext = createContext({ idle: false });

export const useChantIdle = () => useContext(ChantIdleContext).idle;

const ChantIdleProvider = ({ children }) => {
  const [idle, setIdle] = useState(false);

  useIdleTimer({
    debounce: 500,
    onActive: () => setIdle(false),
    onIdle: () => setIdle(true),
    timeout: 1000 * 2, // 2 seconds
  });

  return (
    <ChantIdleContext.Provider value={{ idle }}>
      {children}
    </ChantIdleContext.Provider>
  );
};

export default ChantIdleProvider;
