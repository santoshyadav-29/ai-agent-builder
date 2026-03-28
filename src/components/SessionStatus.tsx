import { useAgentBuilderStore } from "../store";

export function SessionStatus() {
  const sessionTime = useAgentBuilderStore((state) => state.sessionTime);

  return (
    <span style={{ fontSize: "0.9rem", color: "#666" }}>
      Session Active: {sessionTime}s
    </span>
  );
}
