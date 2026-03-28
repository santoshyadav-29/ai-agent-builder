import { useCallback, useEffect, useRef, useState } from "react";
import type { AgentData } from "../types/agent";

interface UseAgentDataResult {
  data: AgentData | null;
  loading: boolean;
  error: string | null;
  fetchAgentData: () => Promise<void>;
}

export function useAgentData(): UseAgentDataResult {
  const [data, setData] = useState<AgentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const latestRequestIdRef = useRef(0);

  const fetchAgentData = useCallback(async () => {
    const requestId = ++latestRequestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      // Simulate network delay and randomness (1 to 3 seconds)
      const delay = Math.floor(Math.random() * 2000) + 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));

      const response = await fetch("/data.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData: AgentData = await response.json();
      if (requestId !== latestRequestIdRef.current) {
        return;
      }

      setData(jsonData);
    } catch (err: unknown) {
      if (requestId !== latestRequestIdRef.current) {
        return;
      }

      console.error("Error fetching data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch agent data",
      );
    } finally {
      if (requestId === latestRequestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void fetchAgentData();
  }, [fetchAgentData]);

  return {
    data,
    loading,
    error,
    fetchAgentData,
  };
}
