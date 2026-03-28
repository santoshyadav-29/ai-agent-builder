import { useEffect } from "react";
import { useAgentBuilderStore } from "../store";

export function useSessionTicker(): void {
  const incrementSessionTime = useAgentBuilderStore(
    (state) => state.incrementSessionTime,
  );

  useEffect(() => {
    const interval = setInterval(() => {
      incrementSessionTime();
    }, 1000);

    return () => clearInterval(interval);
  }, [incrementSessionTime]);
}
