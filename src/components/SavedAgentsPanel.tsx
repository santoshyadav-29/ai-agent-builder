import type { AgentData, SavedAgent } from "../types/agent";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui";

interface SavedAgentsPanelProps {
  data: AgentData | null;
  savedAgents: SavedAgent[];
  onLoadAgent: (agent: SavedAgent) => void;
  onDeleteAgent: (id: string) => void;
  onClearAll: () => void;
}

export function SavedAgentsPanel({
  data,
  savedAgents,
  onLoadAgent,
  onDeleteAgent,
  onClearAll,
}: SavedAgentsPanelProps) {
  if (savedAgents.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Saved Agents</h2>
        <Button onClick={onClearAll} variant="destructive" size="sm">
          Clear All
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {savedAgents.map((agent) => (
          <Card key={agent.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{agent.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Profile</span>
                <Badge variant="secondary">
                  {data?.agentProfiles.find((p) => p.id === agent.profileId)
                    ?.name || "None Selected"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Skills</span>
                <span>{agent.skillIds?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Layers</span>
                <span>{agent.layerIds?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Provider</span>
                <Badge variant="outline">{agent.provider || "None"}</Badge>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                onClick={() => onLoadAgent(agent)}
                  className="flex-1"
                  variant="secondary"
              >
                Load
                </Button>
                <Button
                onClick={() => onDeleteAgent(agent.id)}
                  variant="destructive"
              >
                Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
