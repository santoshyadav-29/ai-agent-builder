import { useState } from "react";
import {
  Bot,
  Cpu,
  FolderOpenDot,
  Layers3,
  Sparkles,
  Trash2,
  Upload,
  UserRound,
  X,
} from "lucide-react";
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
  const [selectedAgentForLoad, setSelectedAgentForLoad] =
    useState<SavedAgent | null>(null);

  const handleConfirmLoad = () => {
    if (!selectedAgentForLoad) {
      return;
    }

    onLoadAgent(selectedAgentForLoad);
    setSelectedAgentForLoad(null);
  };

  const getProfileName = (profileId: string) =>
    data?.agentProfiles.find((profile) => profile.id === profileId)?.name ||
    "None Selected";

  const getSkillNames = (skillIds: string[]) =>
    skillIds.map(
      (skillId) =>
        data?.skills.find((skill) => skill.id === skillId)?.name || skillId,
    );

  const getLayerNames = (layerIds: string[]) =>
    layerIds.map(
      (layerId) =>
        data?.layers.find((layer) => layer.id === layerId)?.name || layerId,
    );

  if (savedAgents.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 rounded-2xl bg-gray-50 p-8 border border-gray-200 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="space-y-1">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-gray-900">
            <FolderOpenDot className="h-6 w-6 text-indigo-600" />
            Saved Agents
          </h2>
          <p className="text-sm text-gray-600">
            Review and manage your previously hired teams.
          </p>
        </div>
        <Button
          onClick={onClearAll}
          variant="outline"
          size="sm"
          className="font-semibold shadow-sm"
        >
          Clear All
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {savedAgents.map((agent) => (
          <Card key={agent.id} className="shadow-sm border-gray-200 bg-white">
            <CardHeader className="pb-3 border-b border-gray-100 mb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-bold text-gray-900">
                  {agent.name}
                </CardTitle>
                <Badge variant="success" className="text-[10px] px-1.5 py-0">
                  Deployed
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground inline-flex items-center gap-1.5">
                  <UserRound className="h-3.5 w-3.5" />
                  Profile
                </span>
                <Badge variant="secondary">
                  {data?.agentProfiles.find(
                    (profile) => profile.id === agent.profileId,
                  )?.name || "None Selected"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground inline-flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Skills
                </span>
                <span>{agent.skillIds.length}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground inline-flex items-center gap-1.5">
                  <Layers3 className="h-3.5 w-3.5" />
                  Layers
                </span>
                <span>{agent.layerIds.length}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground inline-flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5" />
                  Provider
                </span>
                <Badge variant="outline">{agent.provider || "None"}</Badge>
              </div>

              <div className="flex gap-2 pt-1">
                <Button
                  onClick={() => setSelectedAgentForLoad(agent)}
                  className="flex-1"
                  variant="secondary"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Load
                </Button>
                <Button
                  onClick={() => onDeleteAgent(agent.id)}
                  variant="outline"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedAgentForLoad && (
        <div
          className="fixed inset-0 z-[1200] flex items-center justify-center bg-gray-900/45 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Saved agent details"
          onClick={() => setSelectedAgentForLoad(null)}
        >
          <div
            className="w-full max-w-2xl rounded-xl border border-gray-200 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <Bot className="h-5 w-5 text-indigo-600" />
                  {selectedAgentForLoad.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Review details before loading this agent.
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:text-gray-800"
                onClick={() => setSelectedAgentForLoad(null)}
                aria-label="Close details dialog"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-5 px-6 py-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Profile
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {getProfileName(selectedAgentForLoad.profileId)}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Provider
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {selectedAgentForLoad.provider || "None"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Capabilities
                </p>
                <div className="flex flex-wrap gap-2">
                  {getSkillNames(selectedAgentForLoad.skillIds).map(
                    (skillName, index) => (
                      <Badge
                        key={`${skillName}-${index}`}
                        variant="secondary"
                        className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        {skillName}
                      </Badge>
                    ),
                  )}
                  {selectedAgentForLoad.skillIds.length === 0 && (
                    <p className="text-sm text-gray-500 italic">
                      No skills added.
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Personality Layers
                </p>
                <div className="flex flex-wrap gap-2">
                  {getLayerNames(selectedAgentForLoad.layerIds).map(
                    (layerName, index) => (
                      <Badge
                        key={`${layerName}-${index}`}
                        variant="outline"
                        className="border-indigo-200 bg-indigo-50 text-indigo-700"
                      >
                        {layerName}
                      </Badge>
                    ),
                  )}
                  {selectedAgentForLoad.layerIds.length === 0 && (
                    <p className="text-sm text-gray-500 italic">
                      No layers added.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
              <Button
                variant="outline"
                onClick={() => setSelectedAgentForLoad(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmLoad}
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Load This Agent
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
