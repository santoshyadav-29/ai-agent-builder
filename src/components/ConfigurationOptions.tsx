import { AI_PROVIDERS } from "../constants/providers";
import type { AgentData, AgentValidationErrors } from "../types/agent";
import { Card, CardContent, CardHeader, CardTitle, Label } from "./ui";

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
  const selectClassName =
    "h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

  return (
    <section className="flex-1">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Configuration Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
      {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              Error: {error}
            </div>
      )}

      {loading && (
            <div className="rounded-md border border-primary/20 bg-primary/10 p-3 text-sm text-primary">
              Fetching configuration... this simulates API delay.
            </div>
      )}

      {!data && !loading && !error && <p>No data loaded.</p>}

      {data && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="profile-select">Base Profile</Label>
            <select
              id="profile-select"
              value={selectedProfile}
              onChange={(e) => {
                onProfileChange(e.target.value);
              }}
                  className={selectClassName}
            >
              <option value="">-- Select a Profile --</option>
              {data.agentProfiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
                {validationErrors.profileId && (
                  <p className="text-xs text-destructive">
                    {validationErrors.profileId}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="skill-select">Add Skill</Label>
            <select
              id="skill-select"
              onChange={(e) => {
                onSkillSelect(e.target.value);
                e.target.value = "";
              }}
              defaultValue=""
                  className={selectClassName}
            >
              <option value="" disabled>
                -- Select a Skill to Add --
              </option>
              {data.skills.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.category})
                </option>
              ))}
            </select>
                {validationErrors.skillIds && (
                  <p className="text-xs text-destructive">
                    {validationErrors.skillIds}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="layer-select">Add Personality Layer</Label>
            <select
              id="layer-select"
              onChange={(e) => {
                onLayerSelect(e.target.value);
                e.target.value = "";
              }}
              defaultValue=""
                  className={selectClassName}
            >
              <option value="" disabled>
                -- Select a Layer to Add --
              </option>
              {data.layers.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} ({l.type})
                </option>
              ))}
            </select>
                {validationErrors.layerIds && (
                  <p className="text-xs text-destructive">
                    {validationErrors.layerIds}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="provider-select">AI Provider</Label>
            <select
              id="provider-select"
              value={selectedProvider}
              onChange={(e) => onProviderChange(e.target.value)}
                  className={selectClassName}
            >
              <option value="">-- Select an AI Provider --</option>
              {AI_PROVIDERS.map((provider) => (
                <option key={provider} value={provider}>
                  {provider}
                </option>
              ))}
            </select>
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
