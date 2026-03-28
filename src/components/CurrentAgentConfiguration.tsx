import type { AgentData, AgentValidationErrors } from "../types/agent";
import { BadgeCheck, Cpu, Layers3, Sparkles, UserRound, X } from "lucide-react";
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
  const chipBaseClass =
    "inline-flex h-9 items-center gap-2 rounded-full border px-3 text-sm shadow-sm";

  const selectedProfileData = data?.agentProfiles.find(
    (profile) => profile.id === selectedProfile,
  );

  return (
    <section className="flex-1">
      <Card className="h-full border-gray-200 shadow-sm flex flex-col">
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
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md">
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
                      className={`${chipBaseClass} border-gray-200 bg-white`}
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
                      className={`${chipBaseClass} border-indigo-100 bg-indigo-50`}
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

          <div className="space-y-4 bg-gray-50 -mx-6 -mb-6 p-6 rounded-b-xl border-t border-gray-200 mt-auto">
            <div className="mb-2">
              <Label
                htmlFor="agent-name-input"
                className="text-gray-900 font-bold text-base block mb-1 flex items-center gap-2"
              >
                <BadgeCheck className="h-4 w-4 text-indigo-600" />
                Make It Official
              </Label>
              <p className="text-sm text-gray-600">
                Give your new AI team member a name and deploy them immediately.
              </p>
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
              <Button
                onClick={onSaveAgent}
                className="sm:w-auto font-bold shadow-md bg-indigo-600 hover:bg-indigo-700 text-white transition-all px-8"
              >
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
