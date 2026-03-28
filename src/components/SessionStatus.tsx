import { useAgentBuilderStore } from "../store";
import { Badge } from "./ui";

export function SessionStatus() {
  const sessionTime = useAgentBuilderStore((state) => state.sessionTime);

  return (
    <Badge variant="secondary" className="font-normal">
      Session Active: {sessionTime}s
    </Badge>
  );
}
