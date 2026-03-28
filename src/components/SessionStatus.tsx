import { useAgentBuilderStore } from "../store";
import { Badge } from "./ui";

export function SessionStatus() {
  const sessionTime = useAgentBuilderStore((state) => state.sessionTime);

  return (
    <Badge variant="success" className="font-semibold gap-2 px-3 py-1 text-sm bg-emerald-500 shadow-sm border border-emerald-600/20">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
      </span>
      Session Active: {sessionTime}s
    </Badge>
  );
}
