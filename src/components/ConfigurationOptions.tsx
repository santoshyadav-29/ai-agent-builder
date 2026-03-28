import { useState } from "react";
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
  selectedProvider: string;
  onProfileChange: (profileId: string) => void;
  onSkillSelect: (skillId: string) => void;
  onLayerSelect: (layerId: string) => void;
  onProviderChange: (provider: string) => void;
}

export function ConfigurationOptions({
  data,
  loading,
  error,
  validationErrors,
  selectedProfile,
  selectedProvider,
  onProfileChange,
  onSkillSelect,
  onLayerSelect,
  onProviderChange,
}: ConfigurationOptionsProps) {
  const [skillSelectValue, setSkillSelectValue] = useState("");
  const [layerSelectValue, setLayerSelectValue] = useState("");

  return (
    <section className="flex-1">
      <Card className="h-full border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100 mb-4 pb-4">
          <CardTitle className="text-xl font-bold text-gray-900">Configuration Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertTitle className="text-red-800 font-bold">Configuration Error</AlertTitle>
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          {loading && (
            <Alert className="bg-indigo-50 border-indigo-200">
              <AlertTitle className="text-indigo-800 font-bold">Loading</AlertTitle>
              <AlertDescription className="text-indigo-700">
                Fetching configuration data from the API.
              </AlertDescription>
            </Alert>
          )}

          {!data && !loading && !error && (
            <Alert className="bg-gray-50 border-gray-200">
              <AlertTitle className="text-gray-800 font-bold">No Configuration Loaded</AlertTitle>
              <AlertDescription className="text-gray-600">
                Reload configuration data to start building an agent.
              </AlertDescription>
            </Alert>
          )}

          {data && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="profile-select" className="text-sm font-bold text-gray-900">Base Profile</Label>
                <div className="relative">
                  <Select
                    value={selectedProfile || undefined}
                    onValueChange={onProfileChange}
                  >
                    <SelectTrigger
                      id="profile-select"
                      aria-invalid={!!validationErrors.profileId}
                      className="bg-gray-50 border-gray-200 focus:ring-indigo-600 focus:ring-2 shadow-sm rounded-lg"
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
                <Label htmlFor="skill-select" className="text-sm font-bold text-gray-900">Add Skill</Label>
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
                    className="bg-gray-50 border-gray-200 focus:ring-indigo-600 focus:ring-2 shadow-sm rounded-lg"
                  >
                    <SelectValue placeholder="Select a skill to add" />
                  </SelectTrigger>
                  <SelectContent className="border-gray-200 shadow-md rounded-lg">
                    {data.skills.map((skill) => (
                      <SelectItem key={skill.id} value={skill.id}>
                        {skill.name} <span className="text-gray-400">({skill.category})</span>
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
                <Label htmlFor="layer-select" className="text-sm font-bold text-gray-900">Add Personality Layer</Label>
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
                    className="bg-gray-50 border-gray-200 focus:ring-indigo-600 focus:ring-2 shadow-sm rounded-lg"
                  >
                    <SelectValue placeholder="Select a layer to add" />
                  </SelectTrigger>
                  <SelectContent className="border-gray-200 shadow-md rounded-lg">
                    {data.layers.map((layer) => (
                      <SelectItem key={layer.id} value={layer.id}>
                        {layer.name} <span className="text-gray-400">({layer.type})</span>
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
                <Label htmlFor="provider-select" className="text-sm font-bold text-gray-900">AI Provider</Label>
                <Select
                  value={selectedProvider || undefined}
                  onValueChange={onProviderChange}
                >
                  <SelectTrigger
                    id="provider-select"
                    aria-invalid={!!validationErrors.provider}
                    className="bg-gray-50 border-gray-200 focus:ring-indigo-600 focus:ring-2 shadow-sm rounded-lg"
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
        </CardContent>
      </Card>
    </section>
  );
}
