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
      <Card className="h-full border-gray-200 shadow-sm flex flex-col">
        <CardHeader className="border-b border-gray-100 mb-4 pb-4">
          <CardTitle className="text-xl font-bold text-gray-900">Current Agent Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 flex-1 flex flex-col">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Profile
            </h3>
            {selectedProfileData ? (
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md">
                <p className="font-bold text-gray-900 text-base">{selectedProfileData.name}</p>
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
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Selected Skills
            </h3>
            {selectedSkills.length > 0 && data ? (
              <ul className="space-y-2">
                {selectedSkills.map((skillId) => {
                  const skill = data.skills.find((item) => item.id === skillId);
                  return (
                    <li
                      key={skillId}
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm hover:border-indigo-200 transition-colors"
                    >
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">{skill?.name}</Badge>
                      <Button
                        onClick={() => onRemoveSkill(skillId)}
                        size="sm"
                        variant="ghost"
                        className="h-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">No skills added.</p>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Selected Layers
            </h3>
            {selectedLayers.length > 0 && data ? (
              <ul className="space-y-2">
                {selectedLayers.map((layerId) => {
                  const layer = data.layers.find((item) => item.id === layerId);
                  return (
                    <li
                      key={layerId}
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm hover:border-indigo-200 transition-colors"
                    >
                      <Badge variant="outline" className="border-gray-200 text-gray-700">{layer?.name}</Badge>
                      <Button
                        onClick={() => onRemoveLayer(layerId)}
                        size="sm"
                        variant="ghost"
                        className="h-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </Button>
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
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Selected Provider
              </h3>
              {selectedProvider ? (
                <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200">{selectedProvider}</Badge>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No provider selected.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4 bg-gray-50 -mx-6 -mb-6 p-6 rounded-b-xl border-t border-gray-200 mt-auto">
            <div className="mb-2">
              <Label htmlFor="agent-name-input" className="text-gray-900 font-bold text-base block mb-1">Make It Official</Label>
              <p className="text-sm text-gray-600">Give your new AI team member a name and deploy them immediately.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                id="agent-name-input"
                type="text"
                placeholder="e.g., Support Specialist, Data Analyst..."
                value={agentName}
                onChange={(e) => onAgentNameChange(e.target.value)}
                className="flex-1 bg-white border-gray-300 focus-visible:ring-indigo-600 shadow-sm"
                aria-invalid={!!validationErrors.name}
              />
              <Button onClick={onSaveAgent} className="sm:w-auto font-bold shadow-md bg-indigo-600 hover:bg-indigo-700 text-white transition-all px-8">
                Hire The Best Team
              </Button>
            </div>
            {validationErrors.name && (
              <p className="text-xs font-semibold text-red-600">
                {validationErrors.name}
              </p>
            )}
            {validationErrors.form && (
              <p className="text-xs font-semibold text-red-600">
                {validationErrors.form}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
