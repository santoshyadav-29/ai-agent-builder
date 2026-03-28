import type { AgentData, SavedAgent } from "../types/agent";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "./ui";

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
    <section className="mt-8 rounded-2xl bg-gray-50 p-8 border border-gray-200 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Saved Agents</h2>
          <p className="text-sm text-gray-600">Review and manage your previously hired teams.</p>
        </div>
        <Button onClick={onClearAll} variant="outline" size="sm" className="font-semibold shadow-sm">
          Clear All
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {savedAgents.map((agent) => (
          <Card key={agent.id} className="shadow-sm border-gray-200 bg-white">
            <CardHeader className="pb-3 border-b border-gray-100 mb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-bold text-gray-900">{agent.name}</CardTitle>
                <Badge variant="success" className="text-[10px] px-1.5 py-0">Deployed</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Profile</span>
                <Badge variant="secondary">
                  {data?.agentProfiles.find(
                    (profile) => profile.id === agent.profileId,
                  )?.name || "None Selected"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Skills</span>
                <span>{agent.skillIds.length}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Layers</span>
                <span>{agent.layerIds.length}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Provider</span>
                <Badge variant="outline">{agent.provider || "None"}</Badge>
              </div>

              <div className="flex gap-2 pt-1">
                <Button
                  onClick={() => onLoadAgent(agent)}
                  className="flex-1"
                  variant="secondary"
                >
                  Load
                </Button>
                <Button
                  onClick={() => onDeleteAgent(agent.id)}
                  variant="outline"
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
