import { useState } from "react";
import { Cpu, Layers3, Sparkles, UserRound } from "lucide-react";
import { AI_PROVIDERS } from "../constants/providers";
import type { AgentData, AgentValidationErrors } from "../types/agent";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Skeleton,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui";

interface ConfigurationOptionsProps {
  data: AgentData | null;
  loading: boolean;
  error: string | null;
  validationErrors: AgentValidationErrors;
  selectedProfile: string;
  selectedSkills: string[];
  selectedLayers: string[];
  selectedProvider: string;
  onProfileChange: (profileId: string) => void;
  onSkillSelect: (skillId: string) => void;
  onLayerSelect: (layerId: string) => void;
  onProviderChange: (provider: string) => void;
}

const getSelectionSummary = (
  selectedIds: string[],
  allOptions: Array<{ id: string; name: string }>,
  emptyPlaceholder: string,
) => {
  if (selectedIds.length === 0) {
    return emptyPlaceholder;
  }

  const names = selectedIds
    .map((id) => allOptions.find((option) => option.id === id)?.name)
    .filter((name): name is string => Boolean(name));

  if (names.length === 0) {
    return `${selectedIds.length} selected`;
  }

  const preview = names.slice(0, 2).join(", ");
  const remainder = names.length - 2;

  if (remainder > 0) {
    return `${preview} +${remainder}`;
  }

  return preview;
};

