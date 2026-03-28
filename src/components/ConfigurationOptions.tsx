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
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Configuration Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Configuration Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading && (
            <Alert>
              <AlertTitle>Loading</AlertTitle>
              <AlertDescription>
                Fetching configuration data from the API.
              </AlertDescription>
            </Alert>
          )}

          {!data && !loading && !error && (
            <Alert>
              <AlertTitle>No Configuration Loaded</AlertTitle>
              <AlertDescription>
                Reload configuration data to start building an agent.
              </AlertDescription>
            </Alert>
          )}

          {data && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="profile-select">Base Profile</Label>
                <Select
                  value={selectedProfile || undefined}
                  onValueChange={onProfileChange}
                >
                  <SelectTrigger
                    id="profile-select"
                    aria-invalid={!!validationErrors.profileId}
                  >
                    <SelectValue placeholder="Select a profile" />
                  </SelectTrigger>
                  <SelectContent>
                    {data.agentProfiles.map((profile) => (
                      <SelectItem key={profile.id} value={profile.id}>
                        {profile.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.profileId && (
                  <p className="text-xs text-destructive">
                    {validationErrors.profileId}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="skill-select">Add Skill</Label>
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
                  >
                    <SelectValue placeholder="Select a skill to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {data.skills.map((skill) => (
                      <SelectItem key={skill.id} value={skill.id}>
                        {skill.name} ({skill.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.skillIds && (
                  <p className="text-xs text-destructive">
                    {validationErrors.skillIds}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="layer-select">Add Personality Layer</Label>
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
                  >
                    <SelectValue placeholder="Select a layer to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {data.layers.map((layer) => (
                      <SelectItem key={layer.id} value={layer.id}>
                        {layer.name} ({layer.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.layerIds && (
                  <p className="text-xs text-destructive">
                    {validationErrors.layerIds}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="provider-select">AI Provider</Label>
                <Select
                  value={selectedProvider || undefined}
                  onValueChange={onProviderChange}
                >
                  <SelectTrigger
                    id="provider-select"
                    aria-invalid={!!validationErrors.provider}
                  >
                    <SelectValue placeholder="Select an AI provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {AI_PROVIDERS.map((provider) => (
                      <SelectItem key={provider} value={provider}>
                        {provider}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.provider && (
                  <p className="text-xs text-destructive">
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
