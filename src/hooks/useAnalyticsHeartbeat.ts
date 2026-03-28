import { useEffect, useRef } from "react";

export function useAnalyticsHeartbeat(agentName: string): void {
  const latestAgentNameRef = useRef(agentName);

  useEffect(() => {
    latestAgentNameRef.current = agentName;
  }, [agentName]);

  useEffect(() => {
    const analyticsInterval = setInterval(() => {
      const latestAgentName = latestAgentNameRef.current;
      if (latestAgentName !== "") {
        console.log(
          `[Analytics Heartbeat] User is working on agent named: "${latestAgentName}"`,
        );
      } else {
        console.log(
          "[Analytics Heartbeat] User is working on an unnamed agent draft...",
        );
      }
    }, 8000);

    return () => clearInterval(analyticsInterval);
  }, []);
}
