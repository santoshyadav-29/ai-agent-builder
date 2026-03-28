import { useEffect } from "react";

export function useAnalyticsHeartbeat(agentName: string): void {
  useEffect(() => {
    const analyticsInterval = setInterval(() => {
      if (agentName !== "") {
        console.log(
          `[Analytics Heartbeat] User is working on agent named: "${agentName}"`,
        );
      } else {
        console.log(
          "[Analytics Heartbeat] User is working on an unnamed agent draft...",
        );
      }
    }, 8000);

    return () => clearInterval(analyticsInterval);
  }, [agentName]);
}
