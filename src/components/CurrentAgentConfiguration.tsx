import type { AgentData } from "../types/agent";
import { Cpu, Layers3, Sparkles, UserRound, X } from "lucide-react";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
  Skeleton,
} from "./ui";

interface CurrentAgentConfigurationProps {
  data: AgentData | null;
  loading: boolean;
  selectedProfile: string;
  selectedSkills: string[];
  selectedLayers: string[];
  selectedProvider: string;
  onRemoveSkill: (skillId: string) => void;
  onRemoveLayer: (layerId: string) => void;
}

export function CurrentAgentConfiguration({
  data,
  loading,
  selectedProfile,
  selectedSkills,
  selectedLayers,
  selectedProvider,
  onRemoveSkill,
  onRemoveLayer,
}: CurrentAgentConfigurationProps) {
  const chipBaseClass =
    "inline-flex h-9 items-center gap-2 rounded-full border px-3 text-sm shadow-sm";

  const selectedProfileData = data?.agentProfiles.find(
    (profile) => profile.id === selectedProfile,
  );

  if (loading && !data) {
    return (
      <section className="flex-1">
        <Card className="h-full border-gray-200 shadow-sm flex flex-col transition-all duration-300 hover:border-indigo-200 hover:shadow-md motion-safe:animate-fade-up [animation-delay:120ms]">
          <CardHeader className="border-b border-gray-100 mb-4 pb-4">
            <CardTitle className="text-xl font-bold text-gray-900">
              Current Agent Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 flex-1 flex flex-col animate-soft-in">
            <div className="space-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>

            <Separator className="bg-gray-100" />

            <div className="space-y-3">
              <Skeleton className="h-4 w-28" />
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-9 w-28 rounded-full" />
                <Skeleton className="h-9 w-24 rounded-full" />
                <Skeleton className="h-9 w-32 rounded-full" />
              </div>
            </div>

            <div className="space-y-3">
              <Skeleton className="h-4 w-36" />
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-9 w-32 rounded-full" />
                <Skeleton className="h-9 w-28 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="flex-1">
      <Card className="h-full border-gray-200 shadow-sm flex flex-col transition-all duration-300 hover:border-indigo-200 hover:shadow-md motion-safe:animate-fade-up [animation-delay:120ms]">
        <CardHeader className="border-b border-gray-100 mb-4 pb-4">
          <CardTitle className="text-xl font-bold text-gray-900">
            Current Agent Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 flex-1 flex flex-col">
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider">
              <UserRound className="h-3.5 w-3.5 text-indigo-600" />
              Profile
            </h3>
            {selectedProfileData ? (
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-md">
                <p className="font-bold text-gray-900 text-base">
                  {selectedProfileData.name}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  {selectedProfileData.description}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic bg-gray-50 border border-gray-100 rounded-lg p-4">
                No profile selected.
              </p>
            )}
          </div>

          <Separator className="bg-gray-100" />

          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              Capabilities
            </h3>
            {selectedSkills.length > 0 && data ? (
              <ul className="flex flex-wrap gap-3">
                {selectedSkills.map((skillId) => {
                  const skill = data.skills.find((item) => item.id === skillId);
                  const skillName = skill?.name ?? "Unknown Skill";

                  return (
                    <li
                      key={skillId}
                      className={`${chipBaseClass} border-gray-200 bg-white transition-all duration-300 hover:border-indigo-200 hover:shadow`}
                    >
                      <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                      <span className="font-semibold text-gray-900">
                        {skillName}
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemoveSkill(skillId)}
                        className="text-gray-500 transition-colors hover:text-red-600"
                        aria-label={`Remove capability ${skillName}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">No skills added.</p>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider">
              <Layers3 className="h-3.5 w-3.5 text-indigo-600" />
              Personality Layers
            </h3>
            {selectedLayers.length > 0 && data ? (
              <ul className="flex flex-wrap gap-3">
                {selectedLayers.map((layerId) => {
                  const layer = data.layers.find((item) => item.id === layerId);
                  const layerName = layer?.name ?? "Unknown Layer";

                  return (
                    <li
                      key={layerId}
                      className={`${chipBaseClass} border-indigo-100 bg-indigo-50 transition-all duration-300 hover:-translate-y-0.5`}
                    >
                      <Layers3 className="h-3.5 w-3.5 text-indigo-500" />
                      <span className="font-semibold text-indigo-700">
                        {layerName}
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemoveLayer(layerId)}
                        className="text-indigo-500 transition-colors hover:text-red-600"
                        aria-label={`Remove personality layer ${layerName}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">No layers added.</p>
            )}
          </div>

          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 uppercase tracking-wider">
                <Cpu className="h-4 w-4 text-indigo-600" />
                Selected Provider
              </h3>
              {selectedProvider ? (
                <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200">
                  {selectedProvider}
                </Badge>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No provider selected.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
