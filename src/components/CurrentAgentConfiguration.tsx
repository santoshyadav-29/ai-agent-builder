import type { AgentData, AgentValidationErrors } from "../types/agent";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
} from "./ui";

interface CurrentAgentConfigurationProps {
  data: AgentData | null;
  validationErrors: AgentValidationErrors;
  selectedProfile: string;
  selectedSkills: string[];
  selectedLayers: string[];
  selectedProvider: string;
  agentName: string;
  onRemoveSkill: (skillId: string) => void;
  onRemoveLayer: (layerId: string) => void;
  onAgentNameChange: (name: string) => void;
  onSaveAgent: () => void;
}

export function CurrentAgentConfiguration({
  data,
  validationErrors,
  selectedProfile,
  selectedSkills,
  selectedLayers,
  selectedProvider,
  agentName,
  onRemoveSkill,
  onRemoveLayer,
  onAgentNameChange,
  onSaveAgent,
}: CurrentAgentConfigurationProps) {
  const selectedProfileData = data?.agentProfiles.find(
    (profile) => profile.id === selectedProfile,
  );

  return (
    <section className="flex-1">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Current Agent Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Profile
            </h3>
            {selectedProfileData ? (
              <div className="rounded-md border p-3 text-sm">
                <p className="font-medium">{selectedProfileData.name}</p>
                <p className="text-muted-foreground">
                  {selectedProfileData.description}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No profile selected.
              </p>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Selected Skills
            </h3>
            {selectedSkills.length > 0 && data ? (
              <ul className="space-y-2">
                {selectedSkills.map((skillId) => {
                  const skill = data.skills.find((item) => item.id === skillId);
                  return (
                    <li
                      key={skillId}
                      className="flex items-center justify-between rounded-md border p-2"
                    >
                      <Badge variant="secondary">{skill?.name}</Badge>
                      <Button
                        onClick={() => onRemoveSkill(skillId)}
                        size="sm"
                        variant="outline"
                      >
                        Remove
                      </Button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No skills added.</p>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Selected Layers
            </h3>
            {selectedLayers.length > 0 && data ? (
              <ul className="space-y-2">
                {selectedLayers.map((layerId) => {
                  const layer = data.layers.find((item) => item.id === layerId);
                  return (
                    <li
                      key={layerId}
                      className="flex items-center justify-between rounded-md border p-2"
                    >
                      <Badge variant="outline">{layer?.name}</Badge>
                      <Button
                        onClick={() => onRemoveLayer(layerId)}
                        size="sm"
                        variant="outline"
                      >
                        Remove
                      </Button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No layers added.</p>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Selected Provider
            </h3>
            {selectedProvider ? (
              <Badge>{selectedProvider}</Badge>
            ) : (
              <p className="text-sm text-muted-foreground">
                No provider selected.
              </p>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="agent-name-input">Save This Agent</Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="agent-name-input"
                type="text"
                placeholder="Enter agent name..."
                value={agentName}
                onChange={(e) => onAgentNameChange(e.target.value)}
                className="flex-1"
                aria-invalid={!!validationErrors.name}
              />
              <Button onClick={onSaveAgent} className="sm:w-auto">
                Save Agent
              </Button>
            </div>
            {validationErrors.name && (
              <p className="text-xs text-destructive">
                {validationErrors.name}
              </p>
            )}
            {validationErrors.form && (
              <p className="text-xs text-destructive">
                {validationErrors.form}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