function ConfigurationOptionsSkeleton() {
  const sections = ["profile", "skill", "layer", "provider"];

  return (
    <div className="animate-soft-in space-y-6" aria-hidden="true">
      <div className="rounded-lg border border-indigo-100 bg-indigo-50/70 p-4">
        <Skeleton className="mb-3 h-4 w-28" />
        <Skeleton className="h-3 w-full max-w-xs" />
      </div>

      {sections.map((section) => (
        <div key={section} className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function ConfigurationOptions({
  data,
  loading,
  error,
  validationErrors,
  selectedProfile,
  selectedSkills,
  selectedLayers,
  selectedProvider,
  onProfileChange,
  onSkillSelect,
  onLayerSelect,
  onProviderChange,
}: ConfigurationOptionsProps) {
  const [skillSelectValue, setSkillSelectValue] = useState("");
  const [layerSelectValue, setLayerSelectValue] = useState("");

  const selectedSkillSet = new Set(selectedSkills);
  const selectedLayerSet = new Set(selectedLayers);

  const selectedSkillsSummary = data
    ? getSelectionSummary(selectedSkills, data.skills, "Select a skill to add")
    : "Select a skill to add";

  const selectedLayersSummary = data
    ? getSelectionSummary(selectedLayers, data.layers, "Select a layer to add")
    : "Select a layer to add";

  return (
    <section className="flex-1">
      <Card className="h-full border-gray-200 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-md motion-safe:animate-fade-up">
        <CardHeader className="border-b border-gray-100 mb-4 pb-4">
          <CardTitle className="text-xl font-bold text-gray-900">
            Configuration Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading && !data ? (
            <ConfigurationOptionsSkeleton />
          ) : (
            <>
              {error && (
                <Alert
                  variant="destructive"
                  className="bg-red-50 border-red-200 animate-soft-in"
                >
                  <AlertTitle className="text-red-800 font-bold">
                    Configuration Error
                  </AlertTitle>
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {loading && data && (
                <div
                  className="relative overflow-hidden rounded-lg border border-indigo-100 bg-indigo-50/70 p-4 animate-soft-in"
                  role="status"
                  aria-live="polite"
                >
                  <p className="text-sm font-semibold text-indigo-900">
                    Refreshing configuration data...
                  </p>
                  <div className="mt-3 h-1 w-full rounded-full skeleton-shimmer" />
                </div>
              )}

              {!data && !loading && !error && (
                <Alert className="bg-gray-50 border-gray-200">
                  <AlertTitle className="text-gray-800 font-bold">
                    No Configuration Loaded
                  </AlertTitle>
                  <AlertDescription className="text-gray-600">
                    Reload configuration data to start building an agent.
                  </AlertDescription>
                </Alert>
              )}

              {data && (
                <div className="space-y-6 animate-soft-in">
                  <div className="space-y-3">
                    <Label
                      htmlFor="profile-select"
                      className="flex items-center gap-2 text-sm font-bold text-gray-900"
                    >
                      <UserRound className="h-4 w-4 text-indigo-600" />
                      Base Profile
                    </Label>
                    <div className="relative">
                      <Select
                        value={selectedProfile || undefined}
                        onValueChange={onProfileChange}
                      >
                        <SelectTrigger
                          id="profile-select"
                          aria-invalid={!!validationErrors.profileId}
                          className="bg-gray-50 border-gray-200 shadow-sm rounded-lg transition-colors"
                        >
                          <SelectValue placeholder="Select a profile" />
                        </SelectTrigger>
                        <SelectContent className="border-gray-200 shadow-md rounded-lg">
                          {data.agentProfiles.map((profile) => (
                            <SelectItem key={profile.id} value={profile.id}>
                              {profile.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {validationErrors.profileId && (
                      <p className="text-xs font-medium text-red-600">
                        {validationErrors.profileId}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="skill-select"
                      className="flex items-center gap-2 text-sm font-bold text-gray-900"
                    >
                      <Sparkles className="h-4 w-4 text-indigo-600" />
                      Add Skill
                    </Label>
                    <Select
                      value={skillSelectValue || undefined}
                      onValueChange={(value) => {
                        onSkillSelect(value);
                        setSkillSelectValue("");
                      }}
                    >
                      <SelectTrigger
                        id="skill-select"
                        aria-invalid={!!validationErrors.skillIds}
                        className="bg-gray-50 border-gray-200 shadow-sm rounded-lg transition-colors [&>span]:truncate"
                      >
                        <SelectValue placeholder={selectedSkillsSummary} />
                      </SelectTrigger>
                      <SelectContent className="border-gray-200 shadow-md rounded-lg">
                        {data.skills.map((skill) => (
                          <SelectItem
                            key={skill.id}
                            value={skill.id}
                            disabled={selectedSkillSet.has(skill.id)}
                          >
                            {skill.name}{" "}
                            <span className="text-gray-400">
                              ({skill.category})
                            </span>
                            {selectedSkillSet.has(skill.id) && (
                              <span className="ml-1 text-indigo-600">
                                (selected)
                              </span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.skillIds && (
                      <p className="text-xs font-medium text-red-600">
                        {validationErrors.skillIds}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="layer-select"
                      className="flex items-center gap-2 text-sm font-bold text-gray-900"
                    >
                      <Layers3 className="h-4 w-4 text-indigo-600" />
                      Add Personality Layer
                    </Label>
                    <Select
                      value={layerSelectValue || undefined}
                      onValueChange={(value) => {
                        onLayerSelect(value);
                        setLayerSelectValue("");
                      }}
                    >
                      <SelectTrigger
                        id="layer-select"
                        aria-invalid={!!validationErrors.layerIds}
                        className="bg-gray-50 border-gray-200 shadow-sm rounded-lg transition-colors [&>span]:truncate"
                      >
                        <SelectValue placeholder={selectedLayersSummary} />
                      </SelectTrigger>
                      <SelectContent className="border-gray-200 shadow-md rounded-lg">
                        {data.layers.map((layer) => (
                          <SelectItem
                            key={layer.id}
                            value={layer.id}
                            disabled={selectedLayerSet.has(layer.id)}
                          >
                            {layer.name}{" "}
                            <span className="text-gray-400">
                              ({layer.type})
                            </span>
                            {selectedLayerSet.has(layer.id) && (
                              <span className="ml-1 text-indigo-600">
                                (selected)
                              </span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.layerIds && (
                      <p className="text-xs font-medium text-red-600">
                        {validationErrors.layerIds}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="provider-select"
                      className="flex items-center gap-2 text-sm font-bold text-gray-900"
                    >
                      <Cpu className="h-4 w-4 text-indigo-600" />
                      AI Provider
                    </Label>
                    <Select
                      value={selectedProvider || undefined}
                      onValueChange={onProviderChange}
                    >
                      <SelectTrigger
                        id="provider-select"
                        aria-invalid={!!validationErrors.provider}
                        className="bg-gray-50 border-gray-200 shadow-sm rounded-lg transition-colors"
                      >
                        <SelectValue placeholder="Select an AI provider" />
                      </SelectTrigger>
                      <SelectContent className="border-gray-200 shadow-md rounded-lg">
                        {AI_PROVIDERS.map((provider) => (
                          <SelectItem key={provider} value={provider}>
                            {provider}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.provider && (
                      <p className="text-xs font-medium text-red-600">
                        {validationErrors.provider}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
